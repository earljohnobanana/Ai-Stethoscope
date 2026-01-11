import { useEffect, useState } from "react";
import Screen from "../components/Screen";
import { getHistory } from "../services/session.service";

const PATIENT_ID = 1;

export default function SessionHistory({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    getHistory(PATIENT_ID).then(setItems).catch(console.error);
  }, []);

  return (
    <Screen title="Session History">
      <button onClick={onBack} style={{ marginBottom: 12 }}>
        Back
      </button>

      {items.length === 0 && <div>No sessions yet.</div>}

      {items.map((s) => (
        <div
          key={s.id}
          style={{
            padding: 12,
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <div>
            <b>{new Date(s.date).toLocaleString()}</b>
          </div>
          <div>Heart: {s.heart_rate} BPM</div>
          <div>Lungs: {s.breathing_rate} BrPM</div>
          <div>Status: {s.status}</div>
          <div>Duration: {s.duration_seconds}s</div>
        </div>
      ))}
    </Screen>
  );
}
