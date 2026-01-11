interface Props {
  title?: string;
  children: React.ReactNode;
}

export default function Screen({ title, children }: Props) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        background: "#f5f7fa",
      }}
    >
      {/* LCD FRAME */}
      <div
        style={{
          width: 800,
          height: 480,
          background: "#ffffff",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 0 20px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* CONTENT */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 16,
          }}
        >
          {title && (
            <h1 style={{ marginBottom: 12, fontSize: 20 }}>{title}</h1>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
