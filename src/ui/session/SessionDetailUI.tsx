import Screen from "../../components/Screen";
import LCDButton from "../../components/LCDButton";
import InfoCard from "../heart/InfoCard";
import type { Session } from "../../models/Session";

interface Props {
  session: Session;
  onBack: () => void;
}

export default function SessionDetailUI({ session, onBack }: Props) {
  const { type, name, date, result } = session;

  const typeLabel = type === "heart" ? "Heart Analysis" : "Lung Analysis";
  const icon = type === "heart" ? "❤" : "🫁";
  const accent = type === "heart" ? "#ff2d6f" : "#0ea5e9";

  return (
    <Screen>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <LCDButton onClick={onBack}>← Back</LCDButton>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{name}</div>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            {typeLabel} • {new Date(date).toLocaleString()}
          </div>
        </div>

        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 20,
          }}
        >
          {icon}
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
          height: "100%",
        }}
      >
        {/* LEFT — SUMMARY */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 20,
            padding: 20,
            border: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ fontSize: 14, color: "#64748b" }}>
            🧾 Analysis Summary
          </div>

          <div style={{ fontSize: 16, lineHeight: 1.6 }}>
            {"summary" in result && result.summary
              ? result.summary
              : "No summary available."}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {"status" in result && result.status && (
              <Pill icon="🩺" label="Status" value={result.status} />
            )}
            {"confidence" in result && result.confidence !== undefined && (
              <Pill icon="🤖" label="AI" value={`${result.confidence}%`} />
            )}
          </div>
        </div>

        {/* RIGHT — METRICS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {type === "heart" && (
            <>
              <InfoCard label="❤ Heart Rate">
                {"heartRate" in result && result.heartRate !== undefined
                  ? `${result.heartRate} BPM`
                  : "—"}
              </InfoCard>

              <InfoCard label="🩺 Status">
                {"status" in result ? result.status ?? "—" : "—"}
              </InfoCard>

              <InfoCard label="🤖 AI Confidence">
                {"confidence" in result && result.confidence !== undefined
                  ? `${result.confidence}%`
                  : "—"}
              </InfoCard>
            </>
          )}

          {type === "lung" && (
            <>
              <InfoCard label="🫁 Crackles">
                {"crackles" in result
                  ? result.crackles
                    ? "Detected"
                    : "Not Detected"
                  : "—"}
              </InfoCard>

              <InfoCard label="🌬 Wheezes">
                {"wheezes" in result
                  ? result.wheezes
                    ? "Detected"
                    : "Not Detected"
                  : "—"}
              </InfoCard>

              <InfoCard label="🤖 AI Confidence">
                {"confidence" in result && result.confidence !== undefined
                  ? `${result.confidence}%`
                  : "—"}
              </InfoCard>
            </>
          )}
        </div>
      </div>
    </Screen>
  );
}

/* ---------- Small reusable pill ---------- */
function Pill({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: "8px 12px",
        borderRadius: 999,
        border: "1px solid #e5e7eb",
        background: "#f8fafc",
        fontSize: 13,
        display: "inline-flex",
        gap: 6,
        alignItems: "center",
      }}
    >
      <span>{icon}</span>
      <span style={{ color: "#64748b" }}>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
