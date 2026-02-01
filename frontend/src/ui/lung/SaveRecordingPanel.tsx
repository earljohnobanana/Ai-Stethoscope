// frontend/src/ui/lung/SaveRecordingPanel.tsx
import { useState, useCallback, useMemo } from "react";

// Define a TypeScript interface for the component props (same as heart to ensure consistency)
interface SaveRecordingPanelProps {
  name: string;
  setName: (value: string) => void;
  onConfirm: (payload: { 
    name: string; 
    age?: number; 
    sex?: string; 
    sport?: string 
  }) => void;
  onCancel: () => void;
}

// Define a type for the form state
interface FormState {
  age: string;
  sex: string;
  sport: string;
}

// Component constants for styling and validation
const PANEL_WIDTH = 460;
const PADDING = 22;
const BORDER_RADIUS = 16;
const MAX_AGE = 120;
const MIN_AGE = 0;

export default function SaveRecordingPanel({
  name,
  setName,
  onConfirm,
  onCancel,
}: SaveRecordingPanelProps) {
  // Form state management
  const [formState, setFormState] = useState<FormState>({
    age: "",
    sex: "",
    sport: "",
  });

  // Memoized validation logic to avoid re-calculation on every render
  const validationResult = useMemo(() => {
    const trimmedName = name.trim();
    const isNameValid = trimmedName.length > 0;
    
    const parsedAge = parseInt(formState.age, 10);
    const isAgeValid = formState.age === "" || 
      (!isNaN(parsedAge) && parsedAge >= MIN_AGE && parsedAge <= MAX_AGE);

    return {
      isNameValid,
      isAgeValid,
      canSave: isNameValid && isAgeValid,
    };
  }, [name, formState.age]);

  // Handle form input changes with type safety
  const handleInputChange = useCallback((field: keyof FormState, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Handle confirm button click
  const handleConfirm = useCallback(() => {
    if (!validationResult.canSave) return;

    // Prepare payload
    const payload = {
      name: name.trim(),
      age: formState.age === "" ? undefined : parseInt(formState.age, 10),
      sex: formState.sex || undefined,
      sport: formState.sport.trim() || undefined,
    };

    // Call onConfirm with payload
    onConfirm(payload);
  }, [name, formState, validationResult.canSave, onConfirm]);

  // Handle cancel button click
  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  // Handle background click to close the modal
  const handleBackgroundClick = useCallback(() => {
    onCancel();
  }, [onCancel]);

  // Handle modal content click to prevent propagation to background
  const handleModalClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  // Input style object for reusability and maintainability
  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box" as const,
  };

  // Button style objects for reusability
  const confirmButtonStyle = {
    ...inputStyle,
    flex: 1,
    border: "none",
    background: validationResult.canSave ? "#2563eb" : "#94a3b8",
    color: "white",
    fontWeight: 800,
    cursor: validationResult.canSave ? "pointer" : "not-allowed",
  };

  const cancelButtonStyle = {
    ...inputStyle,
    border: "1px solid #e5e7eb",
    background: "white",
    fontWeight: 800,
    cursor: "pointer",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={handleBackgroundClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="saveRecordingTitle"
    >
      <div
        onClick={handleModalClick}
        style={{
          width: PANEL_WIDTH,
          background: "#ffffff",
          borderRadius: BORDER_RADIUS,
          padding: PADDING,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div
          id="saveRecordingTitle"
          style={{ 
            fontSize: 18, 
            fontWeight: 800, 
            marginBottom: 10 
          }}
        >
          Save Result
        </div>

        <div style={{ 
          fontSize: 13, 
          color: "#64748b", 
          marginBottom: 12 
        }}>
          Name this recording. Athlete details are optional and can be saved with it.
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {/* Recording name input */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jan 14 - Lung - Athlete 1"
            autoFocus
            style={inputStyle}
            aria-label="Recording name"
            required
          />

          {/* Optional fields */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: 10 
          }}>
            {/* Age input with validation feedback */}
            <input
              value={formState.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              placeholder="Age (optional)"
              style={{
                ...inputStyle,
                borderColor: validationResult.isAgeValid ? "#e5e7eb" : "#ef4444",
              }}
              aria-label="Age"
              type="number"
              min={MIN_AGE}
              max={MAX_AGE}
            />

            {/* Sex select */}
            <select
              value={formState.sex}
              onChange={(e) => handleInputChange("sex", e.target.value)}
              style={{
                ...inputStyle,
                background: "white",
              }}
              aria-label="Sex"
            >
              <option value="">Sex (optional)</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Sport input */}
          <input
            value={formState.sport}
            onChange={(e) => handleInputChange("sport", e.target.value)}
            placeholder="Sport (optional)"
            style={inputStyle}
            aria-label="Sport"
          />
        </div>

        {/* Validation error message for age */}
        {!validationResult.isAgeValid && (
          <div style={{
            color: "#ef4444",
            fontSize: 12,
            marginTop: 8,
          }}>
            Please enter a valid age between {MIN_AGE} and {MAX_AGE}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ 
          display: "flex", 
          gap: 12, 
          marginTop: 14 
        }}>
          <button
            onClick={handleConfirm}
            disabled={!validationResult.canSave}
            style={confirmButtonStyle}
          >
            Confirm Save
          </button>

          <button
            onClick={handleCancel}
            style={cancelButtonStyle}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
