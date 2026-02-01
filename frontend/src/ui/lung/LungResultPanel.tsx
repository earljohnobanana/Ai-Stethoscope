// frontend/src/ui/lung/LungResultPanel.tsx

interface Props {
  status: string;
  respRate: number;
  cracklesDetected: boolean;
  wheezesDetected: boolean;
  aiConfidence: number; // 0-100
  summary: string;

  // optional (if you want to show datetime like image 2)
  timestamp?: string; // e.g. "Jan 15, 2026, 2:21 PM"
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
  aiConfidence,
  summary,
  timestamp,
}: Props) {
  const pct = clampPct(aiConfidence);
  const pill = pillColor(status);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.25fr 1fr",
        gap: 16,
        alignItems: "start",
      }}
    >
      {/* LEFT SUMMARY CARD (like image 2) */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 20,
          padding: 18,
          boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
          border: "1px solid #eef2f7",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Lung Analysis</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              {timestamp ?? "—"}
            </div>
          </div>

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
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Analysis Summary</div>
          <div style={{ marginTop: 6, fontSize: 14, color: "#0f172a", lineHeight: 1.5 }}>
            {summary?.trim() ? summary : "No analysis summary available."}
          </div>
        </div>

        {/* “chips” row (like image 2) */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <Chip icon="🤖" label={`AI ${pct}%`} />
          {respRate != null && <Chip icon="🫁" label={`${respRate} BrPM`} />}
        </div>
      </div>

      {/* RIGHT STACKED METRICS */}
      <div style={{ display: "grid", gap: 12 }}>
        <MetricCard
          label="Respiratory Rate"
          value={respRate != null ? `${respRate} BrPM` : "—"}
          big
        />
        <MetricCard
          label="Crackles"
          value={cracklesDetected ? "Detected" : "Not Detected"}
        />
        <MetricCard
          label="Wheezes"
          value={wheezesDetected ? "Detected" : "Not Detected"}
        />
        <ConfidenceCard pct={pct} />
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
        padding: "8px 12px",
        borderRadius: 999,
        border: "1px solid #e5e7eb",
        background: "#f8fafc",
        color: "#0f172a",
        fontSize: 12,
        fontWeight: 800,
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function MetricCard({
  label,
  value,
  big,
}: {
  label: string;
  value: string;
  big?: boolean;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 18,
        padding: 16,
        boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
        border: "1px solid #eef2f7",
      }}
    >
      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 800 }}>{label}</div>
      <div
        style={{
          marginTop: 6,
          fontSize: big ? 34 : 18,
          fontWeight: 900,
          color: "#0f172a",
          letterSpacing: -0.3,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ConfidenceCard({ pct }: { pct: number }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 18,
        padding: 16,
        boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
        border: "1px solid #eef2f7",
      }}
    >
      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 800 }}>AI Confidence</div>

      <div
        style={{
          marginTop: 10,
          width: "100%",
          height: 10,
          borderRadius: 999,
          background: "#e5e7eb",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 999,
            background: "#2563eb",
            transition: "width 200ms ease",
          }}
        />
      </div>

      <div style={{ marginTop: 10, fontSize: 14, fontWeight: 900, color: "#0f172a" }}>
        {pct}%
      </div>
    </div>
  );
}
