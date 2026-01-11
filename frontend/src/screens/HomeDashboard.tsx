import { useEffect, useState } from "react";
import Screen from "../components/Screen";
import LCDButton from "../components/LCDButton";
import { getDashboardSummary } from "../services/analysis.service";
import type { DashboardData } from "../services/analysis.service";

type HomeScreen = "heart" | "lung" | "history";

interface Props {
  onNavigate: (screen: HomeScreen) => void;
}

const PATIENT_ID = 1; // temporary

export default function HomeDashboard({ onNavigate }: Props) {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboardSummary(PATIENT_ID).then(setDashboard).catch(console.error);
  }, []);

  return (
    <Screen title="Smart AI Stethoscope">
      {/* Optional quick header */}
      {dashboard && (
        <div style={{ marginBottom: 16, opacity: 0.9 }}>
          <div>Hello, {dashboard.athlete}</div>
          <div>
            Status: {dashboard.status} | HR: {dashboard.heart_rate} | BR:{" "}
            {dashboard.breathing_rate} | Conf:{" "}
            {Math.round(dashboard.confidence * 100)}%
          </div>
        </div>
      )}

      <LCDButton onClick={() => onNavigate("heart")}>Heart Analysis</LCDButton>
      <LCDButton onClick={() => onNavigate("lung")}>Lung Analysis</LCDButton>
      <LCDButton onClick={() => onNavigate("history")}>
        Session History
      </LCDButton>
    </Screen>
  );
}
