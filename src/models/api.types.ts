// FRONT-MAIN/src/models/api.types.ts
export type SessionType = "heart" | "lung";

export interface PatientDTO {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface SessionDTO {
  id: number;
  patient_id: number;
  type: SessionType;
  status: string;
  confidence: number;
  summary: string | null;
  metrics: Record<string, any> | null;
  duration_seconds: number | null;
  recorded_at: string; // "YYYY-MM-DD HH:mm:ss"
  created_at?: string;
  updated_at?: string;
}

export interface CreatePatientDTO {
  name: string;
}

export interface CreateSessionDTO {
  patient_id: number;
  type: SessionType;
  status: string;
  confidence: number; // 0-100
  summary?: string | null;
  metrics?: Record<string, any> | null;
  duration_seconds?: number | null;
  recorded_at: string;
}
