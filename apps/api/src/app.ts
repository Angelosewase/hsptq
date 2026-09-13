import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { notFound, onError } from "./lib/http";
import { registerDepartmentRoutes } from "./routes/departments";
import { registerHealthRoutes } from "./routes/health";
import { registerPatientRoutes } from "./routes/patients";
import { registerVisitRoutes } from "./routes/visits";

export function createApp() {
  const app = new OpenAPIHono();

  app.use("*", logger());
  app.use("*", prettyJSON());
  app.use("/api/*", cors());

  const api = new OpenAPIHono();

  registerHealthRoutes(api);
  registerPatientRoutes(api);
  registerDepartmentRoutes(api);
  registerVisitRoutes(api);

  app.route("/api", api);

  app.doc("/api/doc", {
    openapi: "3.0.0",
    info: {
      title: "Hospital Queue & Scheduling API",
      description: "Core API for the hsptq hospital queue system.",
      version: "0.1.0",
    },
  });
  app.get("/api/ui", swaggerUI({ url: "/api/doc" }));

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
