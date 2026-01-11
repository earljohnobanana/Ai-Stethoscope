// src/screens/LungAnalysis.tsx
import { useEffect, useMemo, useState } from "react";
import Screen from "../components/Screen";
import { startRecording, stopRecording } from "../services/recording.service";
import { createSession } from "../services/session.service";

const PATIENT_ID = 1;

type Props = {
  onBack: () => void;
};

export default function LungAnalysis({ onBack }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);

  const [seconds, setSeconds] = useState(0);

  // simulated UI output while recording
  const [crackles, setCrackles] = useState(false);
  const [wheezes, setWheezes] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [confidence, setConfidence] = useState(0.0);

  const [saveOpen, setSaveOpen] = useState(false);
  const [recordingName, setRecordingName] = useState("");

  useEffect(() => {
    if (!isRecording) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isRecording]);

  useEffect(() => {
    if (!isRecording) return;

    setStatus("Recording");
    setConfidence(0.94);
    setCrackles(false);
    setWheezes(false);

    const t = setInterval(() => {
      // simulate occasional detection
      setCrackles((prev) => prev || Math.random() < 0.08);
      setWheezes((prev) => prev || Math.random() < 0.08);
      setConfidence((prev) => {
        const base = prev === 0 ? 0.94 : prev;
        const jitter = Math.random() * 0.02 - 0.01;
        return Math.max(0.85, Math.min(0.99, +(base + jitter).toFixed(3)));
      });
    }, 900);

    return () => clearInterval(t);
  }, [isRecording]);

  const mmss = useMemo(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [seconds]);

  async function handleStart() {
    try {
      setSeconds(0);
      setSaveOpen(false);
      setRecordingName("");
      setStatus("Starting...");

      const res = await startRecording(PATIENT_ID);
      setSessionId(res.session_id);
      setIsRecording(true);
    } catch (e) {
      alert((e as Error).message);
    }
  }

  async function handleStop() {
    try {
      if (!sessionId) return;
      await stopRecording(sessionId);

      setIsRecording(false);
      setStatus("Stopped");
      setSaveOpen(true);
    } catch (e) {
      alert((e as Error).message);
    }
  }

  async function handleSave() {
    try {
      await createSession(PATIENT_ID, recordingName || "Lung Recording");
      setSaveOpen(false);
      setRecordingName("");
      setStatus("Saved");
      alert("Saved! Check Session History.");
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <Screen title="Lung Analysis">
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <button
          onClick={onBack}
          style={{ padding: "10px 14px", borderRadius: 10 }}
        >
          ← Back
        </button>

        <div style={{ marginLeft: "auto", opacity: 0.85 }}>
          <b>{mmss}</b>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        {/* LEFT big control */}
        <div
          style={{
            borderRadius: 18,
            padding: 18,
            minHeight: 380,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 14,
            background: isRecording ? "#b91c1c" : "#0ea5e9",
            color: "white",
            boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ textAlign: "center", fontSize: 22, fontWeight: 700 }}>
            {isRecording ? "Stop Analysis" : "Start Recording"}
          </div>

          <div style={{ textAlign: "center", opacity: 0.9 }}>
            {isRecording
              ? "Recording lung sounds..."
              : "Tap to begin monitoring"}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            {!isRecording ? (
              <button
                onClick={handleStart}
                style={{
                  padding: "14px 18px",
                  borderRadius: 14,
                  border: "none",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Start
              </button>
            ) : (
              <button
                onClick={handleStop}
                style={{
                  padding: "14px 18px",
                  borderRadius: 14,
                  border: "none",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Stop
              </button>
            )}
          </div>
        </div>

        {/* RIGHT metrics */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: 18,
              padding: 16,
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.75 }}>Status</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{status}</div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: 18,
                padding: 16,
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.75 }}>Crackles</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>
                {crackles ? "Detected" : "Not Detected"}
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                borderRadius: 18,
                padding: 16,
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.75 }}>Wheezes</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>
                {wheezes ? "Detected" : "Not Detected"}
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: 18,
              padding: 16,
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.75 }}>AI Confidence</div>
              <div style={{ fontWeight: 800, color: "#2563eb" }}>
                {Math.round(confidence * 1000) / 10}%
              </div>
            </div>

            <div
              style={{
                height: 10,
                background: "#eef2ff",
                borderRadius: 999,
                marginTop: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.round(confidence * 100)}%`,
                  background: "linear-gradient(90deg,#2563eb,#10b981)",
                }}
              />
            </div>

            <div
              style={{
                marginTop: 10,
                padding: 12,
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                background: "#f8fafc",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>
                Recommendation
              </div>
              <div style={{ fontSize: 14 }}>
                {crackles || wheezes
                  ? "Abnormal pattern detected. Consider re-checking and consult a professional if persistent."
                  : "No abnormalities detected. Continue regular monitoring."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SAVE */}
      <div style={{ marginTop: 16 }}>
        <button
          onClick={() => setSaveOpen(true)}
          disabled={isRecording}
          style={{
            width: "100%",
            padding: "16px 18px",
            borderRadius: 18,
            border: "none",
            background: isRecording ? "#94a3b8" : "#0f766e",
            color: "white",
            fontWeight: 800,
            cursor: isRecording ? "not-allowed" : "pointer",
            boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
          }}
        >
          Save Result
        </button>

        {saveOpen && (
          <div
            style={{
              marginTop: 12,
              background: "#ffffff",
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              padding: 12,
            }}
          >
            <input
              value={recordingName}
              onChange={(e) => setRecordingName(e.target.value)}
              placeholder="Enter recording name (e.g., Dec 10 - Lungs)"
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button
                onClick={handleSave}
                disabled={!recordingName}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "none",
                  background: recordingName ? "#2563eb" : "#94a3b8",
                  color: "white",
                  fontWeight: 700,
                  cursor: recordingName ? "pointer" : "not-allowed",
                }}
              >
                Confirm Save
              </button>

              <button
                onClick={() => setSaveOpen(false)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  background: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Screen>
  );
}
