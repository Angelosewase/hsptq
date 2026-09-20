/**
 * Shared TypeScript types matching the API schemas.
 */

export type VisitSource = "app" | "ussd" | "qr";
export type VisitStatus = "waiting" | "called" | "served" | "no_show";

export interface Patient {
  id: string;
  name: string;
  phone: string;
  nationalId: string | null;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  active: boolean;
}

export interface Visit {
  id: string;
  patientId: string;
  departmentId: string;
  queueNumber: number;
  source: VisitSource;
  status: VisitStatus;
  createdAt: string;
  calledAt: string | null;
  servedAt: string | null;
}

export interface VisitStatusResponse {
  queueNumber: number;
  status: VisitStatus;
  position: number | null;
  estimatedWaitMinutes: number;
  department: {
    id: string;
    name: string;
  };
  patient: {
    id: string;
    name: string;
    phone: string;
  };
}

export interface AuthResponse {
  token: string;
}

export interface ApiError {
  error: {
    message: string;
    status: number;
  };
}

export interface CheckInRequest {
  patientId: string;
  departmentId: string;
  source: VisitSource;
}

export interface CreatePatientRequest {
  name: string;
  phone: string;
  nationalId?: string;
  password?: string;
  pin?: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}
