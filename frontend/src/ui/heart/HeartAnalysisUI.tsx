// frontend/src/ui/heart/HeartAnalysisUI.tsx
import { useEffect, useState } from "react";
import Screen from "../../components/Screen";

import HeartHeader from "./HeartHeader";
import HeartStates from "./HeartStates";
import HeartResultPanel from "./HeartResultPanel";
import SaveRecordingPanel from "./SaveRecordingPanel";

import { startRecording, stopRecording } from "../../services/recording.service";
import { saveRecordingName } from "../../services/session.service";


import { ensureActivePatient } from "../../services/patient.service";

interface Props {
  onBack: () => void;
}

export default function HeartAnalysisUI({ onBack }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSave, setShowSave] = useState(false);

  const [recordingName, setRecordingName] = useState("");

  const [patientId, setPatientId] = useState<number | null>(null);
  const [recordingId, setRecordingId] = useState<number | null>(null);

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    ensureActivePatient()
      .then((id) => setPatientId(id))
      .catch((e) => {
        console.error(e);
        alert(e?.message ?? "Failed to initialize patient.");
      });
  }, []);

  async function handleStart() {
    if (busy) return;

    if (!patientId) {
      alert("No patient selected/created yet.");
      return;
    }

    try {
      setBusy(true);

      // ✅ include mode
      const res: any = await startRecording(patientId, "heart");

      const id =
        res?.recording_id ??
        res?.recordingId ??
        res?.session_id ??
        res?.sessionId ??
        null;

      if (id == null) {
        console.warn("startRecording() response:", res);
        alert("Recording started but no recording id returned by backend.");
      } else {
        setRecordingId(Number(id));
      }

      setIsAnalyzing(true);
    } catch (e: any) {
      alert(e?.message ?? "Failed to start recording.");
    } finally {
      setBusy(false);
    }
  }

  async function handleStop() {
    if (busy) return;

    try {
      setBusy(true);

      if (recordingId == null) {
        console.warn("Stop pressed but recordingId is null.");
      } else {
        await stopRecording(recordingId);
      }

      setIsAnalyzing(false);
      // ✅ stop only (no auto save)
    } catch (e: any) {
      alert(e?.message ?? "Failed to stop recording.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSave(name: string) {
    if (busy) return;

    if (!recordingId) {
      alert("No recording to save. Please record first.");
      return;
    }

    try {
      setBusy(true);

      // ✅ this is the only save action now
      await saveRecordingName(recordingId, name.trim());

      setShowSave(false);
      setRecordingName("");
      setRecordingId(null);

      alert("Saved! Check Session History.");
    } catch (e: any) {
      alert(e?.message ?? "Failed to save recording name.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f4f6f9",
          padding: 16,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <HeartHeader
            title="Heart Analysis"
            subtitle="Real-time cardiac monitoring"
            onBack={onBack}
          />
        </div>

        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginTop: 16,
            minHeight: 0,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateRows: "1fr 1fr",
              gap: 16,
              minHeight: 0,
            }}
          >
            <div>
              <HeartStates
                isAnalyzing={isAnalyzing}
                onStart={handleStart}
                onStop={handleStop}
              />
            </div>

            <div
              onClick={() => {
                if (isAnalyzing) return;
                if (!recordingId) {
                  alert("No recording to save. Please record first.");
                  return;
                }
                setRecordingName("");
                setShowSave(true);
              }}
              style={{
                height: 160,
                borderRadius: 20,
                backgroundColor: "#0f766e",
                color: "#ffffff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 600,
                cursor: isAnalyzing ? "not-allowed" : "pointer",
                boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                userSelect: "none",
                opacity: isAnalyzing ? 0.6 : 1,
              }}
              title={isAnalyzing ? "Stop first before saving" : "Save result"}
            >
              <div style={{ fontSize: 32, marginBottom: 6 }}>💾</div>
              Save Result
            </div>
          </div>

          <div style={{ height: "100%", overflowY: "auto", paddingRight: 4 }}>
            <HeartResultPanel
              status="Normal"
              heartRate={70}
              aiConfidence={96.1}
              summary="No cardiac abnormalities detected. Continue regular monitoring and training."
            />
          </div>
        </div>

        {showSave && (
          <SaveRecordingPanel
            name={recordingName}
            setName={setRecordingName}
            onConfirm={() => handleSave(recordingName)} // ✅ no type mismatch
            onCancel={() => {
              setShowSave(false);
              setRecordingName("");
            }}
          />
        )}

        {busy && (
          <div
            style={{
              position: "absolute",
              bottom: 14,
              right: 14,
              background: "rgba(17,24,39,0.85)",
              color: "white",
              padding: "8px 12px",
              borderRadius: 12,
              fontSize: 12,
            }}
          >
            Working…
          </div>
        )}
      </div>
    </Screen>
  );
}
