import { useEffect, useRef, useState } from "react";
import Screen from "../../components/Screen";

import { startRecording, stopRecording } from "../../services/recording.service";
import { saveRecordingName } from "../../services/session.service";
import { ensureActivePatient, updatePatient } from "../../services/patient.service";

interface Props {
  onBack: () => void;
  title: string;
  subtitle: string;
  HeaderComponent: React.ComponentType<{ title: string; subtitle: string; onBack: () => void }>;
  StatesComponent: React.ComponentType<{
    isAnalyzing: boolean;
    onStart: () => void;
    onStop: () => void;
    elapsedTime?: number;
    formattedTime?: string;
  }>;
  ResultComponent: React.ComponentType<any>;
  SaveComponent: React.ComponentType<{
    name: string;
    setName: (v: string) => void;
    onConfirm: (payload: { name: string; age?: number; sex?: string; sport?: string }) => void;
    onCancel: () => void;
  }>;
  inferFunction: (file: File) => Promise<any>;
  processResult: (apiResult: any) => any;
  testWavButtonText: string;
  mode: "heart" | "lung";
}

export default function AnalysisBaseUI({
  onBack,
  title,
  subtitle,
  HeaderComponent,
  StatesComponent,
  ResultComponent,
  SaveComponent,
  inferFunction,
  processResult,
  testWavButtonText,
  mode,
}: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [patientId, setPatientId] = useState<number | null>(null);
  const [recordingId, setRecordingId] = useState<number | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [showSave, setShowSave] = useState(false);
  const [recordingName, setRecordingName] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const wavPickerRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<number | null>(null);

  // Initialize patient
  useEffect(() => {
    ensureActivePatient()
      .then((id) => setPatientId(id))
      .catch((e: any) => {
        console.error(e);
        alert(e?.message ?? "Failed to initialize patient.");
      });
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start timer
  const startTimer = () => {
    setElapsedTime(0);
    timerRef.current = window.setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        // Auto-stop after 20 seconds
        if (newTime >= 20) {
          handleStop();
        }
        return newTime;
      });
    }, 1000);
  };

  // Stop timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  async function handleStart() {
    if (busy) return;

    try {
      setBusy(true);
      setResult(null);

      const pid = await ensureActivePatient();
      setPatientId(pid);

      const res: any = await startRecording(pid, mode);

      const id =
        res?.recording_id ??
        res?.recordingId ??
        res?.session_id ??
        res?.sessionId ??
        res?.id ??
        null;

      if (id == null) {
        console.warn("startRecording() response:", res);
        alert("Recording started but backend did not return a recording id.");
      } else {
        setRecordingId(Number(id));
      }

      setIsAnalyzing(true);
      startTimer();
    } catch (e: any) {
      alert(e?.message ?? `Failed to start ${mode} recording.`);
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
      stopTimer();
    } catch (e: any) {
      alert(e?.message ?? `Failed to stop ${mode} recording.`);
    } finally {
      setBusy(false);
    }
  }

  async function runAiWithFile(file: File) {
    if (busy) return;

    try {
      setBusy(true);
      setResult(null);

      // Create a recording entry when testing WAV file
      const pid = await ensureActivePatient();
      setPatientId(pid);
      
      const res: any = await startRecording(pid, mode);
      const id = res?.recording_id ?? res?.recordingId ?? res?.session_id ?? res?.sessionId ?? res?.id ?? null;
      
      if (id != null) {
        setRecordingId(Number(id));
      }

      // Start timer for WAV file testing
      setIsAnalyzing(true);
      startTimer();

      const ai = await inferFunction(file);
      const processedResult = processResult(ai);
      setResult(processedResult);

      // Stop the recording after AI processing and pass AI results
      if (id != null) {
        const stopData: any = {};
        
        if (mode === 'heart') {
          stopData.heart_rate = ai.bpm;
          stopData.murmur_detected = ai.murmur_detected;
          stopData.confidence = ai.ai_confidence_pct / 100; // convert to 0-1 range
          stopData.label = ai.murmur_detected ? 'Warning' : 'Normal';
          stopData.summary = processedResult.summary; // Include summary
        } else {
          stopData.breathing_rate = ai.resp_rate;
          stopData.crackles_detected = ai.crackle_detected;
          stopData.wheezes_detected = ai.wheeze_detected;
          stopData.confidence = ai.ai_confidence_pct / 100; // convert to 0-1 range
          stopData.label = (ai.crackle_detected || ai.wheeze_detected) ? 'Warning' : 'Normal';
          stopData.summary = processedResult.summary; // Include summary
        }

        await stopRecording(id, stopData);
      }

      // Stop timer after AI processing
      setIsAnalyzing(false);
      stopTimer();
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? `Failed to run ${mode} AI.`);
    } finally {
      setBusy(false);
    }
  }

  async function handleSave(payload: { name: string; age?: number; sex?: string; sport?: string }) {
    if (busy) return;

    if (!recordingId) {
      alert("No recording to save. Please record first.");
      return;
    }

    const name = payload.name?.trim();
    if (!name) {
      alert("Recording name is required.");
      return;
    }

    try {
      setBusy(true);
      await saveRecordingName(recordingId, name);
      
      // Update patient details if provided
      if (patientId && (payload.age !== undefined || payload.sex || payload.sport)) {
        try {
          await updatePatient(patientId, {
            age: payload.age,
            sex: payload.sex,
            sport: payload.sport,
          });
        } catch (e: any) {
          console.warn("Failed to update patient details:", e);
          // Continue saving even if patient update fails
        }
      }

      setShowSave(false);
      setRecordingName("");
      setRecordingId(null);
      alert("Saved! Check Session History.");
    } catch (e: any) {
      alert(e?.message ?? "Failed to save recording.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      {/* WAV picker (hidden) */}
      <input
        ref={wavPickerRef}
        type="file"
        accept=".wav,audio/wav"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          e.currentTarget.value = "";
          if (!file) return;
          runAiWithFile(file);
        }}
      />

      {/* Keep mounted for debug */}
      <div style={{ display: "none" }}>{patientId ?? ""}</div>

      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f4f6f9",
          padding: 16,
          boxSizing: "border-box",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Header */}
        <HeaderComponent title={title} subtitle={subtitle} onBack={onBack} />

        {/* Main grid (left controls, right result) */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 16,
            marginTop: 16,
            minHeight: 0,
          }}
        >
          {/* LEFT column: Start / Test WAV / Save */}
          <div
            style={{
              display: "grid",
              gridTemplateRows: "1fr auto 1fr",
              gap: 14,
              minHeight: 0,
            }}
          >
            {/* Start/Stop */}
            <StatesComponent 
              isAnalyzing={isAnalyzing} 
              onStart={handleStart} 
              onStop={handleStop}
              elapsedTime={elapsedTime}
              formattedTime={formatTime(elapsedTime)}
            />

            {/* Test WAV */}
            <button
              onClick={() => wavPickerRef.current?.click()}
              disabled={busy || isAnalyzing}
              style={{
                width: "100%",
                height: 52,
                borderRadius: 16,
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                fontWeight: 800,
                cursor: busy || isAnalyzing ? "not-allowed" : "pointer",
                opacity: busy || isAnalyzing ? 0.6 : 1,
                boxShadow: "0 10px 18px rgba(0,0,0,0.06)",
              }}
              title={`Select a .wav file to test ${mode} AI`}
            >
              {testWavButtonText}
            </button>

            {/* Save Result */}
            <div
              onClick={() => {
                if (busy) return;
                if (isAnalyzing) {
                  alert("Stop the recording first before saving.");
                  return;
                }
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
                fontWeight: 800,
                cursor: busy || isAnalyzing ? "not-allowed" : "pointer",
                opacity: busy || isAnalyzing ? 0.6 : 1,
                boxShadow: "0 12px 22px rgba(0,0,0,0.14)",
                userSelect: "none",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>💾</div>
              Save Result
            </div>
          </div>

          {/* RIGHT column: Result panel */}
          <div style={{ height: "100%", overflowY: "auto", paddingRight: 6 }}>
            {result ? (
              <ResultComponent {...result} />
            ) : (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: 24,
                  boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
                  border: "1px solid #eef2f7",
                  height: "fit-content",
                }}
              >
                <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8, fontWeight: 700 }}>
                  Recording Result
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#0f172a" }}>
                  No result yet
                </div>
                <div style={{ marginTop: 10, fontSize: 14, color: "#334155", lineHeight: 1.5 }}>
                  Click <b>{testWavButtonText}</b> and choose a <b>.wav</b> file to see the AI output here.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save modal */}
        {showSave && (
          <SaveComponent
            name={recordingName}
            setName={setRecordingName}
            onConfirm={handleSave}
            onCancel={() => {
              setShowSave(false);
              setRecordingName("");
            }}
          />
        )}

        {/* Busy toast */}
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
              fontWeight: 700,
            }}
          >
            Working…
          </div>
        )}
      </div>
    </Screen>
  );
}
