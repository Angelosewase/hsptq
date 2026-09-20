import { getPrisma } from "../lib/prisma";
import { findPatientByPhone, createPatient } from "./patient.service";
import { listActiveDepartments } from "./department.service";
import { checkIn, getVisitStatus } from "./visit.service";
import { verifyPatientPin } from "./auth.service";

export async function handleUssdRequest(
  sessionId: string,
  phoneNumber: string,
  text: string,
) {
  const prisma = getPrisma();

  let session = await prisma.ussdSession.findUnique({ where: { sessionId } });
  if (!session) {
    session = await prisma.ussdSession.create({
      data: { sessionId, currentStep: "HOME", collected: {} },
    });
  }

  const collected: any = session.collected || {};
  let nextStep = session.currentStep;
  let responseText = "";

  const textArray = text.split("*");
  const lastInput = textArray[textArray.length - 1] || "";

  const patient = await findPatientByPhone(phoneNumber);

  // Simple Router based on step
  switch (session.currentStep) {
    case "HOME": {
      if (patient) {
        if (!patient.pin) {
          responseText =
            "CON Welcome to HospTQ. Please set a 4-digit PIN for future access:";
          nextStep = "SET_PIN";
        } else {
          responseText =
            "CON Welcome to HospTQ. Please enter your 4-digit PIN:";
          nextStep = "LOGIN_PIN";
        }
      } else {
        responseText =
          "CON Welcome to HospTQ. Please enter your full name to register:";
        nextStep = "REGISTER_NAME";
      }
      break;
    }

    case "SET_PIN": {
      if (lastInput.length < 4) {
        responseText = "CON PIN too short. Please set a 4-digit PIN:";
        nextStep = "SET_PIN";
      } else {
        collected.pin = lastInput;
        responseText = "CON Please enter your National ID (or 0 to skip):";
        nextStep = "REGISTER_ID";
      }
      break;
    }

    case "REGISTER_NAME": {
      collected.name = lastInput;
      responseText = "CON Please set a 4-digit PIN for your account:";
      nextStep = "SET_PIN";
      break;
    }

    case "REGISTER_ID": {
      const nationalId = lastInput === "0" ? undefined : lastInput;
      await createPatient({
        name: collected.name,
        phone: phoneNumber,
        nationalId,
        pin: collected.pin,
      });
      responseText =
        "CON Registration successful.\n1. Check-in\n2. Check Status";
      nextStep = "MAIN_MENU";
      break;
    }

    case "LOGIN_PIN": {
      const auth = await verifyPatientPin(phoneNumber, lastInput);
      if (auth) {
        responseText = "CON Login successful.\n1. Check-in\n2. Check Status";
        nextStep = "MAIN_MENU";
      } else {
        responseText = "CON Invalid PIN. Please try again:";
        nextStep = "LOGIN_PIN";
      }
      break;
    }

    case "MAIN_MENU": {
      if (lastInput === "1") {
        const departments = await listActiveDepartments();
        let menu = "CON Select Department:\n";
        departments.forEach((d, i) => {
          menu += `${i + 1}. ${d.name}\n`;
        });
        collected.departments = departments.map((d) => d.id);
        responseText = menu;
        nextStep = "SELECT_DEPARTMENT";
      } else if (lastInput === "2") {
        // Find latest active visit for patient
        if (patient) {
          const latestVisit = await prisma.visit.findFirst({
            where: {
              patientId: patient.id,
              status: { in: ["waiting", "called"] },
            },
            orderBy: { createdAt: "desc" },
          });
          if (latestVisit) {
            const status = await getVisitStatus(latestVisit.id);
            responseText = `END Your queue number is ${status?.visit.queueNumber}. There are ${status?.position ? status.position - 1 : 0} people ahead of you. Estimated wait: ${status?.estimatedWaitMinutes} mins.`;
          } else {
            responseText = "END You do not have an active queue ticket.";
          }
        }
        nextStep = "END";
      } else {
        responseText = "CON Invalid option.\n1. Check-in\n2. Check Status";
      }
      break;
    }

    case "SELECT_DEPARTMENT": {
      const index = parseInt(lastInput) - 1;
      const deptId = collected.departments?.[index];
      if (deptId && patient) {
        const visit = await checkIn(patient.id, deptId, "ussd");
        responseText = `END Check-in successful. Your queue number is ${visit.queueNumber}. You will receive an SMS shortly.`;
        nextStep = "END";
      } else {
        responseText =
          "END Invalid department selection. Please try again later.";
        nextStep = "END";
      }
      break;
    }

    default:
      responseText = "END An error occurred. Please try again.";
      nextStep = "END";
  }

  if (nextStep === "END") {
    await prisma.ussdSession.delete({ where: { sessionId } });
  } else {
    await prisma.ussdSession.update({
      where: { sessionId },
      data: { currentStep: nextStep, collected },
    });
  }

  return responseText;
}
