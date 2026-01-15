import type { Session } from "../../models/Session";
import SessionCard from "./SessionCard";

interface Props {
  sessions: Session[];
  onSelect: (session: Session) => void;
}

export default function SessionList({ sessions, onSelect }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sessions.map((s) => (
        <SessionCard key={s.id} session={s} onClick={() => onSelect(s)} />
      ))}
    </div>
  );
}
