import * as bcrypt from "bcryptjs";
import { sign } from "hono/jwt";
import { getPrisma } from "../lib/prisma";

export const JWT_SECRET =
  process.env.JWT_SECRET || "default-secret-key-for-mvp";

export async function loginStaff(login: string, passwordPlain: string) {
  const prisma = getPrisma();
  const staff = await prisma.staff.findUnique({ where: { login } });

  if (!staff) return null;

  const isValid = await bcrypt.compare(passwordPlain, staff.password);
  if (!isValid) return null;

  const token = await sign(
    {
      id: staff.id,
      role: staff.role,
      type: "staff",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    },
    JWT_SECRET,
  );

  return { staff, token };
}

export async function loginPatientApp(phone: string, passwordPlain: string) {
  const prisma = getPrisma();
  const patient = await prisma.patient.findUnique({ where: { phone } });

  if (!patient || !patient.password) return null;

  const isValid = await bcrypt.compare(passwordPlain, patient.password);
  if (!isValid) return null;

  const token = await sign(
    {
      id: patient.id,
      type: "patient",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    },
    JWT_SECRET,
  );

  return { patient, token };
}

export async function verifyPatientPin(phone: string, pinPlain: string) {
  const prisma = getPrisma();
  const patient = await prisma.patient.findUnique({ where: { phone } });

  if (!patient || !patient.pin) return null;

  const isValid = await bcrypt.compare(pinPlain, patient.pin);
  if (!isValid) return null;

  return patient;
}

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}
