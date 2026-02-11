import axios from "axios";
import type { AxiosRequestConfig } from "axios";


export const API_BASE = (import.meta as any)?.env?.VITE_API_URL?.trim() || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "API request failed";
    return Promise.reject(new Error(msg));
  }
);

// ✅ Backward compatible helper (your other files may import apiFetch)
export async function apiFetch<T>(
  path: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  const method = (options.method || "GET").toString().toLowerCase();

  if (method === "get") {
    const res = await api.get(path, options);
    return res.data as T;
  }
  if (method === "post") {
    const res = await api.post(path, options.data ?? {}, options);
    return res.data as T;
  }
  if (method === "put") {
    const res = await api.put(path, options.data ?? {}, options);
    return res.data as T;
  }
  if (method === "delete") {
    const res = await api.delete(path, options);
    return res.data as T;
  }

  throw new Error(`Unsupported method: ${options.method}`);
}

export default api;
