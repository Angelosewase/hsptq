import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { loginStaff, loginPatientApp } from "../services/auth.service";
import { authResponseSchema, errorSchema, loginRequestSchema } from "../schemas";

const staffLoginRoute = createRoute({
  method: "post",
  path: "/auth/staff/login",
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successful login",
      content: { "application/json": { schema: authResponseSchema } },
    },
    400: {
      description: "Bad request",
      content: { "application/json": { schema: errorSchema } },
    },
    401: {
      description: "Invalid credentials",
      content: { "application/json": { schema: errorSchema } },
    },
  },
});

const patientLoginRoute = createRoute({
  method: "post",
  path: "/auth/patient/login",
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successful login",
      content: { "application/json": { schema: authResponseSchema } },
    },
    400: {
      description: "Bad request",
      content: { "application/json": { schema: errorSchema } },
    },
    401: {
      description: "Invalid credentials",
      content: { "application/json": { schema: errorSchema } },
    },
  },
});

export function registerAuthRoutes(app: OpenAPIHono) {
  app.openapi(staffLoginRoute, async (c) => {
    const { login, password } = c.req.valid("json");
    if (!login) return c.json({ error: { message: "Login ID required", status: 400 } }, 400);

    const result = await loginStaff(login, password);
    if (!result) return c.json({ error: { message: "Invalid credentials", status: 401 } }, 401);

    return c.json({ token: result.token }, 200);
  });

  app.openapi(patientLoginRoute, async (c) => {
    const { phone, password } = c.req.valid("json");
    if (!phone) return c.json({ error: { message: "Phone required", status: 400 } }, 400);

    const result = await loginPatientApp(phone, password);
    if (!result) return c.json({ error: { message: "Invalid credentials", status: 401 } }, 401);

    return c.json({ token: result.token }, 200);
  });
}
