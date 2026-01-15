// frontend/src/screens/HeartAnalysis.tsx
import HeartAnalysisUI from "../ui/heart/HeartAnalysisUI";

type Props = {
  onBack: () => void;
};

export default function HeartAnalysis({ onBack }: Props) {
  return <HeartAnalysisUI onBack={onBack} />;
}
