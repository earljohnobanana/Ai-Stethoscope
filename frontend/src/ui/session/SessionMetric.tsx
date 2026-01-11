export default function SessionMetric({
  label,
  value,
  unit,
}: {
  label: string;
  value: any;
  unit?: string;
}) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 14,
        border: "1px solid #e2e8f0",
      }}
    >
      <div style={{ fontSize: 12, color: "#64748b" }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600 }}>
        {value} {unit}
      </div>
    </div>
  );
}
