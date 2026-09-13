import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { getPrisma } from "../lib/prisma";
import {
  errorSchema,
  toVisitResponse,
  visitSchema,
  visitStatusSchema,
} from "../schemas";

const AVG_VISIT_MINUTES = 10;

const PATH = { id: z.object({ id: z.string() }) };

const checkInRoute = createRoute({
  method: "post",
  path: "/visits",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z
            .object({
              patientId: z.string(),
              departmentId: z.string(),
              source: z.enum(["app", "ussd", "qr"]),
            })
            .openapi("CheckInRequest"),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Visit created and queued",
      content: { "application/json": { schema: visitSchema } },
    },
    404: {
      description: "Patient or department not found",
      content: { "application/json": { schema: errorSchema } },
    },
  },
});

const visitStatusRoute = createRoute({
  method: "get",
  path: "/visits/{id}/status",
  request: { params: PATH.id },
  responses: {
    200: {
      description: "Live queue position for the visit",
      content: { "application/json": { schema: visitStatusSchema } },
    },
    404: {
      description: "Visit not found",
      content: { "application/json": { schema: errorSchema } },
    },
  },
});

function stateTransitionRoute(path: string, description: string) {
  return createRoute({
    method: "post" as const,
    path,
    request: { params: PATH.id },
    responses: {
      200: {
        description,
        content: { "application/json": { schema: visitSchema } },
      },
      404: {
        description: "Visit not found",
        content: { "application/json": { schema: errorSchema } },
      },
    },
  });
}

export function registerVisitRoutes(app: OpenAPIHono) {
  app.openapi(checkInRoute, async (c) => {
    const input = c.req.valid("json");
    const prisma = getPrisma();

    const [patient, department] = await Promise.all([
      prisma.patient.findUnique({ where: { id: input.patientId } }),
      prisma.department.findUnique({ where: { id: input.departmentId } }),
    ]);
    if (!patient || !department) {
      const missing = !patient ? "Patient" : "Department";
      return c.json(
        { error: { message: `${missing} not found`, status: 404 } },
        404,
      );
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const visit = await prisma.$transaction(async (tx) => {
      const todaysCount = await tx.visit.count({
        where: {
          departmentId: input.departmentId,
          createdAt: { gte: startOfDay },
        },
      });
      return tx.visit.create({
        data: {
          patientId: input.patientId,
          departmentId: input.departmentId,
          source: input.source,
          queueNumber: todaysCount + 1,
        },
      });
    });

    return c.json(toVisitResponse(visit), 201);
  });

  app.openapi(visitStatusRoute, async (c) => {
    const { id } = c.req.valid("param");
    const prisma = getPrisma();

    const visit = await prisma.visit.findUnique({
      where: { id },
      include: { department: true, patient: true },
    });
    if (!visit) {
      return c.json(
        { error: { message: "Visit not found", status: 404 } },
        404,
      );
    }

    let position: number | null = null;
    if (visit.status === "waiting") {
      const ahead = await prisma.visit.count({
        where: {
          departmentId: visit.departmentId,
          status: "waiting",
          createdAt: { lt: visit.createdAt },
        },
      });
      position = ahead + 1;
    }

    return c.json(
      {
        queueNumber: visit.queueNumber,
        status: visit.status,
        position,
        estimatedWaitMinutes:
          position === null ? 0 : position * AVG_VISIT_MINUTES,
        department: { id: visit.department.id, name: visit.department.name },
        patient: {
          id: visit.patient.id,
          name: visit.patient.name,
          phone: visit.patient.phone,
        },
      },
      200,
    );
  });

  const updateVisitStatus = async (
    id: string,
    nextStatus: "called" | "served" | "no_show",
  ) => {
    const prisma = getPrisma();

    const existing = await prisma.visit.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }

    return prisma.visit.update({
      where: { id },
      data:
        nextStatus === "called"
          ? { status: "called", calledAt: new Date() }
          : nextStatus === "served"
            ? { status: "served", servedAt: new Date() }
            : { status: "no_show" },
    });
  };

  const callRoute = stateTransitionRoute(
    "/visits/{id}/call",
    "Call the patient next",
  );
  const serveRoute = stateTransitionRoute(
    "/visits/{id}/serve",
    "Mark the visit as served",
  );
  const noShowRoute = stateTransitionRoute(
    "/visits/{id}/no-show",
    "Mark the visit as no-show",
  );

  app.openapi(callRoute, async (c) => {
    const { id } = c.req.valid("param");
    const visit = await updateVisitStatus(id, "called");
    if (!visit) {
      return c.json(
        { error: { message: "Visit not found", status: 404 } },
        404,
      );
    }
    return c.json(toVisitResponse(visit), 200);
  });

  app.openapi(serveRoute, async (c) => {
    const { id } = c.req.valid("param");
    const visit = await updateVisitStatus(id, "served");
    if (!visit) {
      return c.json(
        { error: { message: "Visit not found", status: 404 } },
        404,
      );
    }
    return c.json(toVisitResponse(visit), 200);
  });

  app.openapi(noShowRoute, async (c) => {
    const { id } = c.req.valid("param");
    const visit = await updateVisitStatus(id, "no_show");
    if (!visit) {
      return c.json(
        { error: { message: "Visit not found", status: 404 } },
        404,
      );
    }
    return c.json(toVisitResponse(visit), 200);
  });
}
