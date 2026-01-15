// frontend/src/services/recording.service.ts
import api from "./api";

export type RecordingMode = "heart" | "lung";

export async function startRecording(patientId: number, mode: RecordingMode) {
  const res = await api.post("/recording/start", {
    patient_id: patientId,
    mode,
  });
  return res.data;
}

export async function stopRecording(sessionId: number) {
  const res = await api.post("/recording/stop", {
    session_id: sessionId,
  });
  return res.data;
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
