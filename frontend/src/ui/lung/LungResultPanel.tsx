// frontend/src/ui/lung/LungResultPanel.tsx

interface Props {
  status: string;
  respRate: number | null;
  cracklesDetected: boolean;
  wheezesDetected: boolean;
  aiConfidence: number | null;
  summary: string;
}

export default function LungResultPanel({
  status,
  respRate,
  cracklesDetected,
  wheezesDetected,
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
      <div>
        <div style={{ fontSize: 12, color: "#64748b" }}>Status</div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{status}</div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            Respiratory Rate
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            {respRate ?? "—"} BrPM
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            AI Confidence
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            {aiConfidence ?? "—"}%
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <div>
          Crackles:{" "}
          <b>{cracklesDetected ? "Detected" : "Not Detected"}</b>
        </div>
        <div>
          Wheezes:{" "}
          <b>{wheezesDetected ? "Detected" : "Not Detected"}</b>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, color: "#64748b" }}>Summary</div>
        <div style={{ marginTop: 4 }}>{summary}</div>
      </div>
    </div>
  );
}
