import api from "./api";

export interface PatientCreate {
  name: string;
  age: number;
  sport: string;
}

export interface PatientResponse {
  id: number;
  name: string;
  age: number;
  sport: string;
  created_at?: string;
  updated_at?: string;
}

export async function createPatient(payload: PatientCreate): Promise<PatientResponse> {
  const res = await api.post("/athletes", payload);
  return res.data as PatientResponse;
}
