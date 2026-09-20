import { describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app";
import { checkIn, getVisitStatus } from "../src/services/visit.service";

// Mock middleware
vi.mock("../src/lib/middleware", () => ({
  staffAuth: async (c: any, next: any) => await next(),
  authMiddleware: async (c: any, next: any) => await next(),
}));

vi.mock("../src/lib/prisma", () => ({
  getPrisma: vi.fn(() => ({
    patient: { findUnique: vi.fn().mockResolvedValue({ id: "p1" }) },
    department: { findUnique: vi.fn().mockResolvedValue({ id: "d1" }) },
  })),
}));

vi.mock("../src/services/visit.service", () => ({
  checkIn: vi.fn(),
  getVisitStatus: vi.fn(),
  updateVisitStatus: vi.fn(),
}));

describe("Visit Routes", () => {
  it("POST /visits should check in", async () => {
    const mockVisit = {
      id: "v1",
      patientId: "p1",
      departmentId: "d1",
      queueNumber: 5,
      source: "app",
      status: "waiting",
      createdAt: new Date(),
      calledAt: null,
      servedAt: null,
    };
    vi.mocked(checkIn).mockResolvedValue(mockVisit as any);

    const app = createApp();
    const res = await app.request("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: "p1",
        departmentId: "d1",
        source: "app",
      }),
    });

    expect(res.status).toBe(201);
  });
});
