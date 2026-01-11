import SessionCard from "./SessionCard";
import type { Session } from "../../models/Session";

interface Props {
  sessions: Session[];
  onSelect: (session: Session) => void;
}

export default function SessionList({ sessions, onSelect }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        width: "100%",
      }}
    >
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          onClick={() => onSelect(session)}
        />
      ))}
    </div>
  );
}
