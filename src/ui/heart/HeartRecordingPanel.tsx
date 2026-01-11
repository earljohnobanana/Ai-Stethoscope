interface Props {
  state: "idle" | "recording" | "analyzing";
  onStop: () => void;
}

export default function HeartRecordingPanel({ state, onStop }: Props) {
  return (
    <div
      onClick={state === "recording" ? onStop : undefined}
      style={{
        height: 160,                 // ✅ FIXED HEIGHT
        borderRadius: 20,
        background: "#b00020",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        fontWeight: 600,
        cursor: state === "recording" ? "pointer" : "default",
        userSelect: "none",
      }}
    >
      {state === "recording"
        ? "Stop Analysis"
        : state === "analyzing"
        ? "Analyzing..."
        : "Ready"}
    </div>
  );
}
