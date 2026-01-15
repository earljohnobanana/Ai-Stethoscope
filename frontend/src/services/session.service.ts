import api from "./api";

export async function saveRecordingName(recordingId: number, recordingName: string) {
  const res = await api.post(`/recording/${recordingId}/save`, {
    recording_name: recordingName,
  });
  return res.data;
}

export async function getHistory(patientId: number) {
  const res = await api.get(`/history/${patientId}`);
  return res.data;
}


export async function getSession(sessionId: number) {
  const res = await api.get(`/sessions/${sessionId}`);
  return res.data;
}