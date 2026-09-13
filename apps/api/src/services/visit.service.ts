import { getPrisma } from "../lib/prisma";
import type { VisitSource, VisitStatus } from "../generated/prisma/client";

const AVG_VISIT_MINUTES = 10;

export async function checkIn(patientId: string, departmentId: string, source: VisitSource) {
  const prisma = getPrisma();
  
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return prisma.$transaction(async (tx) => {
    const todaysCount = await tx.visit.count({
      where: {
        departmentId,
        createdAt: { gte: startOfDay },
      },
    });
    
    return tx.visit.create({
      data: {
        patientId,
        departmentId,
        source,
        queueNumber: todaysCount + 1,
      },
    });
  });
}

export async function getVisitStatus(visitId: string) {
  const prisma = getPrisma();
  
  const visit = await prisma.visit.findUnique({
    where: { id: visitId },
    include: { department: true, patient: true },
  });
  
  if (!visit) return null;

  let position: number | null = null;
  if (visit.status === "waiting") {
    const ahead = await prisma.visit.count({
      where: {
        departmentId: visit.departmentId,
        status: "waiting",
        createdAt: { lt: visit.createdAt },
      },
    });
    position = ahead + 1;
  }

  return { visit, position, estimatedWaitMinutes: position === null ? 0 : position * AVG_VISIT_MINUTES };
}

export async function updateVisitStatus(visitId: string, nextStatus: VisitStatus) {
  const prisma = getPrisma();
  
  const existing = await prisma.visit.findUnique({ where: { id: visitId } });
  if (!existing) return null;

  const data: any = { status: nextStatus };
  if (nextStatus === "called") data.calledAt = new Date();
  if (nextStatus === "served") data.servedAt = new Date();

  return prisma.visit.update({
    where: { id: visitId },
    data,
  });
}
