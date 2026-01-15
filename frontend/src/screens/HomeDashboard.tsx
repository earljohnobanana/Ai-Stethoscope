import HomeDashboardUI from "../ui/HomeDashboardUI";

type HomeScreen = "heart" | "lung" | "history";

interface Props {
  onNavigate: (screen: HomeScreen) => void;
}

export default function HomeDashboard({ onNavigate }: Props) {
  return <HomeDashboardUI onNavigate={onNavigate} />;
}
