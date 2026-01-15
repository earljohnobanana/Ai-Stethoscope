import { useState } from "react";

import HomeDashboard from "../screens/HomeDashboard";
import HeartAnalysis from "../screens/HeartAnalysis";
import LungAnalysis from "../screens/LungAnalysis";
import SessionHistory from "../screens/SessionHistory";
import SessionDetail from "../screens/SessionDetail";

type Screen = "home" | "heart" | "lung" | "history" | "detail";

export default function RootNavigator() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

  if (screen === "home") {
    return (
      <HomeDashboard
        onNavigate={(next) => {
          if (next === "heart") setScreen("heart");
          else if (next === "lung") setScreen("lung");
          else if (next === "history") {
            setSelectedSessionId(null);
            setScreen("history");
          }
        }}
      />
    );
  }

  if (screen === "heart") {
    return <HeartAnalysis onBack={() => setScreen("home")} />;
  }

  if (screen === "lung") {
    return <LungAnalysis onBack={() => setScreen("home")} />;
  }

  if (screen === "history") {
    return (
      <SessionHistory
        onBack={() => setScreen("home")}
        onOpenSession={(sessionId: number) => {
          setSelectedSessionId(sessionId);
          setScreen("detail");
        }}
      />
    );
  }

  // detail
  return (
    <SessionDetail
      sessionId={selectedSessionId}
      onBack={() => setScreen("history")}
    />
  );
}
