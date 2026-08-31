import React, { useEffect, useState } from "react";

interface SplashPoint {
  id: number;
  x: number;
  y: number;
  color: string;
}

export const InteractionSplashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [splashes, setSplashes] = useState<SplashPoint[]>([]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Don't trigger on text selection or non-interactive deep areas if dragging
      const colors = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const newSplash: SplashPoint = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        color: randomColor,
      };

      setSplashes((prev) => [...prev.slice(-6), newSplash]);

      setTimeout(() => {
        setSplashes((prev) => prev.filter((s) => s.id !== newSplash.id));
      }, 700);
    };

    window.addEventListener("click", handleGlobalClick, { passive: true });
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <>
      {children}
      {/* Click Splashes Container */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
        {splashes.map((splash) => (
          <span
            key={splash.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: splash.x,
              top: splash.y,
              width: "18px",
              height: "18px",
              marginLeft: "-9px",
              marginTop: "-9px",
              background: `radial-gradient(circle, ${splash.color} 0%, rgba(255,255,255,0) 70%)`,
              animation: "splash-ripple 0.65s cubic-bezier(0.1, 0.8, 0.3, 1) forwards",
            }}
          />
        ))}
      </div>
    </>
  );
};
