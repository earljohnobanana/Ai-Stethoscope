import api from "./api";

export async function createSession(patientId: number, recordingName?: string) {
  const startRes = await api.post("/recording/start", {
    patient_id: patientId,
    recording_name: recordingName ?? null,
  });

  const sessionId = startRes.data.session_id as number;

  const stopRes = await api.post("/recording/stop", {
    session_id: sessionId,
  });

  return {
    session_id: sessionId,
    status: stopRes.data.status as string,
    duration_seconds: stopRes.data.duration_seconds as number,
    label: stopRes.data.label as string,
  };
}

export async function getHistory(patientId: number) {
  const res = await api.get(`/history/${patientId}`);
  return res.data;
}

export async function getSessionDetail(sessionId: number) {
  const res = await api.get(`/sessions/${sessionId}`);
  return res.data;
}
