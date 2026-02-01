interface Props {
  status: string;
  heartRate: number | null;
  aiConfidence: number;
  summary: string;
}

export default function HeartResultPanel({
  status,
  heartRate,
  aiConfidence,
  summary,
}: Props) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Status */}
      <div
        style={{
          border: "1px solid #10b981",
          borderRadius: 14,
          padding: 16,
          background: "#ecfdf5",
        }}
      >
        <div style={{ fontSize: 14, color: "#065f46" }}>Status</div>
        <div style={{ fontSize: 22, fontWeight: 600 }}>{status}</div>
      </div>

      {/* Heart Rate */}
      <div
        style={{
          borderRadius: 14,
          padding: 16,
          background: "#f9fafb",
        }}
      >
        <div style={{ fontSize: 14, color: "#6b7280" }}>Heart Rate</div>
        <div style={{ fontSize: 36, fontWeight: 700 }}>
          {heartRate != null ? (
            <>
              {heartRate} <span style={{ fontSize: 18 }}>BPM</span>
            </>
          ) : (
            "—"
          )}
        </div>
      </div>

      {/* AI Confidence */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
            fontSize: 14,
          }}
        >
          <span>AI Confidence</span>
          <strong>{aiConfidence}%</strong>
        </div>
        <div
          style={{
            height: 10,
            borderRadius: 999,
            background: "#e5e7eb",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${aiConfidence}%`,
              height: "100%",
              background: "#2563eb",
            }}
          />
        </div>
      </div>

      {/* Summary */}
      <div>
        <div style={{ fontSize: 14, marginBottom: 8 }}>
          Analysis Summary
        </div>
        <div
          style={{
            padding: 14,
            borderRadius: 12,
            background: "#eff6ff",
            fontSize: 14,
          }}
        >
          {summary}
        </div>
      </div>
    </div>
  );
}
