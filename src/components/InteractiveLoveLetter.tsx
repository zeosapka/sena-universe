import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MailOpen, Sparkles, RotateCcw, FastForward, Heart } from "lucide-react";
import { UNIVERSE_CONFIG } from "../config/universeConfig";
import { usePerformanceProfile } from "../hooks/usePerformanceProfile";

export function InteractiveLoveLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const { isReducedMotion } = usePerformanceProfile();
  const totalLines = UNIVERSE_CONFIG.loveLetter.paragraphs.length + 2; // + hitap & imza

  useEffect(() => {
    if (!isOpen) {
      setVisibleLines(0);
      return;
    }

    if (isReducedMotion) {
      setVisibleLines(totalLines);
      return;
    }

    setVisibleLines(1);
    const interval = window.setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= totalLines) {
          window.clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 950);

    return () => window.clearInterval(interval);
  }, [isOpen, isReducedMotion, totalLines]);

  const handleOpenEnvelope = () => {
    setIsOpen(true);
  };

  const handleRevealAll = () => {
    setVisibleLines(totalLines);
  };

  return (
    <section className="relative py-16 md:py-24 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A102D]/45 border border-[#F5D58A]/30 mb-3">
          <MailOpen className="w-3.5 h-3.5 text-[#F5D58A]" />
          <span className="text-xs tracking-[0.22em] uppercase text-[#F5D58A] font-medium">
            {UNIVERSE_CONFIG.loveLetter.badgeText}
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl text-[#FFF8FC] font-semibold">
          {UNIVERSE_CONFIG.loveLetter.envelopePrompt}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* KAPALI ALTIN MÜHÜRLÜ ZARF */
          <motion.div
            key="closed-envelope"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -25 }}
            transition={{ duration: 0.6 }}
            onClick={handleOpenEnvelope}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleOpenEnvelope();
            }}
            aria-label={UNIVERSE_CONFIG.loveLetter.openEnvelopeAriaLabel}
            className="group relative mx-auto max-w-2xl cursor-pointer select-none rounded-[2rem] p-8 sm:p-12 md:p-16 bg-gradient-to-br from-[#2B0B21] via-[#17091C] to-[#0E0514] border-2 border-[#F5D58A]/45 shadow-[0_20px_70px_rgba(232,62,112,0.28)] hover:border-[#F5D58A] transition-all duration-500 overflow-hidden"
          >
            {/* Zarf Kapağı Üçgen Kesim */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#4A102D]/60 to-transparent border-b border-[#F5D58A]/25"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />

            {/* Işıltı Katmanı */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,213,138,0.16),transparent_65%)]" />

            <div className="relative z-10 flex flex-col items-center justify-center py-6 sm:py-10 text-center">
              {/* Altın Balmumu Mühür */}
              <motion.div
                whileHover={{ scale: 1.08, rotate: 4 }}
                whileTap={{ scale: 0.94 }}
                className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#F5D58A] via-[#D9A74A] to-[#9E6B18] p-1.5 shadow-[0_0_45px_rgba(245,213,138,0.65)] border-2 border-[#FFF8FC]/50"
              >
                <div className="flex flex-col items-center justify-center w-full h-full rounded-full border-2 border-dashed border-[#4A102D]/60 bg-gradient-to-inner from-[#F5D58A] to-[#C89333]">
                  <span className="font-serif font-bold text-xl sm:text-2xl text-[#4A102D] tracking-wider">
                    {UNIVERSE_CONFIG.loveLetter.sealInitials}
                  </span>
                </div>
                <span className="absolute -inset-2 rounded-full border border-[#F5D58A]/40 animate-ping [animation-duration:3s]" />
              </motion.div>

              <p className="mt-8 font-serif italic text-2xl sm:text-3xl text-[#FFF8FC] tracking-wide">
                &ldquo;{UNIVERSE_CONFIG.loveLetter.envelopePrompt}&rdquo;
              </p>

              <div className="mt-5 inline-flex items-center gap-2 px-6 py-3 min-h-[48px] rounded-full bg-[#4A102D]/70 border border-[#F5D58A]/50 text-xs sm:text-sm uppercase tracking-[0.2em] text-[#F5D58A] font-semibold group-hover:bg-[#E83E70] group-hover:text-[#FFF8FC] transition-colors">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{UNIVERSE_CONFIG.loveLetter.touchSealHint}</span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* AÇILMIŞ AŞK MEKTUBU */
          <motion.div
            key="opened-letter"
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="relative mx-auto max-w-3xl rounded-[2.25rem] p-7 sm:p-12 md:p-16 bg-gradient-to-b from-[#1E0C26]/95 via-[#13081C]/95 to-[#0B0512]/95 backdrop-blur-2xl border-2 border-[#F5D58A]/45 shadow-[0_25px_90px_rgba(232,62,112,0.3)] overflow-hidden"
          >
            {/* Altın Köşe Süslemeleri */}
            <div className="pointer-events-none absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#F5D58A]/45 rounded-tl-xl" />
            <div className="pointer-events-none absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#F5D58A]/45 rounded-tr-xl" />
            <div className="pointer-events-none absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#F5D58A]/45 rounded-bl-xl" />
            <div className="pointer-events-none absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#F5D58A]/45 rounded-br-xl" />

            {/* Üst Mühür & Kontroller */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F5D58A]/20 pb-5 mb-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#F5D58A] to-[#C68F32] text-[#4A102D] font-serif font-bold text-sm shadow-md">
                  S ❤️
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#F5D58A]">
                    {UNIVERSE_CONFIG.loveLetter.headerLabel}
                  </p>
                  <p className="text-xs text-[#FFF8FC]/60">
                    {UNIVERSE_CONFIG.birthdayDisplayDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {visibleLines < totalLines && (
                  <button
                    type="button"
                    onClick={handleRevealAll}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[42px] rounded-full text-xs tracking-wider uppercase bg-[#4A102D]/60 text-[#F5D58A] border border-[#F5D58A]/30 hover:bg-[#4A102D] transition-colors cursor-pointer"
                  >
                    <FastForward className="w-3.5 h-3.5" />
                    <span>{UNIVERSE_CONFIG.loveLetter.showAllButton}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[42px] rounded-full text-xs tracking-wider uppercase bg-[#1A0D26] text-[#FF91B5] border border-[#FF91B5]/30 hover:border-[#FF91B5] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{UNIVERSE_CONFIG.loveLetter.foldButton}</span>
                </button>
              </div>
            </div>

            {/* Mektup İçeriği — Satır Satır Belirme */}
            <div className="space-y-5 sm:space-y-6 font-serif text-xl sm:text-2xl md:text-[26px] leading-relaxed text-[#FFF8FC]/95">
              {visibleLines >= 1 && (
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="font-semibold text-2xl sm:text-3xl text-[#F5D58A] italic"
                >
                  {UNIVERSE_CONFIG.loveLetter.salutation}
                </motion.p>
              )}

              {UNIVERSE_CONFIG.loveLetter.paragraphs.map((paragraph, index) => {
                const isShown = visibleLines >= index + 2;
                if (!isShown) return null;

                const isHighlight =
                  paragraph.includes("İyi ki doğdun Sena.") ||
                  paragraph.includes("kutlanmaya değer çok özel birisin");

                return (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65 }}
                    className={
                      isHighlight
                        ? "font-semibold text-[#FF91B5] drop-shadow-[0_0_15px_rgba(232,62,112,0.35)]"
                        : "text-[#FFF8FC]/90"
                    }
                  >
                    {paragraph}
                  </motion.p>
                );
              })}

              {visibleLines >= totalLines && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="pt-6 border-t border-[#F5D58A]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <p className="font-serif italic font-semibold text-2xl sm:text-3xl bg-gradient-to-r from-[#F5D58A] via-[#FF91B5] to-[#E83E70] bg-clip-text text-transparent">
                    {UNIVERSE_CONFIG.loveLetter.signOff}
                  </p>

                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F5D58A]/70 font-sans">
                    <Heart className="w-4 h-4 text-[#E83E70] fill-[#E83E70] animate-pulse" />
                    <span>{UNIVERSE_CONFIG.loveLetter.foreverBadge}</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
