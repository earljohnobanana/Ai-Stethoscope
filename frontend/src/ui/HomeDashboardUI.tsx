import Screen from "../components/Screen";

interface Props {
  onNavigate: (screen: "heart" | "lung" | "history") => void;
}

export default function HomeDashboardUI({ onNavigate }: Props) {
  return (
    <Screen>
      <div
        style={{
          padding: 24,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* HEADER */}
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 12,
            color: "#111827",
          }}
        >
          Smart Stethoscope
        </h1>

        {/* BATTERY (CENTERED) */}
        <div
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#ffffff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 32,
            fontSize: 15,
            fontWeight: 600,
            color: "#374151",
            gap: 8,
          }}
        >
          🔋 <span>87%</span>
        </div>

        {/* DASHBOARD CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          <DashboardCard
            title="Heart Analysis"
            icon="❤️"
            onClick={() => onNavigate("heart")}
          />

          <DashboardCard
            title="Lung Analysis"
            icon="🫁"
            onClick={() => onNavigate("lung")}
          />

          <DashboardCard
            title="Session History"
            icon="🕒"
            onClick={() => onNavigate("history")}
          />
        </div>
      </div>
    </Screen>
  );
}

/* ---------------- CARD COMPONENT ---------------- */

function DashboardCard({
  title,
  icon,
  onClick,
}: {
  title: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#ffffff",
        borderRadius: 24,
        padding: "48px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow =
          "0 10px 20px rgba(0,0,0,0.08)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow =
          "0 4px 12px rgba(0,0,0,0.05)")
      }
    >
      <div style={{ fontSize: 56, marginBottom: 20 }}>{icon}</div>

      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "#111827",
          textAlign: "center",
        }}
      >
        {title}
      </div>
    </div>
  );
}
