import api from "./api";

export type DashboardData = {
  athlete: string;
  heart_rate: number;
  breathing_rate: number;
  status: string;
  confidence: number;
  last_updated: string | null;
};

export async function getDashboardSummary(patientId: number) {
  const res = await api.get<DashboardData>(`/dashboard/${patientId}`);
  return res.data;
}
