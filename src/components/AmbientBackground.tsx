import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface AmbientBackgroundProps {
  darkMode: boolean;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ darkMode }) => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse percentage across window
      const x = Math.round((e.clientX / window.innerWidth) * 100);
      const y = Math.round((e.clientY / window.innerHeight) * 100);
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* Dynamic Ambient Gradient Canvas */}
      <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500" />

      {/* Understated Architectural Glow 1 - Zinc neutral */}
      <div
        className="absolute w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full blur-[140px] opacity-25 dark:opacity-15 bg-zinc-300 dark:bg-zinc-800 animate-float-slow -top-24 -left-20"
      />

      {/* Understated Architectural Glow 2 - Muted Titanium / Steel */}
      <div
        className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full blur-[150px] opacity-20 dark:opacity-10 bg-zinc-200 dark:bg-zinc-900 animate-float-reverse top-1/3 -right-24"
      />

      {/* Understated Architectural Glow 3 - Deep Zinc Base */}
      <div
        className="absolute w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] rounded-full blur-[160px] opacity-15 dark:opacity-08 bg-zinc-400 dark:bg-zinc-900 animate-float-slow -bottom-20 left-1/4"
      />

      {/* Interactive Cursor Follower Aura */}
      <motion.div
        className="absolute w-[280px] h-[280px] rounded-full blur-[90px] opacity-15 dark:opacity-08 bg-zinc-300 dark:bg-zinc-600 pointer-events-none"
        animate={{
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          transform: "translate(-50%, -50%)",
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
      />

      {/* Subtle Micro-Grid Overlay for Depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff07_1px,transparent_1px),linear-gradient(to_bottom,#ffffff07_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80" />
    </div>
  );
};
