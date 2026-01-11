export type SessionType = "heart" | "lung";

/* ---------- Result Types ---------- */

export interface HeartResult {
  heartRate?: number;
  confidence?: number;
  status?: "Normal" | "Abnormal";
  summary?: string;
  duration?: number;
}

export interface LungResult {
  respRate?: number;
  crackles?: boolean;
  wheezes?: boolean;
  confidence?: number;
  status?: "Normal" | "Abnormal";
  summary?: string;
  duration?: number;
}

/* ---------- Session ---------- */

export interface Session {
  id: string;
  type: SessionType;
  name: string;
  date: string; // ISO string
  result: HeartResult | LungResult;
}

