import { 
  getHeartRateRiskLevel, 
  getHeartRateSeverity, 
  getRiskLevelConfig, 
  getRiskLevelIndicator 
} from "../../utils/riskLevel";
import ThresholdBands from "../shared/ThresholdBands";

interface Props {
  status: string;
  heartRate: number | null;
  murmurDetected: boolean;
  murmurSeverity?: string;
  murmurPattern?: string;
  aiConfidence: number;
  summary: string;
  duration?: number; // in seconds
}

export default function HeartResultPanel({
  status,
  heartRate,
  murmurDetected,
  murmurSeverity = "Moderate Intensity",
  murmurPattern = "Not classified",
  aiConfidence,
  summary,
  duration = 30,
}: Props) {
  // Determine risk level
  const riskLevel = heartRate != null ? getHeartRateRiskLevel(heartRate) : "green";
  const riskConfig = getRiskLevelConfig(riskLevel);

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Status and Risk Level */}
      <div
        style={{
          border: `1px solid ${riskConfig.borderColor}`,
          borderRadius: 14,
          padding: 16,
          background: riskConfig.bgColor,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <div style={{ fontSize: 14, color: "#065f46" }}>Status</div>
          <div style={{ fontSize: 22, fontWeight: 600 }}>{status}</div>
        </div>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 4,
          padding: "8px 12px",
          borderRadius: 12,
          background: "rgba(255, 255, 255, 0.8)",
          fontSize: 14,
          fontWeight: 600,
          color: riskConfig.textColor
        }}>
          {getRiskLevelIndicator(riskLevel)} {riskConfig.label}
        </div>
      </div>

      {/* Cardiac Findings Section */}
      <div>
        <div style={{ 
          fontSize: 16, 
          fontWeight: 700, 
          color: "#0f172a", 
          marginBottom: 16 
        }}>
          Cardiac Findings
        </div>
        
        {/* Findings Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(2, 1fr)", 
          gap: 12, 
          marginBottom: 20 
        }}>
          {/* Heart Rate */}
          <div style={{ 
            padding: 14, 
            background: "#f9fafb", 
            borderRadius: 12,
            border: "1px solid #e2e8f0"
          }}>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
              Heart Rate
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
              {heartRate != null ? (
                <>
                  {heartRate} <span style={{ fontSize: 14 }}>BPM</span>
                </>
              ) : (
                "—"
              )}
            </div>
            {heartRate != null && (
              <div style={{ 
                fontSize: 12, 
                color: riskConfig.textColor, 
                marginTop: 4,
                fontStyle: "italic"
              }}>
                ({getHeartRateSeverity(heartRate)})
              </div>
            )}
          </div>

          {/* Murmur Detection */}
          <div style={{ 
            padding: 14, 
            background: "#f9fafb", 
            borderRadius: 12,
            border: "1px solid #e2e8f0"
          }}>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
              Murmur
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
              {murmurDetected ? "Detected" : "Not Detected"}
            </div>
            {murmurDetected && (
              <>
                <div style={{ 
                  fontSize: 12, 
                  color: "#64748b", 
                  marginTop: 4 
                }}>
                  Severity: {murmurSeverity}
                </div>
                <div style={{ 
                  fontSize: 12, 
                  color: "#64748b" 
                }}>
                  Pattern: {murmurPattern}
                </div>
              </>
            )}
          </div>
        </div>

        {/* AI Certainty */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ 
            fontSize: 12, 
            color: "#64748b", 
            marginBottom: 8 
          }}>
            AI Certainty
          </div>
          <div style={{ 
            height: 8, 
            borderRadius: 999, 
            background: "#e2e8f0", 
            overflow: "hidden",
            marginBottom: 6
          }}>
            <div style={{ 
              height: "100%", 
              width: `${aiConfidence}%`, 
              background: "#2563eb",
              borderRadius: 999
            }} />
          </div>
          <div style={{ 
            fontSize: 11, 
            color: "#64748b",
            fontStyle: "italic"
          }}>
            AI Certainty: {aiConfidence}% (Confidence represents model prediction probability, not severity.)
          </div>
        </div>

        {/* Threshold Bands */}
        {heartRate != null && (
          <div style={{ marginBottom: 20 }}>
            <ThresholdBands type="heart" value={heartRate} />
          </div>
        )}

        {/* Summary */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, marginBottom: 8 }}>
            Analysis Summary
          </div>
          <div
            style={{
              padding: 14,
              borderRadius: 12,
              background: "#eff6ff",
              fontSize: 14,
              lineHeight: 1.6,
              color: "#0f172a"
            }}
          >
            {summary}
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
            <div>Model Version: Heart-CNN v1.2</div>
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
    </div>
  );
}
