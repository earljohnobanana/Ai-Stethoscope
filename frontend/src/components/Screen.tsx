import { useState, useEffect } from 'react';

interface Props {
  title?: string;
  children: React.ReactNode;
}

export default function Screen({ title, children }: Props) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        background: "#f5f7fa",
        padding: 8,
        boxSizing: "border-box",
      }}
    >
      {/* LCD FRAME */}
      <div
        style={{
          width: "100%",
          maxWidth: windowSize.width <= 600 ? "100%" : 800,
          height: "100%",
          maxHeight: windowSize.width <= 600 ? "100%" : 480,
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
