// src/screens/HeartAnalysis.tsx
import { useEffect, useMemo, useState } from "react";
import Screen from "../components/Screen";
import { startRecording, stopRecording } from "../services/recording.service";
import { createSession } from "../services/session.service";

const PATIENT_ID = 1; // temporary until login/profile

type Props = {
  onBack: () => void;
};

export default function HeartAnalysis({ onBack }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);

  const [seconds, setSeconds] = useState(0);

  // Simulated UI outputs (your backend dashboard/history will be the source of truth after save)
  const [status, setStatus] = useState("Ready");
  const [heartRate, setHeartRate] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(0.0);

  const [saveOpen, setSaveOpen] = useState(false);
  const [recordingName, setRecordingName] = useState("");

  // timer
  useEffect(() => {
    if (!isRecording) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isRecording]);

  // simple simulated live updates while recording
  useEffect(() => {
    if (!isRecording) return;

    setStatus("Recording");
    const t = setInterval(() => {
      setHeartRate((prev) => {
        const base = prev === 0 ? 75 : prev;
        const jitter = Math.floor(Math.random() * 7) - 3;
        return Math.max(55, Math.min(165, base + jitter));
      });
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
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");
    return `${mm}:${ss}`;
  }, [seconds]);

  async function handleStart() {
    try {
      setSeconds(0);
      setSaveOpen(false);
      setRecordingName("");
      setHeartRate(75);
      setConfidence(0.94);

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
      // This simulates “Save Result” by creating a completed session on backend.
      // In real build: you’ll send the real AI output; for now backend simulates.
      await createSession(PATIENT_ID, recordingName || "Heart Recording");
      setSaveOpen(false);
      setRecordingName("");
      setStatus("Saved");
      alert("Saved! Check Session History.");
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <Screen title="Heart Analysis">
      {/* Top Bar */}
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

      {/* Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        {/* LEFT: Big control area */}
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
              ? "Recording heart sounds..."
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

        {/* RIGHT: Metrics */}
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
            style={{
              background: "#ffffff",
              borderRadius: 18,
              padding: 16,
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.75 }}>Heart Rate</div>
            <div style={{ fontSize: 34, fontWeight: 800 }}>
              {heartRate}{" "}
              <span style={{ fontSize: 14, opacity: 0.7 }}>BPM</span>
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
          </div>
        </div>
      </div>

      {/* SAVE SECTION */}
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
              placeholder="Enter recording name (e.g., Dec 10 - Heart)"
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
