import { describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app";
import { loginStaff, loginPatientApp } from "../src/services/auth.service";

vi.mock("../src/services/auth.service", () => ({
  loginStaff: vi.fn(),
  loginPatientApp: vi.fn(),
  JWT_SECRET: "test-secret"
}));

describe("Auth Routes", () => {
  it("POST /auth/staff/login should return 200 on success", async () => {
    vi.mocked(loginStaff).mockResolvedValue({
      staff: { id: "1", name: "Admin", login: "admin", role: "admin", departmentId: null, password: "hashed_password" },
      token: "mock-jwt"
    });

    const app = createApp();
    const res = await app.request("/api/auth/staff/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: "admin", password: "password" })
    });

    expect(res.status).toBe(200);
    const body = await res.json() as { token: string };
    expect(body.token).toBe("mock-jwt");
  });

  it("POST /auth/staff/login should return 401 on invalid credentials", async () => {
    vi.mocked(loginStaff).mockResolvedValue(null);

    const app = createApp();
    const res = await app.request("/api/auth/staff/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: "admin", password: "wrong" })
    });

    expect(res.status).toBe(401);
  });
});
