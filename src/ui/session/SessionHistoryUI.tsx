import { useEffect, useMemo, useState } from "react";
import type { SessionDTO, PatientDTO } from "../../models/api.types";
import { listPatients } from "../../services/patient.service";
import { listSessions } from "../../services/session.service";

type Props = {
  onBack: () => void;
  onOpenSession: (id: number) => void; // navigate to SessionDetail
};

function formatWhen(recordedAt: string) {
  // recordedAt format: "YYYY-MM-DD HH:mm:ss"
  const iso = recordedAt.includes("T")
    ? recordedAt
    : recordedAt.replace(" ", "T");
  const d = new Date(iso);
  const date = d.toLocaleDateString();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return { date, time };
}

export default function SessionHistoryUI({ onBack, onOpenSession }: Props) {
  const [patientName, setPatientName] = useState("");
  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientDTO | null>(
    null
  );

  const [sessions, setSessions] = useState<SessionDTO[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // load patients once (so we can find by name)
  useEffect(() => {
    setLoadingPatients(true);
    listPatients()
      .then(setPatients)
      .catch((e: any) => setError(e?.message || "Failed to load patients."))
      .finally(() => setLoadingPatients(false));
  }, []);

  const matchedPatient: PatientDTO | undefined = useMemo(() => {
    const name = patientName.trim().toLowerCase();
    if (!name) return undefined;
    return patients.find((p) => p.name.toLowerCase() === name);
  }, [patientName, patients]);

  async function handleLoadHistory() {
    setError(null);

    const name = patientName.trim();
    if (!name) {
      setError("Please enter a patient name.");
      return;
    }

    if (!matchedPatient) {
      setError(
        `No patient found named "${name}". Save a recording first or create the patient.`
      );
      return;
    }

    setSelectedPatient(matchedPatient);
    setLoadingSessions(true);

    try {
      const data = await listSessions(matchedPatient.id);
      setSessions(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load session history.");
    } finally {
      setLoadingSessions(false);
    }
  }

  return (
    <div style={{ padding: 20, color: "#111827" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <button
          onClick={onBack}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#ffffff",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <div style={{ fontSize: 20, fontWeight: 700 }}>Session History</div>
      </div>

      {/* Patient search */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
          Patient Name
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder={
              loadingPatients
                ? "Loading patients..."
                : "Type exact patient name (e.g., Jeff)"
            }
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #d1d5db",
              fontSize: 14,
              outline: "none",
            }}
          />

          <button
            onClick={handleLoadHistory}
            disabled={loadingPatients || loadingSessions}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "none",
              background: "#0f766e",
              color: "#ffffff",
              cursor:
                loadingPatients || loadingSessions ? "not-allowed" : "pointer",
              opacity: loadingPatients || loadingSessions ? 0.6 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {loadingSessions ? "Loading..." : "Load"}
          </button>
        </div>

        {/* Helper */}
        <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
          Tip: If you have duplicate names (like two “Jeff”), we’ll add a
          patient picker next.
        </div>

        {selectedPatient && (
          <div style={{ marginTop: 10, fontSize: 13, color: "#111827" }}>
            Viewing: <b>{selectedPatient.name}</b> (ID: {selectedPatient.id})
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: 12,
              padding: 10,
              borderRadius: 12,
              background: "#fef2f2",
              color: "#991b1b",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Sessions list */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 16,
          boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
          Records
        </div>

        {sessions.length === 0 ? (
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            No sessions found. Save a Heart/Lung recording first.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sessions.map((s) => {
              const when = formatWhen(s.recorded_at);
              const badgeBg = s.type === "heart" ? "#ecfdf5" : "#eff6ff";
              const badgeText = s.type === "heart" ? "#065f46" : "#1e40af";

              return (
                <button
                  key={s.id}
                  onClick={() => onOpenSession(s.id)}
                  style={{
                    textAlign: "left",
                    border: "1px solid #e5e7eb",
                    background: "#ffffff",
                    borderRadius: 14,
                    padding: 14,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{ display: "flex", gap: 10, alignItems: "center" }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          padding: "4px 10px",
                          borderRadius: 999,
                          background: badgeBg,
                          color: badgeText,
                          fontWeight: 700,
                          textTransform: "uppercase",
                        }}
                      >
                        {s.type}
                      </span>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>
                        {s.status}
                      </div>
                    </div>

                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      {when.date} • {when.time}
                    </div>
                  </div>

                  <div style={{ marginTop: 6, fontSize: 13, color: "#374151" }}>
                    Confidence: <b>{s.confidence}%</b>
                    {typeof s.duration_seconds === "number" ? (
                      <>
                        {" "}
                        • Duration: <b>{s.duration_seconds}s</b>
                      </>
                    ) : null}
                  </div>

                  {s.summary ? (
                    <div
                      style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}
                    >
                      {s.summary}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
