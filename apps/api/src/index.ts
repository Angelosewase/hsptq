import "dotenv/config";
import { serve } from "@hono/node-server";
import { createApp } from "./app";
import { config } from "./config";

serve({ fetch: createApp().fetch, port: config.port }, (info) => {
  console.log(`api listening on http://localhost:${info.port}`);
});
