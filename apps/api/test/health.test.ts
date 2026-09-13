import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";

describe("GET /api/health", () => {
  it("responds with ok status", async () => {
    const res = await createApp().request("/api/health");
    expect(res.status).toBe(200);

    const body = (await res.json()) as { status: string };
    expect(body.status).toBe("ok");
  });

  it("mounts the OpenAPI doc and UI endpoints", async () => {
    const app = createApp();
    expect((await app.request("/api/doc")).status).toBe(200);
    expect((await app.request("/api/ui")).status).toBe(200);
  });
});
