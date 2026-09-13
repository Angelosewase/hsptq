import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { errorSchema, toVisitResponse, visitSchema, visitStatusSchema } from "../schemas";
import { checkIn, getVisitStatus, updateVisitStatus } from "../services/visit.service";
import { getPrisma } from "../lib/prisma"; // just for finding patient/department in checkIn if needed, or we can just catch errors
import { staffAuth, authMiddleware } from "../lib/middleware";

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

const callRoute = stateTransitionRoute("/visits/{id}/call", "Call the patient next");
const serveRoute = stateTransitionRoute("/visits/{id}/serve", "Mark the visit as served");
const noShowRoute = stateTransitionRoute("/visits/{id}/no-show", "Mark the visit as no-show");

export function registerVisitRoutes(app: OpenAPIHono) {
  // Use authMiddleware for patient actions
  app.use("/visits", authMiddleware);
  app.use("/visits/*/status", authMiddleware);
  
  // Use staffAuth for staff actions
  app.use("/visits/*/call", staffAuth);
  app.use("/visits/*/serve", staffAuth);
  app.use("/visits/*/no-show", staffAuth);

  app.openapi(checkInRoute, async (c) => {
    const input = c.req.valid("json");
    
    // Quick validation
    const prisma = getPrisma();
    const [patient, department] = await Promise.all([
      prisma.patient.findUnique({ where: { id: input.patientId } }),
      prisma.department.findUnique({ where: { id: input.departmentId } }),
    ]);
    if (!patient || !department) {
      const missing = !patient ? "Patient" : "Department";
      return c.json({ error: { message: `${missing} not found`, status: 404 } }, 404);
    }

    const visit = await checkIn(input.patientId, input.departmentId, input.source);
    return c.json(toVisitResponse(visit), 201);
  });

  app.openapi(visitStatusRoute, async (c) => {
    const { id } = c.req.valid("param");
    const statusResult = await getVisitStatus(id);

    if (!statusResult) {
      return c.json({ error: { message: "Visit not found", status: 404 } }, 404);
    }

    const { visit, position, estimatedWaitMinutes } = statusResult;
    return c.json({
      queueNumber: visit.queueNumber,
      status: visit.status,
      position,
      estimatedWaitMinutes,
      department: { id: visit.department.id, name: visit.department.name },
      patient: {
        id: visit.patient.id,
        name: visit.patient.name,
        phone: visit.patient.phone,
      },
    }, 200);
  });

  app.openapi(callRoute, async (c) => {
    const { id } = c.req.valid("param");
    const visit = await updateVisitStatus(id, "called");
    if (!visit) return c.json({ error: { message: "Visit not found", status: 404 } }, 404);
    return c.json(toVisitResponse(visit), 200);
  });

  app.openapi(serveRoute, async (c) => {
    const { id } = c.req.valid("param");
    const visit = await updateVisitStatus(id, "served");
    if (!visit) return c.json({ error: { message: "Visit not found", status: 404 } }, 404);
    return c.json(toVisitResponse(visit), 200);
  });

  app.openapi(noShowRoute, async (c) => {
    const { id } = c.req.valid("param");
    const visit = await updateVisitStatus(id, "no_show");
    if (!visit) return c.json({ error: { message: "Visit not found", status: 404 } }, 404);
    return c.json(toVisitResponse(visit), 200);
  });
}
