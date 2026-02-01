import { useEffect, useState } from "react";
import Screen from "../../components/Screen";

import SessionList from "./SessionList";
import type { Session } from "../../models/Session";

import { ensureActivePatient } from "../../services/patient.service";
import { getHistory } from "../../services/session.service";

interface Props {
  onBack: () => void;
  onOpenSession: (id: number) => void;
}

function toPercent(conf: any): number | null {
  if (typeof conf !== "number") return null;
  // backend: 0.934 -> 93
  return Math.round(conf * 100);
}

function inferMode(raw: any): "heart" | "lung" {
  // 1) STRONGEST: recording_name contains mode (your UI naming format)
  const nm = String(raw?.recording_name ?? raw?.name ?? "").toLowerCase();
  if (nm.includes("heart")) return "heart";
  if (nm.includes("lung")) return "lung";

  // 2) Explicit backend field (if available)
  const m =
    raw?.mode ??
    raw?.type ??
    raw?.analysis_type ??
    raw?.recording_type ??
    raw?.category;

  if (m === "heart") return "heart";
  if (m === "lung") return "lung";

  // 3) Last resort: data fields (least reliable)
  if (raw?.breathing_rate != null && raw?.heart_rate == null) return "lung";
  if (raw?.heart_rate != null && raw?.breathing_rate == null) return "heart";

  // 4) Default (choose heart to avoid heart showing lung)
  return "heart";
}


function normalizeSession(raw: any): Session {
  const id = Number(raw?.id);

  const type = inferMode(raw); // ✅ heart/lung icon
  const name =
    (raw?.recording_name && String(raw.recording_name).trim()) ||
    `Recording #${id}`;

  const date =
    raw?.started_at ??
    raw?.ended_at ??
    raw?.created_at ??
    new Date().toISOString();

  const label = raw?.label ?? raw?.status ?? "—";
  const ai = toPercent(raw?.confidence ?? raw?.ai_confidence);

  // ✅ Always provide a result object (prevents detail UI undefined crashes)
  const result: any = {
    status: String(label),
    aiConfidence: ai,
    summary: raw?.summary ?? "No analysis summary available.",
  };

  if (type === "heart") {
    result.heartRate = raw?.heart_rate ?? null;
    result.murmurDetected = Boolean(raw?.murmur_detected);
  } else {
    result.respRate = raw?.breathing_rate ?? null;
    result.cracklesDetected = Boolean(raw?.crackles_detected);
    result.wheezesDetected = Boolean(raw?.wheezes_detected);
  }

  return {
    id, // number
    type,
    name,
    date,
    result,
  } as Session;
}

export default function SessionHistoryUI({ onBack, onOpenSession }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const pid = await ensureActivePatient();
        const raw = await getHistory(pid);

        // backend may return [] OR { data: [] } OR { sessions: [] }
        const rows = Array.isArray(raw)
          ? raw
          : Array.isArray((raw as any)?.data)
          ? (raw as any).data
          : Array.isArray((raw as any)?.sessions)
          ? (raw as any).sessions
          : [];

        const normalized = rows.map(normalizeSession);

        if (mounted) setSessions(normalized);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load session history.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Screen>
      <div
        style={{
          height: "100%",
          padding: 16,
          boxSizing: "border-box",
          background: "#f4f6f9",
          overflow: "hidden",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <button
            onClick={onBack}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ←
          </button>

          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Session History</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              Past monitoring sessions
            </div>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            height: "calc(100% - 54px)",
            overflowY: "auto",
            paddingRight: 6,
          }}
        >
          {loading && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                padding: 16,
              }}
            >
              Loading sessions…
            </div>
          )}

          {error && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #fecaca",
                borderRadius: 16,
                padding: 16,
                color: "#b91c1c",
              }}
            >
              {error}
            </div>
          )}

          {!loading && !error && (
            <SessionList
              sessions={sessions}
              onSelect={(s) => onOpenSession(s.id)}
            />
          )}
        </div>
      </div>
    </Screen>
  );
}
