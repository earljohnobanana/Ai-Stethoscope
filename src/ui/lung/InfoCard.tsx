import type { ReactNode } from "react";

export default function InfoCard({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 16,
        border: "1px solid #e2e8f0",
        background: "#fff",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: "#64748b",
          marginBottom: 6,
          letterSpacing: 0.2,
        }}
      >
        {label}
      </div>

      <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>
        {children}
      </div>
    </div>
  );
}
