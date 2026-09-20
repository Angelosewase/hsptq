/**
 * AuthContext — manages patient authentication state.
 * Stores JWT in expo-secure-store, exposes login/register/logout,
 * and provides the current patient ID to the rest of the app.
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import {
  loginPatient as apiLogin,
  registerPatient as apiRegister,
  setToken,
  clearToken,
} from "./api";
import type { LoginRequest, CreatePatientRequest } from "./types";

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  patientId: string | null;
  patientName: string | null;
}

interface AuthContextValue extends AuthState {
  login: (body: LoginRequest) => Promise<void>;
  register: (body: CreatePatientRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const PATIENT_ID_KEY = "carequeue_patient_id";
const PATIENT_NAME_KEY = "carequeue_patient_name";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    patientId: null,
    patientName: null,
  });

  // Check for existing token on mount
  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync("carequeue_token");
      const patientId = await SecureStore.getItemAsync(PATIENT_ID_KEY);
      const patientName = await SecureStore.getItemAsync(PATIENT_NAME_KEY);

      setState({
        isLoading: false,
        isAuthenticated: !!token,
        patientId: patientId ?? null,
        patientName: patientName ?? null,
      });
    })();
  }, []);

  const login = useCallback(async (body: LoginRequest) => {
    await apiLogin(body);
    // After successful login we need patient info; decode from token or
    // use a /me endpoint. For now, store phone as identifier —
    // the API returns just a token. We'll re-fetch after check-in.
    // We do a quick workaround: store the phone.
    await SecureStore.setItemAsync(PATIENT_ID_KEY, "pending");
    await SecureStore.setItemAsync(PATIENT_NAME_KEY, body.phone);

    setState({
      isLoading: false,
      isAuthenticated: true,
      patientId: "pending",
      patientName: body.phone,
    });
  }, []);

  const register = useCallback(async (body: CreatePatientRequest) => {
    const patient = await apiRegister(body);

    // Now login to get a JWT
    if (body.password) {
      await apiLogin({ phone: body.phone, password: body.password });
    }

    await SecureStore.setItemAsync(PATIENT_ID_KEY, patient.id);
    await SecureStore.setItemAsync(PATIENT_NAME_KEY, patient.name);

    setState({
      isLoading: false,
      isAuthenticated: true,
      patientId: patient.id,
      patientName: patient.name,
    });
  }, []);

  const logout = useCallback(async () => {
    await clearToken();
    await SecureStore.deleteItemAsync(PATIENT_ID_KEY);
    await SecureStore.deleteItemAsync(PATIENT_NAME_KEY);

    setState({
      isLoading: false,
      isAuthenticated: false,
      patientId: null,
      patientName: null,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
