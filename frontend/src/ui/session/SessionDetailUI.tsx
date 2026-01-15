// frontend/src/ui/session/SessionDetailUI.tsx
import { useEffect, useMemo, useState } from "react";
import Screen from "../../components/Screen";
import { getSession } from "../../services/session.service";
import type { Session } from "../../models/Session";

/* ---------------- helpers ---------------- */

function toPercent(conf: any): number {
  if (typeof conf !== "number") return 0;
  return conf <= 1 ? Math.round(conf * 100) : Math.round(conf);
}

/**
 * ✅ FINAL FIX:
 * DO NOT let breathing_rate/heart_rate override the user's chosen mode.
 * We classify using the *final title/name* first (because you control it),
 * then fallback to backend explicit mode fields, then data fields.
 */
function inferModeFromName(name: string): "heart" | "lung" | null {
  const nm = String(name ?? "").toLowerCase();
  if (nm.includes("heart")) return "heart";
  if (nm.includes("lung")) return "lung";
  return null;
}

function inferMode(raw: any, finalName: string): "heart" | "lung" {
  // 1) STRONGEST: the saved title/name (Jan 19 - Heart - Pat)
  const fromName = inferModeFromName(finalName);
  if (fromName) return fromName;

  // 2) Explicit backend fields
  const m =
    raw?.mode ??
    raw?.type ??
    raw?.analysis_type ??
    raw?.recording_type ??
    raw?.category;

  if (m === "heart") return "heart";
  if (m === "lung") return "lung";

  // 3) Last-resort: data fields (least reliable)
  // Only use these if name/mode are missing.
  if (raw?.breathing_rate != null && raw?.heart_rate == null) return "lung";
  if (raw?.heart_rate != null && raw?.breathing_rate == null) return "heart";

  // 4) Default
  return "heart";
}

function normalizeSession(raw: any): Session {
  const id = Number(raw?.id);

  // Build the same name you show in UI
  const finalName =
    (raw?.recording_name && String(raw.recording_name).trim()) ||
    (raw?.name && String(raw.name).trim()) ||
    `Recording #${id}`;

  const type = inferMode(raw, finalName);

  const date =
    raw?.started_at ??
    raw?.ended_at ??
    raw?.created_at ??
    new Date().toISOString();

  const status = String(raw?.status ?? raw?.label ?? "—");
  const summary =
    String(raw?.summary ?? "").trim() || "No analysis summary available.";
  const aiConfidence = toPercent(raw?.confidence ?? raw?.ai_confidence);

  if (type === "heart") {
    return {
      id,
      type: "heart",
      name: finalName,
      date,
      result: {
        status,
        heartRate: Number(raw?.heart_rate ?? 0),
        murmurDetected: Boolean(raw?.murmur_detected),
        aiConfidence,
        summary,
      },
    };
  }

  return {
    id,
    type: "lung",
    name: finalName,
    date,
    result: {
      status,
      respRate: Number(raw?.breathing_rate ?? 0),
      cracklesDetected: Boolean(raw?.crackles),
      wheezesDetected: Boolean(raw?.wheezes),
      aiConfidence,
      summary,
    },
  };
}

function formatDate(d: string) {
  try {
    const dt = new Date(d);
    return dt.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return d;
  }
}

/* ---------------- component ---------------- */

interface Props {
  sessionId: number | null;
  onBack: () => void;
}

export default function SessionDetailUI({ sessionId, onBack }: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setSession(null);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const raw = await getSession(sessionId);
        const normalized = normalizeSession(raw?.data ?? raw);

        setSession(normalized);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load session.");
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId]);

  const modeIcon = useMemo(() => {
    if (!session) return "🫁";
    return session.type === "heart" ? "❤️" : "🫁";
  }, [session]);

  return (
    <Screen>
      <div
        style={{
          height: "100%",
          background: "#ffffff",
          fontFamily: "Inter, system-ui, sans-serif",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {/* TOP BAR */}
        <div
          style={{
            padding: 14,
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "1px solid #eef2f7",
          }}
        >
          <button
            onClick={onBack}
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 800,
            }}
            aria-label="Back"
          >
            ←
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a" }}>
              Recording
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#64748b",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {session ? session.name : "—"}
            </div>
          </div>

          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              display: "grid",
              placeItems: "center",
              background: session?.type === "heart" ? "#ffe4e6" : "#e0f2fe",
              border: "1px solid #e2e8f0",
              fontSize: 22,
            }}
            title={session?.type === "heart" ? "Heart" : "Lung"}
          >
            {modeIcon}
          </div>
        </div>

        {/* BODY */}
        <div
          style={{
            flex: 1,
            padding: 16,
            background: "#f4f6f9",
            overflow: "auto",
            boxSizing: "border-box",
          }}
        >
          {loading && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 18,
                padding: 16,
              }}
            >
              Loading session…
            </div>
          )}

          {error && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #fecaca",
                borderRadius: 18,
                padding: 16,
                color: "#b91c1c",
              }}
            >
              {error}
            </div>
          )}

          {!loading && !error && !session && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 18,
                padding: 16,
              }}
            >
              No session selected.
            </div>
          )}

          {!loading && !error && session && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.15fr 0.85fr",
                gap: 16,
                alignItems: "start",
              }}
            >
              {/* LEFT: SUMMARY CARD */}
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 20,
                  padding: 18,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      {session.type === "heart" ? "Heart Analysis" : "Lung Analysis"}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>
                      {formatDate(session.date)}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      border: "1px solid #d1fae5",
                      background: "#ecfdf5",
                      color: "#065f46",
                      fontSize: 12,
                      fontWeight: 800,
                      height: "fit-content",
                    }}
                  >
                    Status: {session.result.status}
                  </div>
                </div>

                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>
                  Analysis Summary
                </div>
                <div style={{ fontSize: 14, color: "#0f172a", lineHeight: 1.6 }}>
                  {session.result.summary}
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 10px",
                      borderRadius: 14,
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                      color: "#0f172a",
                      fontWeight: 700,
                    }}
                  >
                    🤖 AI {session.result.aiConfidence}%
                  </div>

                  {session.type === "heart" ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 10px",
                        borderRadius: 14,
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        fontSize: 12,
                        color: "#0f172a",
                        fontWeight: 700,
                      }}
                    >
                      ❤️ {session.result.heartRate} BPM
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 10px",
                        borderRadius: 14,
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        fontSize: 12,
                        color: "#0f172a",
                        fontWeight: 700,
                      }}
                    >
                      🫁 {session.result.respRate} BrPM
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: INFO STACK */}
              <div style={{ display: "grid", gap: 12 }}>
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 18,
                    padding: 16,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
                    {session.type === "heart" ? "Heart Rate" : "Respiratory Rate"}
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a" }}>
                    {session.type === "heart"
                      ? `${session.result.heartRate} BPM`
                      : `${session.result.respRate} BrPM`}
                  </div>
                </div>

                {session.type === "lung" && (
                  <>
                    <div
                      style={{
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: 18,
                        padding: 16,
                      }}
                    >
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
                        Crackles
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>
                        {session.result.cracklesDetected ? "Detected" : "Not Detected"}
                      </div>
                    </div>

                    <div
                      style={{
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: 18,
                        padding: 16,
                      }}
                    >
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
                        Wheezes
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>
                        {session.result.wheezesDetected ? "Detected" : "Not Detected"}
                      </div>
                    </div>
                  </>
                )}

                {session.type === "heart" && (
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 18,
                      padding: 16,
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
                      Murmur
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>
                      {session.result.murmurDetected ? "Detected" : "Not Detected"}
                    </div>
                  </div>
                )}

                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 18,
                    padding: 16,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>
                    AI Confidence
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 10,
                      borderRadius: 999,
                      background: "#e2e8f0",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(100, Math.max(0, session.result.aiConfidence))}%`,
                        height: "100%",
                        borderRadius: 999,
                        background: "#2563eb",
                      }}
                    />
                  </div>
                  <div style={{ marginTop: 8, fontSize: 13, fontWeight: 800, color: "#0f172a" }}>
                    {session.result.aiConfidence}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Screen>
  );
}
