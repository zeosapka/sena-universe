import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";
import { usePerformanceProfile } from "../hooks/usePerformanceProfile";
import { useViewportMetrics } from "../hooks/useViewportMetrics";

let engineInitPromise: Promise<void> | null = null;

export function CosmicBackground() {
  const [engineReady, setEngineReady] = useState(false);
  const { particleCountMultiplier, isReducedMotion } = usePerformanceProfile();
  const viewport = useViewportMetrics();

  useEffect(() => {
    let mounted = true;
    if (!engineInitPromise) {
      engineInitPromise = initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      });
    }
    engineInitPromise
      .then(() => {
        if (mounted) setEngineReady(true);
      })
      .catch(() => {
        // Fallback CSS stars remain visible if tsParticles fails
      });

    return () => {
      mounted = false;
    };
  }, []);

  const starCount = Math.max(25, Math.round(75 * particleCountMultiplier));

  const options: ISourceOptions = {
    fullScreen: { enable: false },
    fpsLimit: 60,
    detectRetina: true,
    particles: {
      number: {
        value: starCount,
        density: {
          enable: true,
          width: 1200,
          height: 800,
        },
      },
      color: {
        value: ["#FFF8FC", "#F5D58A", "#FF91B5", "#E83E70"],
      },
      shape: {
        type: ["circle", "star"],
      },
      opacity: {
        value: { min: 0.2, max: 0.85 },
        animation: {
          enable: !isReducedMotion,
          speed: 0.8,
          sync: false,
        },
      },
      size: {
        value: { min: 1, max: 3.2 },
        animation: {
          enable: !isReducedMotion,
          speed: 1.4,
          sync: false,
        },
      },
      move: {
        enable: !isReducedMotion,
        speed: { min: 0.15, max: 0.55 },
        direction: "top",
        random: true,
        straight: false,
        outModes: {
          default: "out",
        },
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: !isReducedMotion,
          mode: "bubble",
        },
      },
      modes: {
        bubble: {
          distance: 130,
          size: 4.5,
          duration: 2,
          opacity: 0.9,
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "var(--app-width, 100%)",
        height: "var(--app-height, 100dvh)",
      }}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* iPad Safari GPU Tile Memory Dostu Çok Katmanlı Romantik Nebula Gradienti */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: [
            "radial-gradient(circle at 18% 18%, rgba(232, 62, 112, 0.18) 0%, transparent 48%)",
            "radial-gradient(circle at 82% 32%, rgba(245, 213, 138, 0.14) 0%, transparent 48%)",
            "radial-gradient(circle at 50% 78%, rgba(74, 16, 45, 0.45) 0%, transparent 58%)",
            "radial-gradient(ellipse at 50% 35%, #4A102D 0%, #160618 62%, #080611 100%)",
          ].join(", "),
        }}
      />

      {/* tsParticles Starfield (orientationVersion değiştiğinde yeni ekran oranına göre yeniden yerleşir) */}
      {engineReady && (
        <Particles
          key={`stars-${viewport.orientationVersion}`}
          id="sena-cosmic-stars"
          className="absolute inset-0 w-full h-full"
          options={options}
        />
      )}

      {/* Subtle Rising Ambient Hearts (GPU-accelerated CSS) */}
      {!isReducedMotion && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {[...Array(8)].map((_, idx) => (
            <span
              key={idx}
              className="ambient-rising-heart select-none"
              style={{
                left: `${10 + idx * 11.5}%`,
                animationDelay: `${idx * 2.1}s`,
                animationDuration: `${14 + (idx % 4) * 3}s`,
                fontSize: `${12 + (idx % 3) * 5}px`,
                opacity: 0.22,
              }}
            >
              {idx % 3 === 0 ? "✦" : "♥"}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
