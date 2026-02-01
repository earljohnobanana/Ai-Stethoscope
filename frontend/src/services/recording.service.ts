// frontend/src/services/recording.service.ts
import api from "./api";

export type RecordingMode = "heart" | "lung";

// frontend/src/services/recording.service.ts

export async function startRecording(patientId: number, mode: "heart" | "lung") {
  const res = await fetch(`/api/recording/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      patient_id: Number(patientId), // ✅ force number
      mode, // "heart" or "lung"
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to start recording");
  }

  return res.json();
}

export async function stopRecording(recordingId: number, data?: {
  heart_rate?: number | null;
  breathing_rate?: number | null;
  murmur_detected?: boolean;
  crackles_detected?: boolean;
  wheezes_detected?: boolean;
  confidence?: number | null;
  label?: string;
  summary?: string;
}) {
  const res = await fetch(`/api/recording/stop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: Number(recordingId),
      ...data,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to stop recording");
  }

  return res.json();
}

/**
 * Saves/updates the name of a recording AFTER stopping.
 * Backend route: POST /api/recording/{id}/save
 */
export async function saveRecording(recordingId: number, recordingName: string) {
  const res = await api.post(`/recording/${recordingId}/save`, {
    recording_name: recordingName,
  });
  return res.data;
}
