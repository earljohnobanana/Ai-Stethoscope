interface Props {
  isAnalyzing: boolean;
  onStart: () => void;
  onStop: () => void;
  elapsedTime?: number;
  formattedTime?: string;
}

export default function LungStates({
  isAnalyzing,
  onStart,
  onStop,
  formattedTime,
}: Props) {
  return (
    <button
      style={{
        height: 160,
        width: "100%",
        borderRadius: 20,
        backgroundColor: isAnalyzing ? "#b00020" : "#007cbfff",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        fontWeight: 600,
        cursor: "pointer",
        border: "none",
        outline: "none",
      }}
      onClick={isAnalyzing ? onStop : onStart}
    >
      {isAnalyzing ? "Stop Analysis" : "Start Analysis"}
      {isAnalyzing && formattedTime && (
        <div style={{ fontSize: 20, marginTop: 8, opacity: 0.9 }}>
          {formattedTime}
        </div>
      )}
    </button>
  );
}
