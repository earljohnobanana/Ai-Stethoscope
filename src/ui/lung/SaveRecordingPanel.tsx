import { createSession } from "../../services/session.service";

const PATIENT_ID = 1;

export default function SaveRecordingPanel({
  name,
  setName,
  onConfirm,
  onCancel,
}: {
  name: string;
  setName: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  async function handleSave() {
    try {
      await createSession(PATIENT_ID, name);
      onConfirm();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter recording name"
      />

      <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
        <button onClick={handleSave} disabled={!name}>
          Confirm Save
        </button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
