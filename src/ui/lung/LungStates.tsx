interface Props {
  isAnalyzing: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function LungStates({
  isAnalyzing,
  onStart,
  onStop,
}: Props) {
  return (
    <div
      style={{
        height: 160,
        borderRadius: 20,
        backgroundColor: isAnalyzing ? "#b00020" : "#007cbfff",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        fontWeight: 600,
        cursor: "pointer",
      }}
      onClick={isAnalyzing ? onStop : onStart}
    >
      {isAnalyzing ? "Stop Analysis" : "Start Analysis"}
    </div>
  );
}
