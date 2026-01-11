import type { Session } from "../models/Session";
import SessionDetailUI from "../ui/session/SessionDetailUI";

interface Props {
  session: Session;
  onBack: () => void;
}

export default function SessionDetail({ session, onBack }: Props) {
  return <SessionDetailUI session={session} onBack={onBack} />;
}
