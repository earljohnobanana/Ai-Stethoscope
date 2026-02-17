export type RiskLevel = "green" | "amber" | "red";

interface RiskLevelConfig {
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  label: string;
}

export const RISK_LEVEL_CONFIG: Record<RiskLevel, RiskLevelConfig> = {
  green: {
    color: "#10b981",
    bgColor: "#ecfdf5",
    borderColor: "#a7f3d0",
    textColor: "#065f46",
    label: "Normal"
  },
  amber: {
    color: "#f59e0b",
    bgColor: "#fffbeb",
    borderColor: "#fcd34d",
    textColor: "#92400e",
    label: "Moderate"
  },
  red: {
    color: "#ef4444",
    bgColor: "#fef2f2",
    borderColor: "#fca5a5",
    textColor: "#991b1b",
    label: "High Risk"
  }
};

// Heart rate thresholds (BPM) for adults - No overlaps, clinical ranges
export const HEART_RATE_THRESHOLDS = {
  green: { min: 60, max: 100, label: "Normal" },
  amber: { min: 101, max: 120, label: "Mild Tachycardia" },
  red: { 
    low: { min: 0, max: 59, label: "Bradycardia" },
    high: { min: 121, max: Infinity, label: "High Risk Tachycardia" }
  }
};

// Respiratory rate thresholds (Breaths per minute) for adults - No overlaps, clinical ranges
export const RESP_RATE_THRESHOLDS = {
  green: { min: 12, max: 20, label: "Normal" },
  amber: { min: 21, max: 24, label: "Mild Elevation" },
  red: { 
    low: { min: 0, max: 11, label: "Bradypnea" },
    high: { min: 25, max: Infinity, label: "High Risk" }
  }
};

export function getHeartRateRiskLevel(heartRate: number): RiskLevel {
  if (heartRate >= HEART_RATE_THRESHOLDS.green.min && heartRate <= HEART_RATE_THRESHOLDS.green.max) {
    return "green";
  }
  if (heartRate >= HEART_RATE_THRESHOLDS.amber.min && heartRate <= HEART_RATE_THRESHOLDS.amber.max) {
    return "amber";
  }
  return "red";
}

export function getHeartRateSeverity(heartRate: number): string {
  if (heartRate >= HEART_RATE_THRESHOLDS.green.min && heartRate <= HEART_RATE_THRESHOLDS.green.max) {
    return HEART_RATE_THRESHOLDS.green.label;
  }
  if (heartRate >= HEART_RATE_THRESHOLDS.amber.min && heartRate <= HEART_RATE_THRESHOLDS.amber.max) {
    return HEART_RATE_THRESHOLDS.amber.label;
  }
  if (heartRate < HEART_RATE_THRESHOLDS.green.min) {
    return HEART_RATE_THRESHOLDS.red.low.label;
  }
  return HEART_RATE_THRESHOLDS.red.high.label;
}

export function getRespRateRiskLevel(respRate: number): RiskLevel {
  if (respRate >= RESP_RATE_THRESHOLDS.green.min && respRate <= RESP_RATE_THRESHOLDS.green.max) {
    return "green";
  }
  if (respRate >= RESP_RATE_THRESHOLDS.amber.min && respRate <= RESP_RATE_THRESHOLDS.amber.max) {
    return "amber";
  }
  return "red";
}

export function getRespRateSeverity(respRate: number): string {
  if (respRate >= RESP_RATE_THRESHOLDS.green.min && respRate <= RESP_RATE_THRESHOLDS.green.max) {
    return RESP_RATE_THRESHOLDS.green.label;
  }
  if (respRate >= RESP_RATE_THRESHOLDS.amber.min && respRate <= RESP_RATE_THRESHOLDS.amber.max) {
    return RESP_RATE_THRESHOLDS.amber.label;
  }
  if (respRate < RESP_RATE_THRESHOLDS.green.min) {
    return RESP_RATE_THRESHOLDS.red.low.label;
  }
  return RESP_RATE_THRESHOLDS.red.high.label;
}

export function getRiskLevelConfig(riskLevel: RiskLevel): RiskLevelConfig {
  return RISK_LEVEL_CONFIG[riskLevel];
}

export function getRiskLevelIndicator(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case "green":
      return "🟢";
    case "amber":
      return "🟡";
    case "red":
      return "🔴";
  }
}
