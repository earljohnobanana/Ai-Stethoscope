interface Props {
  title: string;
  subtitle?: string;
  onBack: () => void;
}

export default function SessionHeader({ title, subtitle, onBack }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 24,
      }}
    >
      <button
        onClick={onBack}
        style={{
          borderRadius: 12,
          padding: "8px 12px",
          border: "1px solid #e0e0e0",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        ←
      </button>

      <div>
        <div style={{ fontSize: 20, fontWeight: 600 }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: 14, color: "#666" }}>{subtitle}</div>
        )}
      </div>
    </div>
  );
}
