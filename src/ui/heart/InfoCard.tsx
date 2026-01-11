export default function InfoCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        background: "#fff",
      }}
    >
      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6 }}>
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}
