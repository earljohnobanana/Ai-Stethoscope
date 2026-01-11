// src/navigation/RootNavigator.tsx
import { useState } from "react";

import HomeDashboard from "../screens/HomeDashboard";
import HeartAnalysis from "../screens/HeartAnalysis";
import LungAnalysis from "../screens/LungAnalysis";
import SessionHistory from "../screens/SessionHistory";

type ScreenKey = "home" | "heart" | "lung" | "history";

export default function RootNavigator() {
  const [screen, setScreen] = useState<ScreenKey>("home");

  if (screen === "heart") {
    return <HeartAnalysis onBack={() => setScreen("home")} />;
  }

  if (screen === "lung") {
    return <LungAnalysis onBack={() => setScreen("home")} />;
  }

  if (screen === "history") {
    // If your SessionHistory uses a different prop name, change it here.
    return <SessionHistory onBack={() => setScreen("home")} />;
  }

  return <HomeDashboard onNavigate={(s) => setScreen(s)} />;
}
