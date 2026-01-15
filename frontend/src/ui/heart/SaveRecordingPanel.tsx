// frontend/src/ui/heart/SaveRecordingPanel.tsx
export default function SaveRecordingPanel({
  name,
  setName,
  onConfirm,
  onCancel,
}: {
  name: string;
  setName: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    /* OVERLAY */
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={onCancel} // click outside closes
    >
      {/* MODAL */}
      <div
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
        style={{
          width: 420,
          background: "#ffffff",
          borderRadius: 16,
          padding: 22,
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>
          Save Recording
        </div>

        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
          Enter a name so you can find this recording later.
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Jan 14 - Heart - Athlete 1"
          autoFocus
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            outline: "none",
            fontSize: 14,
            boxSizing: "border-box",
          }}
        />

        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          <button
            onClick={onConfirm}
            disabled={!name.trim()}
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 12,
              border: "none",
              background: !name.trim() ? "#94a3b8" : "#2563eb",
              color: "white",
              fontWeight: 800,
              cursor: !name.trim() ? "not-allowed" : "pointer",
            }}
          >
            Confirm Save
          </button>

          <button
            onClick={onCancel}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "white",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
