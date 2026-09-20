/**
 * API client — fetch wrapper with auth token injection.
 * All requests go through this module so auth headers and error handling are consistent.
 */
import * as SecureStore from "expo-secure-store";
import type {
  AuthResponse,
  CheckInRequest,
  CreatePatientRequest,
  Department,
  LoginRequest,
  Patient,
  Visit,
  VisitStatusResponse,
} from "./types";

const TOKEN_KEY = "carequeue_token";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3002/api";

async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function hasToken(): Promise<boolean> {
  const token = await getToken();
  return !!token;
}

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message ?? "An unexpected error occurred";
    throw new ApiError(message, response.status);
  }

  return data as T;
}

// ── Auth ──────────────────────────────────────────────

export async function loginPatient(body: LoginRequest): Promise<AuthResponse> {
  const result = await request<AuthResponse>("/auth/patient/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
  await setToken(result.token);
  return result;
}

// ── Patients ──────────────────────────────────────────

export async function registerPatient(
  body: CreatePatientRequest,
): Promise<Patient> {
  return request<Patient>("/patients", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ── Departments ───────────────────────────────────────

export async function listDepartments(): Promise<Department[]> {
  return request<Department[]>("/departments");
}

// ── Visits ────────────────────────────────────────────

export async function checkIn(body: CheckInRequest): Promise<Visit> {
  return request<Visit>("/visits", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getVisitStatus(
  visitId: string,
): Promise<VisitStatusResponse> {
  return request<VisitStatusResponse>(`/visits/${visitId}/status`);
}

export async function getActiveVisit(): Promise<Visit | null> {
  try {
    return await request<Visit>("/visits/active");
  } catch {
    return null;
  }
}
