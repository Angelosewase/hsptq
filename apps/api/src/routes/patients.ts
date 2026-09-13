import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { getPrisma } from "../lib/prisma";
import { errorSchema, patientSchema, toPatientResponse } from "../schemas";

const createPatientRoute = createRoute({
  method: "post",
  path: "/patients",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z
            .object({
              name: z.string().min(1).max(200),
              phone: z.string().regex(/^\+?\d{8,15}$/, "Invalid phone number"),
              nationalId: z.string().min(1).max(60).optional(),
            })
            .openapi("CreatePatientRequest"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Existing patient matched by phone",
      content: { "application/json": { schema: patientSchema } },
    },
    201: {
      description: "New patient created",
      content: { "application/json": { schema: patientSchema } },
    },
    400: {
      description: "Invalid request body",
      content: { "application/json": { schema: errorSchema } },
    },
  },
});

export function registerPatientRoutes(app: OpenAPIHono) {
  app.openapi(createPatientRoute, async (c) => {
    const input = c.req.valid("json");
    const prisma = getPrisma();

    const existing = await prisma.patient.findUnique({
      where: { phone: input.phone },
    });
    if (existing) {
      return c.json(toPatientResponse(existing), 200);
    }

    const patient = await prisma.patient.create({
      data: {
        name: input.name,
        phone: input.phone,
        nationalId: input.nationalId,
      },
    });
    return c.json(toPatientResponse(patient), 201);
  });
}
