interface Props {
  state: "idle" | "recording" | "analyzing";
  onStop: () => void;
}

export default function LungRecordingPanel({ state, onStop }: Props) {
  return (
    <div
      onClick={state === "recording" ? onStop : undefined}
      style={{
        height: 140,
        borderRadius: 20,
        background: "#2563eb",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        fontWeight: 600,
        cursor: state === "recording" ? "pointer" : "default",
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
