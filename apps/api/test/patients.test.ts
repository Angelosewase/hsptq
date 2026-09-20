import { describe, expect, it, vi } from "vitest";
import { createApp } from "../src/app";
import {
  createPatient,
  findPatientByPhone,
} from "../src/services/patient.service";

vi.mock("../src/services/patient.service", () => ({
  createPatient: vi.fn(),
  findPatientByPhone: vi.fn(),
}));

describe("Patient Routes", () => {
  it("POST /patients should return existing patient", async () => {
    const mockPatient = {
      id: "1",
      name: "Jane",
      phone: "+1234567890",
      nationalId: null,
      createdAt: new Date(),
    };
    vi.mocked(findPatientByPhone).mockResolvedValue(mockPatient as any);

    const app = createApp();
    const res = await app.request("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Jane", phone: "+1234567890" }),
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.id).toBe("1");
  });

  it("POST /patients should create new patient", async () => {
    const mockPatient = {
      id: "2",
      name: "John",
      phone: "+0987654321",
      nationalId: null,
      createdAt: new Date(),
    };
    vi.mocked(findPatientByPhone).mockResolvedValue(null);
    vi.mocked(createPatient).mockResolvedValue(mockPatient as any);

    const app = createApp();
    const res = await app.request("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "John",
        phone: "+0987654321",
        password: "secure",
      }),
    });

    expect(res.status).toBe(201);
  });
});
