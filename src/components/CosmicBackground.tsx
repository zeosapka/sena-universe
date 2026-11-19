import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";
import { usePerformanceProfile } from "../hooks/usePerformanceProfile";

export function CosmicBackground() {
  const [engineReady, setEngineReady] = useState(false);
  const { particleCountMultiplier, isReducedMotion } = usePerformanceProfile();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setEngineReady(true);
    });
  }, []);

  const starCount = Math.max(25, Math.round(85 * particleCountMultiplier));

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
        value: { min: 0.15, max: 0.85 },
        animation: {
          enable: !isReducedMotion,
          speed: 0.8,
          sync: false,
        },
      },
      size: {
        value: { min: 1, max: 3.5 },
        animation: {
          enable: !isReducedMotion,
          speed: 1.5,
          sync: false,
        },
      },
      move: {
        enable: !isReducedMotion,
        speed: { min: 0.15, max: 0.6 },
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
          distance: 140,
          size: 5,
          duration: 2,
          opacity: 0.9,
        },
      },
    },
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Deep Cosmic Nebulae Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#4A102D_0%,#080611_65%,#05030A_100%)] opacity-90" />
      <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-[#E83E70]/12 blur-[130px] animate-pulse-slow" />
      <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] rounded-full bg-[#F5D58A]/10 blur-[140px]" />
      <div className="absolute -bottom-48 left-1/4 w-[40rem] h-[40rem] rounded-full bg-[#4A102D]/35 blur-[150px]" />

      {/* tsParticles Starfield */}
      {engineReady && (
        <Particles
          id="sena-cosmic-stars"
          className="absolute inset-0 w-full h-full"
          options={options}
        />
      )}

      {/* Subtle Rising Ambient Hearts (GPU-accelerated CSS) */}
      {!isReducedMotion && (
        <div className="absolute inset-0 overflow-hidden">
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
