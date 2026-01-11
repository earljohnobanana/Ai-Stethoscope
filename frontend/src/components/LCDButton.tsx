import type{ ReactNode } from "react";

interface Props {
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
}

export default function LCDButton({
  onClick,
  children,
  disabled = false,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "block",
        width: "100%",
        margin: "12px 0",
        padding: "12px",
        fontSize: "16px",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}
