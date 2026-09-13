import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { errorSchema, patientSchema, toPatientResponse } from "../schemas";
import { createPatient, findPatientByPhone } from "../services/patient.service";

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
              password: z.string().optional(),
              pin: z.string().length(4).optional(),
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

    const existing = await findPatientByPhone(input.phone);
    if (existing) {
      return c.json(toPatientResponse(existing), 200);
    }

    const patient = await createPatient(input);
    return c.json(toPatientResponse(patient), 201);
  });
}
