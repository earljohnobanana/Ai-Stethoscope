import { useState } from "react";
import Screen from "../../components/Screen";

import LungHeader from "./LungHeader";
import LungStates from "./LungStates";
import LungResultPanel from "./LungResultPanel";
import SaveRecordingPanel from "../heart/SaveRecordingPanel";

interface Props {
  onBack: () => void;
}

export default function LungAnalysisUI({ onBack }: Props) {
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
          overflow: "hidden", // ❌ no page scroll
        }}
      >
        {/* HEADER */}
        <div style={{ flexShrink: 0 }}>
          <LungHeader
            title="Lung Analysis"
            subtitle="Respiratory sound monitoring"
            onBack={onBack}
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
            minHeight: 0, // 🔑 critical
          }}
        >
          {/* LEFT — CONTROLS */}
          <div
            style={{
              display: "grid",
              gridTemplateRows: "1fr 1fr", // equal height buttons
              gap: 16,
              minHeight: 0,
            }}
          >
            {/* START / STOP */}
            <div>
              <LungStates
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

          {/* RIGHT — RESULT PANEL (ONLY THIS SCROLLS) */}
          <div
            style={{
              height: "100%",
              overflowY: "auto",
              paddingRight: 4,
            }}
          >
            <LungResultPanel
              status="Normal"
              crackles={false}
              wheezes={false}
              aiConfidence={92.4}
              summary="Normal lung sounds detected. No crackles or wheezes present."
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
