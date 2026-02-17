import SessionMetric from "./SessionMetric";
import type { Session } from "../../models/Session";
import type { HeartResult, LungResult } from "../../models/Session";
import { 
  getHeartRateRiskLevel, 
  getRespRateRiskLevel, 
  getRiskLevelConfig, 
  getRiskLevelIndicator 
} from "../../utils/riskLevel";

interface Props {
  session: Session;
  onClick: () => void;
}

export default function SessionCard({ session, onClick }: Props) {
  const isHeart = session.type === "heart";
  const result: any = session.result ?? {};

  // Always show normalized name (SessionHistoryUI already ensures it)
  const title = session.name;

  // Determine risk level
  let riskLevel: "green" | "amber" | "red" = "green";
  if (isHeart && isHeartResult(result) && result.heartRate != null) {
    riskLevel = getHeartRateRiskLevel(result.heartRate);
  } else if (!isHeart && isLungResult(result) && result.respRate != null) {
    riskLevel = getRespRateRiskLevel(result.respRate);
  }

  const riskConfig = getRiskLevelConfig(riskLevel);

  return (
    <div
      onClick={onClick}
      style={{
        width: "100%",
        padding: 16,
        borderRadius: 18,
        border: `1px solid ${riskConfig.borderColor}`,
        background: riskConfig.bgColor,
        cursor: "pointer",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 28 }}>{isHeart ? "❤️" : "🫁"}</div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>{title}</div>

          <div style={{ fontSize: 12, color: "#64748b" }}>
            {new Date(session.date).toLocaleString()}
          </div>
        </div>

        <div 
          style={{ 
            fontSize: 24,
            alignSelf: "flex-start"
          }}
          title={riskConfig.label}
        >
          {getRiskLevelIndicator(riskLevel)}
        </div>
      </div>

      {/* Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
        }}
      >
        {isHeart && isHeartResult(result) && (
          <SessionMetric label="Heart Rate" value={result.heartRate ?? "—"} unit="BPM" />
        )}

        {!isHeart && isLungResult(result) && (
          <SessionMetric label="Resp. Rate" value={result.respRate ?? "—"} unit="BrPM" />
        )}

        <SessionMetric label="Status" value={result.status ?? "—"} />
        
        <SessionMetric 
          label="Risk Level" 
          value={riskConfig.label} 
          style={{ color: riskConfig.textColor, fontWeight: 600 }}
        />
      </div>
    </div>
  );
}

/* ---------------- TYPE GUARDS ---------------- */

function isHeartResult(result: HeartResult | LungResult): result is HeartResult {
  return result && typeof (result as any).heartRate !== "undefined";
}

function isLungResult(result: HeartResult | LungResult): result is LungResult {
  return result && typeof (result as any).respRate !== "undefined";
}
