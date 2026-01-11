interface Props {
  title: string;
  subtitle: string;
  onBack: () => void;
}

export default function HeartHeader({ title, subtitle, onBack }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 12px",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          border: "none",
          background: "#f1f5f9",
          borderRadius: 10,
          padding: "6px 10px",
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      {/* Icon */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: "#ffffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        ❤️
      </div>

      {/* Title + Subtitle */}
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1f2937" }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: "#64748b" }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}
