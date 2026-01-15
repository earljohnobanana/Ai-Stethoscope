import type { Session } from "../models/Session";

function toPercent(conf: any): number {
  if (typeof conf !== "number") return 0;
  return Math.round(conf * 100);
}

function inferMode(raw: any): "heart" | "lung" {
  if (raw?.mode === "heart") return "heart";
  if (raw?.mode === "lung") return "lung";
  if (raw?.heart_rate != null) return "heart";
  return "lung";
}

export function normalizeSession(raw: any): Session {
  const id = Number(raw.id);
  const type = inferMode(raw);

  const name =
    raw?.recording_name ||
    `Recording #${id}`;

  const date =
    raw?.started_at ??
    raw?.ended_at ??
    raw?.created_at ??
    new Date().toISOString();

  const status = raw?.status ?? "—";
  const summary = raw?.summary ?? "No analysis summary available.";
  const aiConfidence = toPercent(raw?.confidence);

  if (type === "heart") {
    return {
      id,
      type: "heart",
      name,
      date,
      result: {
        status,
        heartRate: raw?.heart_rate ?? 0,
        murmurDetected: Boolean(raw?.murmur_detected),
        aiConfidence,
        summary,
      },
    };
  }

  // lung
  return {
    id,
    type: "lung",
    name,
    date,
    result: {
      status,
      respRate: raw?.breathing_rate ?? 0,
      cracklesDetected: Boolean(raw?.crackles),
      wheezesDetected: Boolean(raw?.wheezes),
      aiConfidence,
      summary,
    },
  };
}
