// frontend/src/services/patient.service.ts

const KEY = "active_patient_id";

/**
 * If you use Vite proxy (/api -> Laravel), keep it "/api".
 * If you don't use proxy, set VITE_API_URL in frontend/.env (example below).
 */
const API_BASE = (import.meta as any)?.env?.VITE_API_URL?.trim() || "/api";

/**
 * Converts a value to a positive integer.
 * Returns null for invalid inputs, non-finite numbers, or non-positive values.
 * 
 * @param v - Value to convert (string, number, null, undefined, etc.)
 * @returns Positive integer or null if invalid
 */
function toInt(v: unknown): number | null {
  // Handle null/undefined cases early for efficiency
  if (v == null) {
    return null;
  }

  // For string inputs: trim whitespace and check for valid numeric format first
  if (typeof v === 'string') {
    const trimmed = v.trim();
    // Regex to validate positive integer strings (no decimals, no whitespace, positive)
    if (!/^\d+$/.test(trimmed)) {
      return null;
    }
    // Parse validated string directly for better performance
    const parsed = parseInt(trimmed, 10);
    return parsed > 0 ? parsed : null;
  }

  // For numeric inputs: check if finite and positive integer
  if (typeof v === 'number') {
    // Check if number is a finite positive integer
    if (Number.isFinite(v) && Number.isInteger(v) && v > 0) {
      return v;
    }
    // If it's a float, truncate and check positivity
    if (Number.isFinite(v)) {
      const truncated = Math.trunc(v);
      return truncated > 0 ? truncated : null;
    }
    return null;
  }

  // Reject all other types (objects, arrays, booleans, etc.)
  return null;
}

export function getActivePatientId(): number | null {
  const raw = localStorage.getItem(KEY);
  return toInt(raw);
}

export function setActivePatientId(id: number) {
  localStorage.setItem(KEY, String(id));
}

export function clearActivePatientId() {
  localStorage.removeItem(KEY);
}

export async function ensureActivePatient(): Promise<number> {
  const cached = getActivePatientId();
  if (cached) {
    const ok = await verifyAthleteExists(cached);
    if (ok) return cached;
    clearActivePatientId();
  }

  const createdId = await createAthlete();
  setActivePatientId(createdId);
  return createdId;
}

// ✅ match Laravel: GET /api/athletes/{id}
async function verifyAthleteExists(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/athletes/${id}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ✅ match Laravel: POST /api/athletes
async function createAthlete(): Promise<number> {
  const res = await fetch(`${API_BASE}/athletes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    // ✅ Only name now (no age/sport/sex here)
    body: JSON.stringify({ name: "Guest" }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to create patient (HTTP ${res.status})`);
  }

  const data = await res.json();

  const id =
    data?.id ??
    data?.patient?.id ??
    data?.data?.id ??
    data?.patient_id ??
    null;

  const parsed = toInt(id);
  if (!parsed) {
    throw new Error("Patient created but backend did not return a valid patient id.");
  }

  return parsed;
}

// ✅ match Laravel: PUT /api/athletes/{id}
export async function updatePatient(
  id: number, 
  data: { name?: string; age?: number; sex?: string; sport?: string }
): Promise<void> {
  const res = await fetch(`${API_BASE}/athletes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to update patient (HTTP ${res.status})`);
  }
}
