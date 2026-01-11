import SessionMetric from "./SessionMetric";
import type { Session } from "../../models/Session";
import type { HeartResult, LungResult } from "../../models/Session";

interface Props {
  session: Session;
  onClick: () => void;
}

export default function SessionCard({ session, onClick }: Props) {
  const isHeart = session.type === "heart";
  const result = session.result;

  return (
    <div
      onClick={onClick}
      style={{
        width: "100%",
        padding: 16,
        borderRadius: 18,
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        cursor: "pointer",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 28 }}>
          {isHeart ? "❤️" : "🫁"}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>
            {session.name || (isHeart ? "Heart Analysis" : "Lung Analysis")}
          </div>

          <div style={{ fontSize: 12, color: "#64748b" }}>
            {new Date(session.date).toLocaleString()}
          </div>
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
          <SessionMetric
            label="Heart Rate"
            value={result.heartRate}
            unit="BPM"
          />
        )}

        {!isHeart && isLungResult(result) && (
          <SessionMetric
            label="Resp. Rate"
            value={result.respRate}
            unit="BrPM"
          />
        )}

        <SessionMetric
          label="Status"
          value={result.status}
        />
      </div>
    </div>
  );
}

/* ---------------- TYPE GUARDS ---------------- */

function isHeartResult(result: HeartResult | LungResult): result is HeartResult {
  return "heartRate" in result;
}

function isLungResult(result: HeartResult | LungResult): result is LungResult {
  return "respRate" in result;
}
