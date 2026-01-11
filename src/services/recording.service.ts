import api from "./api";

export const startRecording = async (patientId: number) => {
  const response = await api.post("/recording/start", {
    patient_id: patientId,
  });
  return response.data as {
    session_id: number;
    status: string;
  };
};

export const stopRecording = async (sessionId: number) => {
  const response = await api.post("/recording/stop", {
    session_id: sessionId,
  });
  return response.data as {
    session_id: number;
    status: string;
  };
};
