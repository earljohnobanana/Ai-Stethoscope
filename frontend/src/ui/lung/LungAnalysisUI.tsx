// frontend/src/ui/lung/LungAnalysisUI.tsx
import { useEffect, useState } from "react";
import Screen from "../../components/Screen";

import LungHeader from "./LungHeader";
import LungStates from "./LungStates";
import LungResultPanel from "./LungResultPanel";
import SaveRecordingPanel from "../heart/SaveRecordingPanel";

import { startRecording, stopRecording } from "../../services/recording.service";
import { saveRecordingName } from "../../services/session.service";
import { ensureActivePatient } from "../../services/patient.service";

interface Props {
  onBack: () => void;
}

export default function LungAnalysisUI({ onBack }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [recordingName, setRecordingName] = useState("");

  const [patientId, setPatientId] = useState<number | null>(null);
  const [recordingId, setRecordingId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    ensureActivePatient()
      .then(setPatientId)
      .catch((e) => {
        console.error(e);
        alert(e?.message ?? "Failed to initialize patient.");
      });
  }, []);

  async function handleStart() {
    if (busy || !patientId) return;

    try {
      setBusy(true);

      const res: any = await startRecording(patientId, "lung");
      const id =
        res?.recording_id ??
        res?.recordingId ??
        res?.session_id ??
        res?.sessionId ??
        null;

      if (id == null) {
        alert("Recording started but no recording ID returned.");
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
      if (recordingId != null) {
        await stopRecording(recordingId);
      }
      setIsAnalyzing(false);
    } catch (e: any) {
      alert(e?.message ?? "Failed to stop recording.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSave(name: string) {
    if (busy || !recordingId) return;

    try {
      setBusy(true);
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
        <LungHeader
          title="Lung Analysis"
          subtitle="Respiratory sound monitoring"
          onBack={onBack}
        />

        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginTop: 16,
          }}
        >
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 16 }}>
            <LungStates
              isAnalyzing={isAnalyzing}
              onStart={handleStart}
              onStop={handleStop}
            />

            <div
              onClick={() => {
                if (!isAnalyzing && recordingId) setShowSave(true);
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
                opacity: isAnalyzing ? 0.6 : 1,
              }}
            >
              <div style={{ fontSize: 32 }}>💾</div>
              Save Result
            </div>
          </div>

          <LungResultPanel
            status="Normal"
            respRate={20}
            cracklesDetected={false}
            wheezesDetected={false}
            aiConfidence={92.4}
            summary="No abnormal lung sounds detected."
          />
        </div>

        {showSave && (
          <SaveRecordingPanel
            name={recordingName}
            setName={setRecordingName}
            onConfirm={() => handleSave(recordingName)}
            onCancel={() => setShowSave(false)}
          />
        )}
      </div>
    </Screen>
  );
}
