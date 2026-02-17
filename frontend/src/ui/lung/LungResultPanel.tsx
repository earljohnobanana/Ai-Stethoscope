import { 
  getRespRateRiskLevel, 
  getRespRateSeverity, 
  getRiskLevelConfig, 
  getRiskLevelIndicator 
} from "../../utils/riskLevel";
import ThresholdBands from "../shared/ThresholdBands";

interface Props {
  status: string;
  respRate: number;
  cracklesDetected: boolean;
  wheezesDetected: boolean;
  crackleType?: string;
  aiConfidence: number;
  summary: string;
  timestamp?: string;
  duration?: number; // in seconds
}

function pillColor(status: string) {
  const s = (status || "").toLowerCase();
  if (s.includes("complete")) return { bg: "#DCFCE7", text: "#166534", border: "#86EFAC" };
  if (s.includes("normal")) return { bg: "#DCFCE7", text: "#166534", border: "#86EFAC" };
  if (s.includes("abnormal")) return { bg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5" };
  return { bg: "#E5E7EB", text: "#111827", border: "#D1D5DB" };
}

function clampPct(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

export default function LungResultPanel({
  status,
  respRate,
  cracklesDetected,
  wheezesDetected,
  crackleType = "Not classified",
  aiConfidence,
  summary,
  timestamp,
  duration = 30,
}: Props) {
  const pct = clampPct(aiConfidence);
  const pill = pillColor(status);
  const riskLevel = getRespRateRiskLevel(respRate);
  const riskConfig = getRiskLevelConfig(riskLevel);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.25fr 1fr",
        gap: 16,
        alignItems: "start",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* LEFT SUMMARY CARD */}
      <div
        style={{
          background: "#fff",
          border: `1px solid ${riskConfig.borderColor}`,
          borderRadius: 20,
          padding: 18,
          boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Lung Analysis</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              {timestamp ?? "—"}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div
              style={{
                alignSelf: "flex-start",
                padding: "6px 12px",
                borderRadius: 999,
                background: pill.bg,
                color: pill.text,
                border: `1px solid ${pill.border}`,
                fontSize: 12,
                fontWeight: 800,
                whiteSpace: "nowrap",
              }}
            >
              Status: {status || "—"}
            </div>
            <div
              style={{
                alignSelf: "flex-start",
                padding: "6px 12px",
                borderRadius: 999,
                background: riskConfig.bgColor,
                color: riskConfig.textColor,
                border: `1px solid ${riskConfig.borderColor}`,
                fontSize: 12,
                fontWeight: 800,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 4
              }}
            >
              {getRiskLevelIndicator(riskLevel)} {riskConfig.label}
            </div>
          </div>
        </div>

        {/* Respiratory Findings Section */}
        <div style={{ marginTop: 16 }}>
          <div style={{ 
            fontSize: 16, 
            fontWeight: 700, 
            color: "#0f172a", 
            marginBottom: 16 
          }}>
            Respiratory Findings
          </div>
        
          {/* Findings Grid */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(2, 1fr)", 
            gap: 12, 
            marginBottom: 20 
          }}>
            {/* Respiratory Rate */}
            <div style={{ 
              padding: 14, 
              background: "#f9fafb", 
              borderRadius: 12,
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
                Respiratory Rate
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                {respRate} BrPM
              </div>
              <div style={{ 
                fontSize: 12, 
                color: riskConfig.textColor, 
                marginTop: 4,
                fontStyle: "italic"
              }}>
                ({getRespRateSeverity(respRate)})
              </div>
            </div>

            {/* Crackles */}
            <div style={{ 
              padding: 14, 
              background: "#f9fafb", 
              borderRadius: 12,
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
                Crackles
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                {cracklesDetected ? "Detected" : "Not Detected"}
              </div>
              {cracklesDetected && (
                <div style={{ 
                  fontSize: 12, 
                  color: "#64748b", 
                  marginTop: 4 
                }}>
                  Type: {crackleType}
                </div>
              )}
            </div>

            {/* Wheezes */}
            <div style={{ 
              padding: 14, 
              background: "#f9fafb", 
              borderRadius: 12,
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
                Wheezes
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                {wheezesDetected ? "Detected" : "Not Detected"}
              </div>
            </div>

            {/* AI Certainty */}
            <div style={{ 
              padding: 14, 
              background: "#f9fafb", 
              borderRadius: 12,
              border: "1px solid #e2e8f0"
            }}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
                AI Certainty
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                {pct}%
              </div>
            </div>
          </div>
        </div>

        {/* AI Certainty Detail */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ 
            height: 8, 
            borderRadius: 999, 
            background: "#e2e8f0", 
            overflow: "hidden",
            marginBottom: 6
          }}>
            <div style={{ 
              height: "100%", 
              width: `${pct}%`, 
              background: "#2563eb",
              borderRadius: 999
            }} />
          </div>
          <div style={{ 
            fontSize: 11, 
            color: "#64748b",
            fontStyle: "italic"
          }}>
            Confidence represents model prediction probability, not severity.
          </div>
        </div>

        {/* Threshold Bands */}
        <div style={{ marginBottom: 20 }}>
          <ThresholdBands type="lung" value={respRate} />
        </div>

        {/* Summary */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Analysis Summary</div>
          <div style={{ marginTop: 6, fontSize: 14, color: "#0f172a", lineHeight: 1.5 }}>
            {summary?.trim() ? summary : "No analysis summary available."}
          </div>
        </div>

        {/* Recording Metadata */}
        <div style={{ 
          padding: 12, 
          background: "#f8fafc", 
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          marginBottom: 20
        }}>
          <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>
            <div>Recording Duration: {duration} seconds</div>
            <div>Sensor: ICS-43434 MEMS Microphone</div>
            <div>Model Version: Lung-CNN v1.2</div>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div style={{ 
          padding: 12, 
          background: "#fef3c7", 
          borderRadius: 12,
          border: "1px solid #fcd34d"
        }}>
          <div style={{ 
            fontSize: 11, 
            color: "#92400e", 
            lineHeight: 1.6,
            textAlign: "center"
          }}>
            This system is intended for screening assistance only and does not replace professional medical diagnosis.
          </div>
        </div>
      </div>

      {/* RIGHT CHIPS */}
      <div style={{ display: "grid", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
        <Chip icon="🤖" label={`AI ${pct}%`} />
        {respRate != null && <Chip icon="🫁" label={`${respRate} BrPM`} />}
      </div>
    </div>
  );
}

function Chip({ icon, label }: { icon: string; label: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 16px",
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        color: "#0f172a",
        fontSize: 14,
        fontWeight: 800,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)"
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
