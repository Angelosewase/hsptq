# Hospital Queue & Scheduling System — MVP Specification

## 1. Overview

**Problem:** Patients spend long periods standing in physical reception lines just to register and get a queue position, even for routine general consultations.

**Solution:** A system where patients register and get a queue number either by scanning a QR code at the hospital or by dialing a USSD code, without going through the reception line. Hospital staff manage the live queue from a web dashboard. The patient's registration data (the information a receptionist would normally type in by hand) is captured automatically and made available to staff immediately.

**Pilot scope:** One facility, general consultation queuing only. No clinical/medical intake, no billing, no EMR integration in this phase.

---

## 2. System Architecture

Three thin clients talk to one core API, which is the single source of truth for queue logic and patient identity:

- **Patient mobile app** — for smartphone users. Registration, QR-code check-in, slot booking, live queue status, push notifications.
- **USSD gateway** — for feature-phone users, via a telecom aggregator (e.g. Africa's Talking sandbox for the MVP/demo stage). Registration, department selection, queue number, status check, all via numbered text menus.
- **Staff web dashboard** — hospital-facing only, not patient-facing. Live queue view per department, call-next, mark served/no-show.

**Design principle:** Phone number is the universal patient identity across app and USSD — a patient interacting through either channel should resolve to the same underlying record.

---

## 3. Core User Flows

### 4.1 Patient — Mobile App

1. Register: name, phone number, national ID/patient ID, reason for visit
2. Check in either by:
   - Scanning a QR code at the hospital (deep link opens the app directly into check-in, pre-filled with department/hospital)
   - Booking a time slot ahead of time from home (secondary flow)
3. Select department from a picklist (no free-text symptom parsing in MVP)
4. Receive a queue number
5. View live position and estimated wait, refreshed periodically
6. Receive a push notification when their turn is approaching

### 4.2 Patient — USSD

1. Dial the USSD short code (sandbox code during development)
2. Registration: name and ID collected via menu prompts if new; returning patients recognized by phone number
3. Select department from a numbered menu (e.g. "1. General Medicine 2. Dentistry 3. Pediatrics")
4. Receive a queue number as a text response
5. Dial in again (or a "check status" menu option) to see current position
6. Receive an SMS when their turn is approaching (USSD sessions aren't persistent, so this can't be a push notification)

### 4.3 Staff — Web Dashboard

1. Log in (department-scoped or facility-wide access)
2. View live queue for their department: patient name, queue number, wait time, source (app/USSD/QR)
3. Call next patient (advances queue state, could trigger the patient's notification)
4. Mark patient as served or no-show
5. (Nice-to-have, not required for MVP) Basic daily counts: patients served, average wait time, no-show rate

---

## 5. Data Model (draft)

| Table           | Key fields                                                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `patients`      | id, name, phone (unique), national_id, created_at                                                                                                     |
| `departments`   | id, name, active (boolean)                                                                                                                            |
| `visits`        | id, patient_id, department_id, queue_number, source (app / ussd / qr), status (waiting / called / served / no_show), created_at, called_at, served_at |
| `ussd_sessions` | session_id, current_step, collected_data (json), created_at                                                                                           |
| `staff`         | id, name, login, department_id, role                                                                                                                  |

Queue numbers reset daily, scoped per department.

---

## 6. Explicitly Out of Scope for MVP

- Multi-tenant support (multiple hospitals/facilities)
- Native web access for patients
- Symptom-based automatic department routing (patient self-selects from a picklist instead)
- Returning-patient full medical history / clinical intake
- Payment or billing integration
- EMR/HIS integration
- Multi-language support beyond the pilot facility's needs
- Real-time push infrastructure (websockets) — polling is sufficient for MVP queue status

---

## 7. Build Phases

1. **Core API + database** — patient, department, and visit models; queue number assignment logic (channel-agnostic)
2. **Staff web dashboard** — live queue view, call-next, mark served/no-show (fastest path to a demoable system)
3. **USSD flow** — session handling, numbered menus, registration and check-in via the aggregator sandbox
4. **Mobile app** — registration, QR deep-link check-in, slot booking, live status, push notifications
5. **Pilot integration** — deploy against one real department at the target facility, validate the full loop end-to-end

---

## 8. Success Criteria for the Demo

- A patient can register and receive a queue number via the mobile app **and** via USSD, ending up as the same patient record
- A QR code at a (simulated) hospital location opens the app directly into check-in for the correct department
- The staff dashboard shows the live queue and can call the next patient
- The patient sees their queue position update and gets notified as their turn approaches
- The full loop — check-in to being called — takes under a minute to demonstrate

---

## 9. Open Questions for Later Phases

- Which facility will host the pilot, and what departments will it start with?
- Will a real USSD short-code and SMS gateway be needed before or after pilot approval?
- What does staff onboarding/training look like for the dashboard?
- At what point does multi-tenant support become necessary (second facility interested)?
