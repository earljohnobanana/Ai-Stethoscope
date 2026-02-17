export type SessionType = "heart" | "lung";

/* ---------------- HEART RESULT ---------------- */
export interface HeartResult {
  status: string;
  heartRate: number;
  murmurDetected?: boolean;
  murmurSeverity?: string;
  murmurPattern?: string;
  aiConfidence: number;
  summary: string;
  duration?: number; // in seconds
}

/* ---------------- LUNG RESULT ---------------- */
export interface LungResult {
  status: string;
  respRate: number;
  cracklesDetected: boolean;
  wheezesDetected: boolean;
  crackleType?: string;
  aiConfidence: number;
  summary: string;
  duration?: number; // in seconds
}

/* ---------------- SESSION ---------------- */
export type Session =
  | {
      id: number;
      type: "heart";
      name: string;
      date: string;
      result: HeartResult;
    }
  | {
      id: number;
      type: "lung";
      name: string;
      date: string;
      result: LungResult;
    };
