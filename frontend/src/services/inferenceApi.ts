// frontend/src/services/inferenceApi.ts

const API_BASE = (import.meta as any)?.env?.VITE_API_URL?.trim() || "/api";

export type HeartInferResponse = {
  mode: "heart";
  status: string;
  result: string;
  bpm: number | null;
  ai_confidence_pct: number;
  murmur_detected: boolean;
  debug?: any;
};

export type LungInferResponse = {
  mode: "lung";
  status: string;
  result: string;
  resp_rate: number | null;
  ai_confidence_pct: number;
  crackle_detected: boolean;
  wheeze_detected?: boolean;
  debug?: any;
};

export async function inferHeart(file: File): Promise<HeartInferResponse> {
  const fd = new FormData();
  fd.append("file", file); // ✅ must be "file"

  const res = await fetch(`${API_BASE}/infer/heart`, {
    method: "POST",
    body: fd,
    headers: { Accept: "application/json" },
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function inferLung(file: File): Promise<LungInferResponse> {
  const fd = new FormData();
  fd.append("file", file); // ✅ must be "file"

  const res = await fetch(`${API_BASE}/infer/lung`, {
    method: "POST",
    body: fd,
    headers: { Accept: "application/json" },
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
