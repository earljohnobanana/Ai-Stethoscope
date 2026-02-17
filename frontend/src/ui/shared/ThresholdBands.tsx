import { HEART_RATE_THRESHOLDS, RESP_RATE_THRESHOLDS, getRiskLevelConfig } from "../../utils/riskLevel";

interface Props {
  type: "heart" | "lung";
  value: number;
}

export default function ThresholdBands({ type, value }: Props) {
  const unit = type === "heart" ? "BPM" : "BrPM";
  const label = type === "heart" ? "Heart Rate" : "Respiratory Rate";

  // Determine the range for visualization (extend beyond red thresholds for better visibility)
  const minValue = Math.max(0, (type === "heart" ? 40 : 8));
  const maxValue = type === "heart" ? 130 : 35;

  // Calculate positions for each threshold band
  let greenStart = 0, greenWidth = 0;
  let amberStart = 0, amberWidth = 0;
  let redLowWidth = 0;
  let redHighStart = 0, redHighWidth = 0;

  if (type === "heart") {
    greenStart = ((HEART_RATE_THRESHOLDS.green.min - minValue) / (maxValue - minValue)) * 100;
    greenWidth = ((HEART_RATE_THRESHOLDS.green.max - HEART_RATE_THRESHOLDS.green.min) / (maxValue - minValue)) * 100;
    
    amberStart = ((HEART_RATE_THRESHOLDS.amber.min - minValue) / (maxValue - minValue)) * 100;
    amberWidth = ((HEART_RATE_THRESHOLDS.amber.max - HEART_RATE_THRESHOLDS.amber.min) / (maxValue - minValue)) * 100;
    
    redLowWidth = greenStart; // From minValue to green min
    
    redHighStart = ((HEART_RATE_THRESHOLDS.red.high.min - minValue) / (maxValue - minValue)) * 100;
    redHighWidth = 100 - redHighStart;
  } else {
    greenStart = ((RESP_RATE_THRESHOLDS.green.min - minValue) / (maxValue - minValue)) * 100;
    greenWidth = ((RESP_RATE_THRESHOLDS.green.max - RESP_RATE_THRESHOLDS.green.min) / (maxValue - minValue)) * 100;
    
    amberStart = ((RESP_RATE_THRESHOLDS.amber.min - minValue) / (maxValue - minValue)) * 100;
    amberWidth = ((RESP_RATE_THRESHOLDS.amber.max - RESP_RATE_THRESHOLDS.amber.min) / (maxValue - minValue)) * 100;
    
    redLowWidth = greenStart; // From minValue to green min
    
    redHighStart = ((RESP_RATE_THRESHOLDS.red.high.min - minValue) / (maxValue - minValue)) * 100;
    redHighWidth = 100 - redHighStart;
  }

  // Calculate position of current value on the scale
  const valuePosition = ((value - minValue) / (maxValue - minValue)) * 100;

  return (
    <div style={{ width: "100%" }}>
      <div style={{ 
        fontSize: 12, 
        color: "#64748b", 
        marginBottom: 8,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span>{label} Thresholds</span>
        <span style={{ fontWeight: 600 }}>{value} {unit}</span>
      </div>

      {/* Threshold Bands Visualization */}
      <div style={{
        position: "relative",
        height: 24,
        borderRadius: 12,
        overflow: "hidden",
        background: "#e2e8f0",
        marginBottom: 8
      }}>
        {/* Red Low Band */}
        {redLowWidth > 0 && (
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${redLowWidth}%`,
            background: getRiskLevelConfig("red").color,
            borderRight: "1px solid rgba(255, 255, 255, 0.5)"
          }} />
        )}
        
        {/* Green Band */}
        <div style={{
          position: "absolute",
          left: `${greenStart}%`,
          top: 0,
          height: "100%",
          width: `${greenWidth}%`,
          background: getRiskLevelConfig("green").color,
          borderRight: "1px solid rgba(255, 255, 255, 0.5)"
        }} />
        
        {/* Amber Band */}
        <div style={{
          position: "absolute",
          left: `${amberStart}%`,
          top: 0,
          height: "100%",
          width: `${amberWidth}%`,
          background: getRiskLevelConfig("amber").color,
          borderRight: "1px solid rgba(255, 255, 255, 0.5)"
        }} />
        
        {/* Red High Band */}
        {redHighWidth > 0 && (
          <div style={{
            position: "absolute",
            left: `${redHighStart}%`,
            top: 0,
            height: "100%",
            width: `${redHighWidth}%`,
            background: getRiskLevelConfig("red").color
          }} />
        )}

        {/* Current Value Indicator */}
        <div style={{
          position: "absolute",
          left: `calc(${valuePosition}% - 6px)`,
          top: "50%",
          transform: "translateY(-50%)",
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "#ffffff",
          border: "2px solid #0f172a",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          zIndex: 10
        }} />
      </div>

      {/* Threshold Labels */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 11,
        color: "#64748b"
      }}>
        <span>{minValue} {unit}</span>
        {type === "heart" ? (
          <>
            <span>{HEART_RATE_THRESHOLDS.red.low.max} {unit}</span>
            <span>{HEART_RATE_THRESHOLDS.green.min}-{HEART_RATE_THRESHOLDS.green.max} {unit}</span>
            <span>{HEART_RATE_THRESHOLDS.amber.min}-{HEART_RATE_THRESHOLDS.amber.max} {unit}</span>
            <span>{maxValue} {unit}</span>
          </>
        ) : (
          <>
            <span>{RESP_RATE_THRESHOLDS.red.low.max} {unit}</span>
            <span>{RESP_RATE_THRESHOLDS.green.min}-{RESP_RATE_THRESHOLDS.green.max} {unit}</span>
            <span>{RESP_RATE_THRESHOLDS.amber.min}-{RESP_RATE_THRESHOLDS.amber.max} {unit}</span>
            <span>{maxValue} {unit}</span>
          </>
        )}
      </div>

      {/* Legend */}
      <div style={{
        display: "flex",
        gap: 12,
        marginTop: 8,
        justifyContent: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: 2,
            background: getRiskLevelConfig("green").color
          }} />
          <span style={{ fontSize: 11, color: "#64748b" }}>Normal</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: 2,
            background: getRiskLevelConfig("amber").color
          }} />
          <span style={{ fontSize: 11, color: "#64748b" }}>
            {type === "heart" ? "Mild Tachycardia" : "Mild Elevation"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: 2,
            background: getRiskLevelConfig("red").color
          }} />
          <span style={{ fontSize: 11, color: "#64748b" }}>High Risk</span>
        </div>
      </div>
    </div>
  );
}
