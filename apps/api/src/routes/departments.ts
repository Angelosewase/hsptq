import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { departmentSchema, errorSchema, queueResponseSchema } from "../schemas";
import { listActiveDepartments, getDepartmentQueue } from "../services/department.service";
import { staffAuth } from "../lib/middleware";

const listDepartmentsRoute = createRoute({
  method: "get",
  path: "/departments",
  responses: {
    200: {
      description: "List of active departments",
      content: {
        "application/json": {
          schema: z.array(departmentSchema),
        },
      },
    },
  },
});

const getDepartmentQueueRoute = createRoute({
  method: "get",
  path: "/departments/{id}/queue",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "Live queue for a department",
      content: { "application/json": { schema: queueResponseSchema } },
    },
    404: {
      description: "Department not found",
      content: { "application/json": { schema: errorSchema } },
    },
  },
});

export function registerDepartmentRoutes(app: OpenAPIHono) {
  app.openapi(listDepartmentsRoute, async (c) => {
    const departments = await listActiveDepartments();
    return c.json(departments, 200);
  });

  // Protect queue endpoint with staff JWT
  app.use("/departments/*/queue", staffAuth);
  app.openapi(getDepartmentQueueRoute, async (c) => {
    const { id } = c.req.valid("param");
    const queue = await getDepartmentQueue(id);
    
    if (!queue) {
      return c.json({ error: { message: "Department not found", status: 404 } }, 404);
    }
    
    return c.json(queue, 200);
  });
}
