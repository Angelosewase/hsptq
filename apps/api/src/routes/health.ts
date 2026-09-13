import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

const healthRoute = createRoute({
  method: "get",
  path: "/health",
  responses: {
    200: {
      description: "Service health check",
      content: {
        "application/json": {
          schema: z.object({
            status: z.literal("ok"),
            service: z.literal("hsptq-api"),
            timestamp: z.string(),
          }),
        },
      },
    },
  },
});

export function registerHealthRoutes(app: OpenAPIHono) {
  app.openapi(healthRoute, (c) =>
    c.json(
      {
        status: "ok",
        service: "hsptq-api",
        timestamp: new Date().toISOString(),
      },
      200,
    ),
  );
}
