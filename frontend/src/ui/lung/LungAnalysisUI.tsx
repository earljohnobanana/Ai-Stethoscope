// frontend/src/ui/lung/LungAnalysisUI.tsx
import AnalysisBaseUI from "../shared/AnalysisBaseUI";
import LungHeader from "./LungHeader";
import LungStates from "./LungStates";
import LungResultPanel from "./LungResultPanel";
import SaveRecordingPanel from "./SaveRecordingPanel";
import { inferLung } from "../../services/inferenceApi";

interface Props {
  onBack: () => void;
}

type LungUIResult = {
  status: string; // "completed"
  result: string; // "normal" | "abnormal"
  respRate: number; // BrPM
  cracklesDetected: boolean;
  wheezesDetected: boolean;
  aiConfidence: number; // 0-100
  summary: string;
  timestamp: string; // for display
};

function processLungResult(ai: any): LungUIResult {
  const confidence = typeof ai?.ai_confidence_pct === "number" ? ai.ai_confidence_pct : 0;
  const crackleDetected = Boolean(ai?.crackle_detected);
  const rr = ai?.resp_rate;

  const statusText = String(ai?.status ?? "completed");
  const resultText = String(ai?.result ?? (crackleDetected ? "abnormal" : "normal"));

  // Generate detailed summary with prescription
  let summary = "";
  if (crackleDetected) {
    summary = "Crackles detected. This may indicate respiratory issues such as pneumonia or bronchitis. ";
    if (rr && (rr < 12 || rr > 20)) {
      summary += `Respiratory rate is ${rr} BrPM, which is outside the normal range (12-20 BrPM). `;
    }
    summary += "If symptoms persist (e.g., cough, fever, shortness of breath), please consult a healthcare professional.";
  } else if (rr) {
    if (rr < 12) {
      summary = `Respiratory rate is ${rr} BrPM (below normal range of 12-20 BrPM). This may indicate respiratory depression. Monitor closely and consult a healthcare professional if accompanied by other symptoms.`;
    } else if (rr > 20) {
      summary = `Respiratory rate is ${rr} BrPM (above normal range of 12-20 BrPM). This may indicate respiratory distress. Monitor closely and consult a healthcare professional if accompanied by other symptoms.`;
    } else {
      summary = "Lung analysis shows normal results. Respiratory rate is within normal range (12-20 BrPM).";
    }
  } else {
    summary = "Lung analysis completed. No crackles detected. Unable to estimate respiratory rate.";
  }

  return {
    status: statusText,
    result: resultText,
    respRate: rr,
    cracklesDetected: crackleDetected,
    wheezesDetected: Boolean(ai?.wheeze_detected ?? false),
    aiConfidence: confidence,
    summary: summary,
    timestamp: new Date().toLocaleString(),
  };
}

export default function LungAnalysisUI({ onBack }: Props) {
  return (
    <AnalysisBaseUI
      onBack={onBack}
      title="Lung Analysis"
      subtitle="Respiratory sound monitoring"
      HeaderComponent={LungHeader}
      StatesComponent={LungStates}
      ResultComponent={LungResultPanel}
      SaveComponent={SaveRecordingPanel}
      inferFunction={inferLung}
      processResult={processLungResult}
      testWavButtonText="Test WAV (Lung)"
      mode="lung"
    />
  );
}
