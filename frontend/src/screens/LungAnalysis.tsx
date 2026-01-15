// frontend/src/screens/LungAnalysis.tsx
import LungAnalysisUI from "../ui/lung/LungAnalysisUI";

type Props = {
  onBack: () => void;
};

export default function LungAnalysis({ onBack }: Props) {
  return <LungAnalysisUI onBack={onBack} />;
}
