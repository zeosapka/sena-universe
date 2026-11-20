import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Flame } from "lucide-react";
import { UNIVERSE_CONFIG } from "../config/universeConfig";
import { usePerformanceProfile } from "../hooks/usePerformanceProfile";

interface FireworkRocket {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  isHeartShell: boolean;
}

interface FireworkSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
}

const PALETTE = ["#E83E70", "#FF91B5", "#F5D58A", "#FFF8FC"];

export function FireworksCelebration() {
  const [isActive, setIsActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { particleCountMultiplier } = usePerformanceProfile();

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const rockets: FireworkRocket[] = [];
    const sparks: FireworkSpark[] = [];

    const orientTimers: number[] = [];
    const resizeCanvas = () => {
      const vpW = Math.max(
        300,
        Math.round(canvas.clientWidth || window.innerWidth || 1024)
      );
      const vpH = Math.max(
        300,
        Math.round(canvas.clientHeight || window.innerHeight || 768)
      );
      canvas.width = vpW;
      canvas.height = vpH;
    };
    const handleOrientationResize = () => {
      while (orientTimers.length > 0) {
        const id = orientTimers.pop();
        if (id !== undefined) window.clearTimeout(id);
      }
      for (const delay of [0, 100, 250, 450]) {
        orientTimers.push(window.setTimeout(resizeCanvas, delay));
      }
    };
    resizeCanvas();
    window.addEventListener("resize", handleOrientationResize, { passive: true });
    window.addEventListener("orientationchange", handleOrientationResize, {
      passive: true,
    });
    window.visualViewport?.addEventListener("resize", handleOrientationResize, {
      passive: true,
    });

    const createExplosion = (
      x: number,
      y: number,
      primaryColor: string,
      isHeartShell: boolean
    ) => {
      const baseCount = isHeartShell ? 56 : 68;
      const count = Math.max(24, Math.round(baseCount * particleCountMultiplier));

      for (let i = 0; i < count; i++) {
        const color =
          Math.random() > 0.28
            ? primaryColor
            : PALETTE[Math.floor(Math.random() * PALETTE.length)];

        if (isHeartShell) {
          // Parametrik kalp eğrisi denklemleri
          const t = (Math.PI * 2 * i) / count;
          const hx = 16 * Math.pow(Math.sin(t), 3);
          const hy = -(
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t)
          );
          const speedScale = 0.22 + Math.random() * 0.08;
          sparks.push({
            x,
            y,
            vx: hx * speedScale,
            vy: hy * speedScale,
            alpha: 1,
            decay: 0.011 + Math.random() * 0.008,
            color,
            size: 2.3 + Math.random() * 1.5,
          });
        } else {
          // Küresel havai fişek patlaması
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 5.8;
          sparks.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            decay: 0.012 + Math.random() * 0.01,
            color,
            size: 2 + Math.random() * 2,
          });
        }
      }
    };

    const launchRocket = (customTargetX?: number, customTargetY?: number) => {
      const startX = canvas.width * (0.2 + Math.random() * 0.6);
      const startY = canvas.height;
      const targetX =
        customTargetX ?? canvas.width * (0.15 + Math.random() * 0.7);
      const targetY =
        customTargetY ?? canvas.height * (0.15 + Math.random() * 0.45);

      const frames = 38 + Math.random() * 16;
      const vx = (targetX - startX) / frames;
      const vy = (targetY - startY) / frames;
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const isHeartShell = Math.random() > 0.42;

      rockets.push({
        x: startX,
        y: startY,
        targetX,
        targetY,
        vx,
        vy,
        color,
        isHeartShell,
      });
    };

    // İlk açılış patlamaları
    launchRocket(canvas.width * 0.3, canvas.height * 0.3);
    launchRocket(canvas.width * 0.7, canvas.height * 0.28);
    launchRocket(canvas.width * 0.5, canvas.height * 0.22);

    // Tekrarlamayan rastgele zamanlı fırlatıcı
    let launchTimeoutId: number;
    const scheduleNextLaunch = () => {
      const nextDelay = 450 + Math.random() * 650;
      launchTimeoutId = window.setTimeout(() => {
        launchRocket();
        if (Math.random() > 0.55) {
          launchRocket();
        }
        scheduleNextLaunch();
      }, nextDelay);
    };
    scheduleNextLaunch();

    const renderLoop = () => {
      ctx.fillStyle = "rgba(8, 6, 17, 0.22)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Roketleri güncelle
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;

        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = "#F5D58A";
        ctx.fill();

        const dist = Math.hypot(r.targetX - r.x, r.targetY - r.y);
        if (dist < 12 || r.y <= r.targetY) {
          createExplosion(r.x, r.y, r.color, r.isHeartShell);
          rockets.splice(i, 1);
        }
      }

      // Kıvılcımları güncelle
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.975;
        s.vy *= 0.975;
        s.vy += 0.035; // hafif yerçekimi
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = s.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = window.requestAnimationFrame(renderLoop);
    };

    renderLoop();

    const handleCanvasPointer = (e: PointerEvent) => {
      createExplosion(
        e.clientX,
        e.clientY,
        PALETTE[Math.floor(Math.random() * PALETTE.length)],
        true
      );
    };
    canvas.addEventListener("pointerdown", handleCanvasPointer);

    return () => {
      while (orientTimers.length > 0) {
        const id = orientTimers.pop();
        if (id !== undefined) window.clearTimeout(id);
      }
      window.removeEventListener("resize", handleOrientationResize);
      window.removeEventListener("orientationchange", handleOrientationResize);
      window.visualViewport?.removeEventListener("resize", handleOrientationResize);
      canvas.removeEventListener("pointerdown", handleCanvasPointer);
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(launchTimeoutId);
    };
  }, [isActive, particleCountMultiplier]);

  return (
    <section className="relative py-16 md:py-24 px-6 max-w-5xl mx-auto">
      <div className="relative rounded-[2.25rem] p-8 sm:p-12 md:p-16 bg-gradient-to-br from-[#2B0C20]/80 via-[#12071D]/90 to-[#080611]/95 backdrop-blur-2xl border border-[#E83E70]/35 shadow-[0_0_80px_rgba(232,62,112,0.22)] text-center overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#E83E70]/20 blur-[110px]" />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A102D]/60 border border-[#F5D58A]/35 mb-4">
            <Flame className="w-4 h-4 text-[#F5D58A]" />
            <span className="text-xs tracking-[0.22em] uppercase text-[#F5D58A] font-medium">
              {UNIVERSE_CONFIG.fireworks.badgeText}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#FFF8FC] font-semibold">
            {UNIVERSE_CONFIG.fireworks.sectionTitle}
          </h2>

          <p className="mt-4 font-serif italic text-xl sm:text-2xl text-[#FFF8FC]/85 leading-relaxed">
            {UNIVERSE_CONFIG.fireworks.sectionSubtitle}
          </p>

          <button
            type="button"
            onClick={() => setIsActive(true)}
            className="mt-8 group relative inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-5 min-h-[60px] rounded-full font-sans font-bold text-sm sm:text-base tracking-[0.18em] uppercase text-[#080611] bg-gradient-to-r from-[#F5D58A] via-[#FF91B5] to-[#F5D58A] bg-[length:200%_100%] hover:bg-right shadow-[0_0_45px_rgba(245,213,138,0.65)] active:scale-95 transition-all duration-500 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 shrink-0 text-[#4A102D]" />
            <span>{UNIVERSE_CONFIG.fireworks.buttonText}</span>
          </button>
        </div>
      </div>

      {/* TAM EKRAN HAVAİ FİŞEK GÖSTERİSİ */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080611]/95 overflow-hidden select-none"
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-crosshair"
            />

            {/* Sağ Üst Kapatma Butonu — Sol üstteki müzik butonuyla asla çakışmaz */}
            <button
              type="button"
              onClick={() => setIsActive(false)}
              aria-label={UNIVERSE_CONFIG.fireworks.closeAriaLabel}
              style={{
                marginTop: "env(safe-area-inset-top, 0px)",
                marginRight: "env(safe-area-inset-right, 0px)",
              }}
              className="fixed top-4 right-4 sm:top-5 sm:right-6 md:top-6 md:right-8 z-[65] inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 min-h-[46px] sm:min-h-[48px] rounded-full bg-[#1B0A28]/90 backdrop-blur-xl border border-[#F5D58A]/50 text-xs sm:text-sm uppercase tracking-[0.18em] text-[#FFF8FC] hover:border-[#F5D58A] active:scale-95 transition-all cursor-pointer touch-manipulation"
            >
              <X className="w-4 h-4 shrink-0 text-[#F5D58A]" />
              <span>{UNIVERSE_CONFIG.fireworks.closeButtonText}</span>
            </button>

            {/* Merkez Gökyüzü Mesajı */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="pointer-events-none relative z-20 max-w-4xl px-6 text-center"
            >
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#F5D58A] mb-4 font-semibold">
                {UNIVERSE_CONFIG.fireworks.modalTopHint}
              </p>
              <h2 className="font-serif font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight bg-gradient-to-r from-[#FFF8FC] via-[#F5D58A] to-[#FF91B5] bg-clip-text text-transparent drop-shadow-[0_4px_45px_rgba(232,62,112,0.85)]">
                {UNIVERSE_CONFIG.fireworks.skyMessage}
              </h2>
              <p className="mt-6 text-xs sm:text-sm tracking-[0.18em] uppercase text-[#FFF8FC]/75">
                {UNIVERSE_CONFIG.fireworks.touchSkyHint}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
