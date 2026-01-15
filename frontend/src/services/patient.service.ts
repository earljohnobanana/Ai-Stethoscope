import api from "./api";

export type Patient = {
  id: number;
  name: string;
  age: number;
  sport: string;
};

const STORAGE_KEY = "active_patient_id";

export function getActivePatientId(): number | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function clearActivePatientId() {
  localStorage.removeItem(STORAGE_KEY);
}

export function setActivePatientId(id: number) {
  localStorage.setItem(STORAGE_KEY, String(id));
}

export async function createPatient(payload: {
  name: string;
  age: number;
  sport: string;
}): Promise<Patient> {
  const res = await api.post("/athletes", payload);
  return res.data;
}

/**
 * Creates (or reuses) an active patient id stored in localStorage.
 * IMPORTANT: this does NOT guarantee the id exists after DB resets,
 * so we also handle invalid IDs at the startRecording call (retry logic).
 */
export async function ensureActivePatient(): Promise<number> {
  const existing = getActivePatientId();
  if (existing) return existing;

  const created = await createPatient({
    name: "Unnamed Athlete",
    age: 18,
    sport: "Unknown",
  });

  if (!created?.id) throw new Error("Failed to create patient");

  setActivePatientId(created.id);
  return created.id;
}