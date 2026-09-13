import { describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app";
import { handleUssdRequest } from "../src/services/ussd.service";

vi.mock("../src/services/ussd.service", () => ({
  handleUssdRequest: vi.fn()
}));

describe("USSD Routes", () => {
  it("POST /ussd/africastalking should handle form data and return plain text", async () => {
    vi.mocked(handleUssdRequest).mockResolvedValue("CON Welcome");

    const app = createApp();
    
    // Simulate urlencoded form data
    const formData = new URLSearchParams();
    formData.append("sessionId", "session-123");
    formData.append("phoneNumber", "+123456");
    formData.append("text", "");

    const res = await app.request("/api/ussd/africastalking", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/plain; charset=UTF-8");
    const text = await res.text();
    expect(text).toBe("CON Welcome");
  });
});
