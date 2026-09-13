import { describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app";
import { listActiveDepartments, getDepartmentQueue } from "../src/services/department.service";

vi.mock("../src/services/department.service", () => ({
  listActiveDepartments: vi.fn(),
  getDepartmentQueue: vi.fn()
}));

// Mock middleware to bypass JWT for tests
vi.mock("../src/lib/middleware", () => ({
  staffAuth: async (c: any, next: any) => await next(),
  authMiddleware: async (c: any, next: any) => await next()
}));

describe("Department Routes", () => {
  it("GET /departments should return list", async () => {
    vi.mocked(listActiveDepartments).mockResolvedValue([
      { id: "1", name: "Cardiology", active: true }
    ]);

    const app = createApp();
    const res = await app.request("/api/departments");

    expect(res.status).toBe(200);
    const body = await res.json() as any[];
    expect(body).toHaveLength(1);
    expect(body[0].name).toBe("Cardiology");
  });

  it("GET /departments/:id/queue should return queue", async () => {
    vi.mocked(getDepartmentQueue).mockResolvedValue({
      waiting: 1,
      visits: [
        { id: "v1", queueNumber: 1, status: "waiting", patientName: "John", source: "app", estimatedWaitMinutes: 10 }
      ]
    });

    const app = createApp();
    const res = await app.request("/api/departments/1/queue");

    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.waiting).toBe(1);
    expect(body.visits).toHaveLength(1);
  });
});
