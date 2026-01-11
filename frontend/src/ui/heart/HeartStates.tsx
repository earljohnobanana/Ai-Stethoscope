interface Props {
  isAnalyzing: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function HeartStates({
  isAnalyzing,
  onStart,
  onStop,
}: Props) {
  return (
    <div
      style={{
        height: 160,
        borderRadius: 20,
        backgroundColor: isAnalyzing ? "#b00020" : "#007cbfff", // 👈 Background COLOR HERE
        color: "#ffffff", // 👈 Font COLOR HERE
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
