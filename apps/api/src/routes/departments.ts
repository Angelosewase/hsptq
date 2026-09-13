import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { getPrisma } from "../lib/prisma";
import { departmentSchema } from "../schemas";

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

export function registerDepartmentRoutes(app: OpenAPIHono) {
  app.openapi(listDepartmentsRoute, async (c) => {
    const departments = await getPrisma().department.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
    return c.json(departments, 200);
  });
}
