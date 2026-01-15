// frontend/src/screens/SessionDetail.tsx
import SessionDetailUI from "../ui/session/SessionDetailUI";

interface Props {
  sessionId: number | null;
  onBack: () => void;
}

export default function SessionDetail({ sessionId, onBack }: Props) {
  return (
    <SessionDetailUI
      sessionId={sessionId}
      onBack={onBack}
    />
  );
}
