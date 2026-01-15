// frontend/src/screens/SessionHistory.tsx
import SessionHistoryUI from "../ui/session/SessionHistoryUI";

interface Props {
  onBack: () => void;
  onOpenSession: (sessionId: number) => void;
}

export default function SessionHistory({ onBack, onOpenSession }: Props) {
  return (
    <SessionHistoryUI
      onBack={onBack}
      onOpenSession={onOpenSession}
    />
  );
}
