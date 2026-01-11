// FRONT-MAIN/src/store/sessionStore.ts

export type SessionType = "heart" | "lung";

export interface Session {
  id: number;
  patient_id: number;
  type: SessionType;

  status: string;
  confidence: number;
  summary: string | null;

  metrics: Record<string, any> | null;

  duration_seconds: number | null;
  recorded_at: string; // "YYYY-MM-DD HH:mm:ss"
}

// In-memory store (simple, no Zustand yet)
let sessions: Session[] = [];

// ---------- setters ----------
export function setSessions(newSessions: Session[]) {
  sessions = newSessions;
}

export function addSession(session: Session) {
  sessions.unshift(session); // newest first
}

export function clearSessions() {
  sessions = [];
}

// ---------- getters ----------
export function getSessions(): Session[] {
  return sessions;
}

export function getSessionById(id: number): Session | undefined {
  return sessions.find((s) => s.id === id);
}
