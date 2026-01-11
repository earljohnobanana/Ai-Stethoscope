import { useState } from "react";
import Screen from "../../components/Screen";

import HeartHeader from "./HeartHeader";
import HeartStates from "./HeartStates";
import HeartResultPanel from "./HeartResultPanel";
import SaveRecordingPanel from "./SaveRecordingPanel";

interface Props {
  onBack: () => void;
}

export default function HeartAnalysisUI({ onBack }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showSave, setShowSave] = useState(false);

  return (
    <Screen>
      {/* FULL SCREEN CONTAINER */}
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f4f6f9",
          padding: 16,
          boxSizing: "border-box",
          overflow: "hidden", // 🔴 prevents page scroll
        }}
      >
        {/* HEADER */}
        <div style={{ flexShrink: 0 }}>
          <HeartHeader
            title="Heart Analysis"
            subtitle="Real-time cardiac monitoring"
            onBack={onBack}// ✅ heart logo beside title (already supported)
          />
        </div>

        {/* CONTENT AREA */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginTop: 16,
            minHeight: 0, // 🔴 critical for scroll control
          }}
        >
          {/* LEFT SIDE — CONTROLS */}
          <div
            style={{
              display: "grid",
              gridTemplateRows: "1fr 1fr", // equal height buttons
              gap: 16,
              minHeight: 0,
            }}
          >
            {/* STOP / START */}
            <div>
              <HeartStates
                isAnalyzing={isAnalyzing}
                onStart={() => setIsAnalyzing(true)}
                onStop={() => setIsAnalyzing(false)}
              />
            </div>

            {/* SAVE RESULT */}
            <div
              onClick={() => setShowSave(true)}
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
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                userSelect: "none",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 6 }}>💾</div>
              Save Result
            </div>
          </div>

          {/* RIGHT SIDE — RESULT PANEL (ONLY THIS SCROLLS) */}
          <div
            style={{
              height: "100%",
              overflowY: "auto",
              paddingRight: 4,
            }}
          >
            <HeartResultPanel
              status="Normal"
              heartRate={70}
              aiConfidence={96.1}
              summary="No cardiac abnormalities detected. Continue regular monitoring and training."
            />
          </div>
        </div>

        {/* SAVE POPUP */}
        {showSave && (
          <SaveRecordingPanel
            onConfirm={() => setShowSave(false)}
            onCancel={() => setShowSave(false)}
          />
        )}
      </div>
    </Screen>
  );
}
