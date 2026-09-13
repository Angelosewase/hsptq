import { getPrisma } from "../lib/prisma";

export async function listActiveDepartments() {
  const prisma = getPrisma();
  return prisma.department.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
}

export async function getDepartmentQueue(departmentId: string) {
  const prisma = getPrisma();
  
  const department = await prisma.department.findUnique({ where: { id: departmentId } });
  if (!department) return null;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const visits = await prisma.visit.findMany({
    where: {
      departmentId,
      createdAt: { gte: startOfDay },
      status: { in: ["waiting", "called"] },
    },
    include: { patient: true },
    orderBy: { queueNumber: "asc" },
  });

  return {
    waiting: visits.filter(v => v.status === "waiting").length,
    visits: visits.map(v => ({
      id: v.id,
      queueNumber: v.queueNumber,
      status: v.status,
      patientName: v.patient.name,
      source: v.source,
    })),
  };
}
