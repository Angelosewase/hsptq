import { OpenAPIHono } from "@hono/zod-openapi";
import { handleUssdRequest } from "../services/ussd.service";

export function registerUssdRoutes(app: OpenAPIHono) {
  // We use standard hono post because Africa's Talking sends urlencoded form data, not json.
  // We don't necessarily need to document this in swagger as it is a webhook for an external service.
  app.post("/ussd/africastalking", async (c) => {
    const body = await c.req.parseBody();
    
    const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
    const phoneNumber = typeof body.phoneNumber === "string" ? body.phoneNumber : "";
    const text = typeof body.text === "string" ? body.text : "";

    const response = await handleUssdRequest(sessionId, phoneNumber, text);
    
    // Africa's Talking expects plain text starting with CON or END
    c.header("Content-Type", "text/plain");
    return c.text(response);
  });
}
