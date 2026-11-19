import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePerformanceProfile } from "../hooks/usePerformanceProfile";

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
  symbol: string;
  rotation: number;
}

const COLORS = ["#E83E70", "#FF91B5", "#F5D58A", "#FFF8FC"];
const SYMBOLS = ["❤️", "✦", "♥", "✨"];

export function TouchHeartBursts() {
  const [bursts, setBursts] = useState<HeartParticle[]>([]);
  const { isReducedMotion, particleCountMultiplier } = usePerformanceProfile();

  useEffect(() => {
    if (isReducedMotion) return;

    let nextId = 1;

    const handlePointerDown = (e: PointerEvent) => {
      const targetEl = e.target as HTMLElement | null;
      if (
        targetEl &&
        targetEl.closest("button, [role='button'], a, input, textarea")
      ) {
        return;
      }

      // Avoid overwhelming if user clicks rapid-fire
      const count = Math.max(4, Math.round(7 * particleCountMultiplier));
      const newParticles: HeartParticle[] = [];

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const distance = 35 + Math.random() * 65;
        newParticles.push({
          id: nextId++,
          x: e.clientX,
          y: e.clientY,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance - 25,
          size: 13 + Math.random() * 12,
          color: COLORS[i % COLORS.length],
          symbol: SYMBOLS[i % SYMBOLS.length],
          rotation: (Math.random() - 0.5) * 70,
        });
      }

      setBursts((prev) => [...prev.slice(-28), ...newParticles]);

      setTimeout(() => {
        const idsToRemove = new Set(newParticles.map((p) => p.id));
        setBursts((prev) => prev.filter((p) => !idsToRemove.has(p.id)));
      }, 950);
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [isReducedMotion, particleCountMultiplier]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    >
      <AnimatePresence>
        {bursts.map((p) => (
          <motion.span
            key={p.id}
            initial={{
              opacity: 1,
              scale: 0.3,
              x: p.x,
              y: p.y,
              rotate: 0,
            }}
            animate={{
              opacity: 0,
              scale: 1.15,
              x: p.x + p.dx,
              y: p.y + p.dy,
              rotate: p.rotation,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              fontSize: `${p.size}px`,
              color: p.color,
              textShadow: `0 0 10px ${p.color}`,
              willChange: "transform, opacity",
            }}
            className="select-none pointer-events-none"
          >
            {p.symbol}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
