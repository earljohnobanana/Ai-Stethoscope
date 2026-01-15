export type SessionType = "heart" | "lung";

/* ---------------- HEART RESULT ---------------- */
export interface HeartResult {
  status: string;
  heartRate: number;
  murmurDetected?: boolean;
  aiConfidence: number;
  summary: string;
}

/* ---------------- LUNG RESULT ---------------- */
export interface LungResult {
  status: string;
  respRate: number;
  cracklesDetected: boolean;
  wheezesDetected: boolean;
  aiConfidence: number;
  summary: string;
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
