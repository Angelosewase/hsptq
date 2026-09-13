import { getPrisma } from "../lib/prisma";
import { hashPassword } from "./auth.service";

interface PatientCreateInput {
  name: string;
  phone: string;
  nationalId?: string;
  password?: string;
  pin?: string;
}

export async function findPatientByPhone(phone: string) {
  const prisma = getPrisma();
  return prisma.patient.findUnique({ where: { phone } });
}

export async function createPatient(data: PatientCreateInput) {
  const prisma = getPrisma();
  
  const createData: any = {
    name: data.name,
    phone: data.phone,
    nationalId: data.nationalId,
  };

  if (data.password) {
    createData.password = await hashPassword(data.password);
  }
  
  if (data.pin) {
    createData.pin = await hashPassword(data.pin);
  }

  return prisma.patient.create({ data: createData });
}

export async function updatePatientAuth(patientId: string, updates: { password?: string, pin?: string }) {
  const prisma = getPrisma();
  const updateData: any = {};
  
  if (updates.password) updateData.password = await hashPassword(updates.password);
  if (updates.pin) updateData.pin = await hashPassword(updates.pin);
  
  if (Object.keys(updateData).length === 0) return null;
  
  return prisma.patient.update({
    where: { id: patientId },
    data: updateData,
  });
}
