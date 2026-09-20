import { z } from "@hono/zod-openapi";

export const errorSchema = z.object({
  error: z.object({
    message: z.string(),
    status: z.number(),
  }),
});

export const loginRequestSchema = z.object({
  login: z.string().optional(),
  phone: z.string().optional(),
  password: z.string(),
});

export const authResponseSchema = z.object({
  token: z.string(),
});

export const staffSchema = z.object({
  id: z.string(),
  name: z.string(),
  login: z.string(),
  role: z.string(),
  departmentId: z.string().nullable(),
});

export const patientSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  nationalId: z.string().nullable(),
  createdAt: z.string(),
});

export const departmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  active: z.boolean(),
});

export const queueResponseSchema = z.object({
  waiting: z.number(),
  visits: z.array(
    z.object({
      id: z.string(),
      queueNumber: z.number(),
      status: z.string(),
      patientName: z.string(),
      source: z.string(),
      estimatedWaitMinutes: z.number().optional(),
    }),
  ),
});

export const visitSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  departmentId: z.string(),
  queueNumber: z.number(),
  source: z.enum(["app", "ussd", "qr"]),
  status: z.enum(["waiting", "called", "served", "no_show"]),
  createdAt: z.string(),
  calledAt: z.string().nullable(),
  servedAt: z.string().nullable(),
});

export const visitStatusSchema = z.object({
  queueNumber: z.number(),
  status: z.enum(["waiting", "called", "served", "no_show"]),
  position: z.number().nullable(),
  estimatedWaitMinutes: z.number(),
  department: z.object({
    id: z.string(),
    name: z.string(),
  }),
  patient: z.object({
    id: z.string(),
    name: z.string(),
    phone: z.string(),
  }),
});

export type PatientResponse = z.infer<typeof patientSchema>;
export type DepartmentResponse = z.infer<typeof departmentSchema>;
export type VisitResponse = z.infer<typeof visitSchema>;
export type VisitStatusResponse = z.infer<typeof visitStatusSchema>;
export type StaffResponse = z.infer<typeof staffSchema>;

export function toStaffResponse(staff: {
  id: string;
  name: string;
  login: string;
  role: string;
  departmentId: string | null;
}): StaffResponse {
  return {
    id: staff.id,
    name: staff.name,
    login: staff.login,
    role: staff.role,
    departmentId: staff.departmentId,
  };
}

export function toPatientResponse(patient: {
  id: string;
  name: string;
  phone: string;
  nationalId: string | null;
  createdAt: Date;
}): PatientResponse {
  return {
    id: patient.id,
    name: patient.name,
    phone: patient.phone,
    nationalId: patient.nationalId,
    createdAt: patient.createdAt.toISOString(),
  };
}

export function toVisitResponse(visit: {
  id: string;
  patientId: string;
  departmentId: string;
  queueNumber: number;
  source: "app" | "ussd" | "qr";
  status: "waiting" | "called" | "served" | "no_show";
  createdAt: Date;
  calledAt: Date | null;
  servedAt: Date | null;
}): VisitResponse {
  return {
    id: visit.id,
    patientId: visit.patientId,
    departmentId: visit.departmentId,
    queueNumber: visit.queueNumber,
    source: visit.source,
    status: visit.status,
    createdAt: visit.createdAt.toISOString(),
    calledAt: visit.calledAt?.toISOString() ?? null,
    servedAt: visit.servedAt?.toISOString() ?? null,
  };
}
