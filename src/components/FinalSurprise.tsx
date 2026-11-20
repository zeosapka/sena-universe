import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useReward } from "react-rewards";
import { Heart, Sparkles, X } from "lucide-react";
import { UNIVERSE_CONFIG } from "../config/universeConfig";
import { usePerformanceProfile } from "../hooks/usePerformanceProfile";

export function FinalSurprise() {
  const [isOpen, setIsOpen] = useState(false);
  const { particleCountMultiplier, isReducedMotion } = usePerformanceProfile();

  const { reward: triggerReward } = useReward("sena-surprise-reward", "emoji", {
    emoji: ["❤️", "💖", "✨", "🌸"],
    elementCount: Math.round(38 * particleCountMultiplier),
    spread: 110,
    startVelocity: 32,
  });

  useEffect(() => {
    if (!isOpen) return;

    // Altın ve Gül Pembesi Konfeti Yağmuru
    const duration = 5500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: isReducedMotion ? 2 : 5,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.65 },
        colors: ["#E83E70", "#FF91B5", "#F5D58A", "#FFF8FC"],
      });
      confetti({
        particleCount: isReducedMotion ? 2 : 5,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.65 },
        colors: ["#E83E70", "#FF91B5", "#F5D58A", "#FFF8FC"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    const timer = window.setTimeout(frame, 500);
    return () => window.clearTimeout(timer);
  }, [isOpen, isReducedMotion]);

  const handleOpenSurprise = () => {
    triggerReward();
    setIsOpen(true);
  };

  const floatingHeartCount = Math.max(
    18,
    Math.round(42 * particleCountMultiplier)
  );

  return (
    <section className="relative py-20 md:py-28 px-6 max-w-4xl mx-auto text-center">
      <div className="relative flex flex-col items-center justify-center">
        <span
          id="sena-surprise-reward"
          className="pointer-events-none absolute"
        />

        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#F5D58A]/85 mb-6 font-medium">
          {UNIVERSE_CONFIG.surprise.preTitle}
        </p>

        <motion.button
          type="button"
          onClick={handleOpenSurprise}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="group relative inline-flex items-center justify-center gap-4 px-8 sm:px-14 py-6 min-h-[68px] rounded-full font-serif font-bold text-lg sm:text-2xl tracking-[0.12em] uppercase text-[#FFF8FC] bg-gradient-to-r from-[#4A102D] via-[#E83E70] to-[#4A102D] bg-[length:200%_100%] hover:bg-right border-2 border-[#F5D58A]/70 shadow-[0_0_60px_rgba(232,62,112,0.65)] transition-all duration-500 cursor-pointer"
        >
          <Heart className="w-7 h-7 shrink-0 text-[#F5D58A] fill-[#E83E70] group-hover:scale-125 transition-transform" />
          <span>{UNIVERSE_CONFIG.surprise.buttonText}</span>
          <Sparkles className="w-6 h-6 shrink-0 text-[#F5D58A]" />
        </motion.button>
      </div>

      {/* TAM EKRAN SİNEMATİK FİNAL MODALI */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85 }}
            className="fixed inset-0 w-full h-full z-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,#2D091D_0%,#080611_75%)] overflow-hidden select-none"
          >
            {/* Yükselen Küçük Kalpler */}
            {!isReducedMotion && (
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                aria-hidden="true"
              >
                {[...Array(floatingHeartCount)].map((_, idx) => {
                  const left = (idx * 97) % 100;
                  const delay = (idx % 10) * 0.35;
                  const duration = 5.5 + (idx % 6) * 1.1;
                  const size = 14 + (idx % 5) * 6;
                  return (
                    <motion.span
                      key={idx}
                      initial={{
                        opacity: 0,
                        y: "55vh",
                        x: `${left - 50}vw`,
                        scale: 0.4,
                      }}
                      animate={{
                        opacity: [0, 0.85, 0],
                        y: "-55vh",
                        scale: [0.5, 1.15, 0.8],
                      }}
                      transition={{
                        duration,
                        delay,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        fontSize: `${size}px`,
                        color:
                          idx % 3 === 0
                            ? "#F5D58A"
                            : idx % 2 === 0
                            ? "#FF91B5"
                            : "#E83E70",
                      }}
                    >
                      {idx % 4 === 0 ? "✦" : "❤️"}
                    </motion.span>
                  );
                })}
              </div>
            )}

            {/* Kapatma Butonu — Sol üstteki müzik butonuyla asla çakışmaz */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={UNIVERSE_CONFIG.surprise.closeAriaLabel}
              style={{
                marginTop: "env(safe-area-inset-top, 0px)",
                marginRight: "env(safe-area-inset-right, 0px)",
              }}
              className="fixed top-4 right-4 sm:top-5 sm:right-6 md:top-6 md:right-8 z-[65] inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 min-h-[46px] sm:min-h-[48px] rounded-full bg-[#190924]/90 backdrop-blur-xl border border-[#F5D58A]/50 text-xs sm:text-sm uppercase tracking-[0.18em] text-[#FFF8FC] hover:border-[#F5D58A] active:scale-95 transition-all cursor-pointer touch-manipulation"
            >
              <X className="w-4 h-4 shrink-0 text-[#F5D58A]" />
              <span>{UNIVERSE_CONFIG.surprise.closeButtonText}</span>
            </button>

            {/* Merkez Romantik Final Mesajı */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.3 }}
              className="relative z-20 max-w-3xl mx-auto text-center space-y-8 px-4"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#E83E70] to-[#F5D58A] p-0.5 shadow-[0_0_55px_rgba(232,62,112,0.8)]">
                <div className="w-full h-full rounded-full bg-[#12061B] flex items-center justify-center">
                  <Heart className="w-10 h-10 text-[#E83E70] fill-[#E83E70] animate-pulse" />
                </div>
              </div>

              <h2 className="font-serif italic font-semibold text-3xl sm:text-5xl md:text-6xl text-[#FFF8FC] leading-tight drop-shadow-[0_4px_35px_rgba(232,62,112,0.6)]">
                &ldquo;{UNIVERSE_CONFIG.surprise.mainMessage}&rdquo;
              </h2>

              <p className="font-serif font-bold text-2xl sm:text-4xl bg-gradient-to-r from-[#F5D58A] via-[#FF91B5] to-[#E83E70] bg-clip-text text-transparent">
                {UNIVERSE_CONFIG.surprise.subMessage}
              </p>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    confetti({
                      particleCount: Math.round(90 * particleCountMultiplier),
                      spread: 120,
                      origin: { y: 0.6 },
                      colors: ["#E83E70", "#FF91B5", "#F5D58A", "#FFF8FC"],
                    });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 min-h-[48px] rounded-full bg-[#4A102D]/70 border border-[#F5D58A]/50 text-xs sm:text-sm uppercase tracking-[0.2em] text-[#F5D58A] hover:bg-[#E83E70] hover:text-[#FFF8FC] transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>{UNIVERSE_CONFIG.surprise.moreConfettiButton}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
