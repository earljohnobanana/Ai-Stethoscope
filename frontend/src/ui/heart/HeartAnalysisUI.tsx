// frontend/src/ui/heart/HeartAnalysisUI.tsx
import AnalysisBaseUI from "../shared/AnalysisBaseUI";
import HeartHeader from "./HeartHeader";
import HeartStates from "./HeartStates";
import HeartResultPanel from "./HeartResultPanel";
import SaveRecordingPanel from "./SaveRecordingPanel";
import { inferHeart } from "../../services/inferenceApi";

interface Props {
  onBack: () => void;
}

type HeartUIResult = {
  status: string;
  heartRate: number;
  aiConfidence: number;
  summary: string;
};

function processHeartResult(ai: any): HeartUIResult {
  const murmurDetected = Boolean(ai?.murmur_detected);
  const heartRate = ai?.bpm;
  const confidence = typeof ai?.ai_confidence_pct === "number" ? ai.ai_confidence_pct : 0;

  // Generate detailed summary with prescription
  let summary = "";
  if (murmurDetected) {
    summary = "Possible murmur detected. This may indicate heart valve abnormalities. ";
    if (heartRate) {
      if (heartRate < 60) {
        summary += `Heart rate is ${heartRate} BPM (bradycardia). `;
      } else if (heartRate > 100) {
        summary += `Heart rate is ${heartRate} BPM (tachycardia). `;
      }
    }
    summary += "We recommend consulting a cardiologist for further evaluation and possible echocardiogram.";
  } else if (heartRate) {
    if (heartRate < 60) {
      summary = `Heart rate is ${heartRate} BPM (bradycardia). If you experience dizziness or fatigue, consult a healthcare professional.`;
    } else if (heartRate > 100) {
      summary = `Heart rate is ${heartRate} BPM (tachycardia). If you experience shortness of breath or chest pain, seek medical attention.`;
    } else {
      summary = "Heart analysis shows normal results. No murmur detected. Heart rate is within normal range (60-100 BPM).";
    }
  } else {
    summary = "Heart analysis completed. No murmur detected. Unable to estimate heart rate.";
  }

  return {
    status: murmurDetected ? "Murmur Detected" : "Normal",
    heartRate: heartRate,
    aiConfidence: confidence,
    summary: summary,
  };
}

export default function HeartAnalysisUI({ onBack }: Props) {
  return (
    <AnalysisBaseUI
      onBack={onBack}
      title="Heart Analysis"
      subtitle="Real-time cardiac monitoring"
      HeaderComponent={HeartHeader}
      StatesComponent={HeartStates}
      ResultComponent={HeartResultPanel}
      SaveComponent={SaveRecordingPanel}
      inferFunction={inferHeart}
      processResult={processHeartResult}
      testWavButtonText="Test WAV (Heart)"
      mode="heart"
    />
  );
}
