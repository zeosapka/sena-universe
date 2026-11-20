import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, ChevronDown } from "lucide-react";
import { UNIVERSE_CONFIG } from "../config/universeConfig";
import { usePerformanceProfile } from "../hooks/usePerformanceProfile";
import { useViewportMetrics } from "../hooks/useViewportMetrics";

export function HeroCelebration() {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const { isReducedMotion } = usePerformanceProfile();
  const viewport = useViewportMetrics();

  // iPad dikey <-> yatay döndürüldüğünde parallax kaymasını sıfırla (içeriğin kayık kalmasını önler)
  useEffect(() => {
    setParallax({ x: 0, y: 0 });
  }, [viewport.width, viewport.height, viewport.orientationVersion]);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (isReducedMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setParallax({
      x: relX * 24,
      y: relY * 24,
    });
  };

  const scrollToCountdown = () => {
    const el = document.getElementById("countdown-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      onPointerMove={handlePointerMove}
      className="relative w-full max-w-full min-h-[88dvh] flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16 sm:pt-28 md:py-24 overflow-hidden"
    >
      {/* Parallax Halkaları */}
      <motion.div
        animate={{ x: -parallax.x * 1.2, y: -parallax.y * 1.2 }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="w-[18rem] h-[18rem] sm:w-[28rem] sm:h-[28rem] lg:w-[36rem] lg:h-[36rem] rounded-full border border-[#F5D58A]/15 shadow-[0_0_90px_rgba(232,62,112,0.18)]" />
        <div className="absolute w-[14rem] h-[14rem] sm:w-[21rem] sm:h-[21rem] lg:w-[27rem] lg:h-[27rem] rounded-full border border-dashed border-[#FF91B5]/20" />
      </motion.div>

      <motion.div
        animate={{ x: parallax.x, y: parallax.y }}
        transition={{ type: "spring", stiffness: 75, damping: 18 }}
        className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center px-2"
      >
        {/* Üst Başlık Rozeti */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-[#160A24]/80 backdrop-blur-xl border border-[#F5D58A]/35 shadow-[0_0_25px_rgba(245,213,138,0.15)] mb-6 md:mb-8 max-w-full"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[#F5D58A]" />
          <span className="text-[10px] sm:text-xs md:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[#F5D58A] truncate">
            {UNIVERSE_CONFIG.siteTitle}
          </span>
          <Heart className="w-3.5 h-3.5 shrink-0 text-[#E83E70] fill-[#E83E70]" />
        </motion.div>

        {/* Ana Kutlama Başlığı */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="w-full font-serif font-semibold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.12] text-[#FFF8FC] drop-shadow-[0_4px_35px_rgba(232,62,112,0.45)] break-words"
        >
          {UNIVERSE_CONFIG.hero.headlinePrefix}{" "}
          <span className="block mt-1 sm:mt-2 italic bg-gradient-to-r from-[#FF91B5] via-[#F5D58A] to-[#E83E70] bg-clip-text text-transparent">
            {UNIVERSE_CONFIG.hero.headlineHighlight}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mt-6 md:mt-8 w-full max-w-2xl font-serif italic text-xl sm:text-2xl md:text-3xl text-[#FFF8FC]/85 leading-relaxed break-words px-2"
        >
          &ldquo;{UNIVERSE_CONFIG.hero.subheadline}&rdquo;
        </motion.p>

        {/* İnteraktif Dokunma İpucu */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-8 md:mt-10 inline-flex items-center justify-center gap-2.5 px-4 py-2 rounded-full bg-[#4A102D]/30 border border-[#FF91B5]/25 text-xs sm:text-sm text-[#FF91B5]/90 max-w-full"
        >
          <span className="w-2 h-2 shrink-0 rounded-full bg-[#E83E70] animate-ping" />
          <span className="truncate">{UNIVERSE_CONFIG.hero.touchHint}</span>
        </motion.div>

        {/* Aşağı Kaydırma Butonu */}
        <motion.button
          type="button"
          onClick={scrollToCountdown}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 md:mt-12 group flex flex-col items-center gap-2 text-[#F5D58A]/85 hover:text-[#F5D58A] min-h-[48px] px-4 py-2 transition-colors cursor-pointer"
        >
          <span className="text-xs tracking-[0.25em] uppercase font-medium">
            {UNIVERSE_CONFIG.hero.scrollButtonText}
          </span>
          <ChevronDown className="w-5 h-5 animate-bounce text-[#FF91B5]" />
        </motion.button>
      </motion.div>
    </section>
  );
}
