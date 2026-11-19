import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Maximize2,
  RotateCw,
  Sparkles,
  X,
  Heart,
  ImagePlus,
} from "lucide-react";
import { UNIVERSE_CONFIG, type MomentItem } from "../config/universeConfig";

function RomanticPlaceholderArtwork({ item }: { item: MomentItem }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-[radial-gradient(circle_at_50%_30%,#4A102D_0%,#12071D_65%,#080611_100%)]">
      {/* Takımyıldızı SVG Çizgileri */}
      <svg
        viewBox="0 0 200 140"
        className="w-40 h-28 opacity-55 mb-2"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`grad-${item.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F5D58A" />
            <stop offset="50%" stopColor="#FF91B5" />
            <stop offset="100%" stopColor="#E83E70" />
          </linearGradient>
        </defs>
        <path
          d="M25,95 L65,45 L115,65 L155,25 L175,85"
          fill="none"
          stroke={`url(#grad-${item.id})`}
          strokeWidth="1.2"
          strokeDasharray="3 3"
        />
        <circle cx="25" cy="95" r="3" fill="#F5D58A" />
        <circle cx="65" cy="45" r="4" fill="#FF91B5" />
        <circle cx="115" cy="65" r="3" fill="#FFF8FC" />
        <circle cx="155" cy="25" r="4.5" fill="#E83E70" />
        <circle cx="175" cy="85" r="3" fill="#F5D58A" />
      </svg>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A102D]/60 border border-[#F5D58A]/30 text-[11px] uppercase tracking-[0.2em] text-[#F5D58A] mb-2">
        <ImagePlus className="w-3 h-3 shrink-0" />
        <span>{item.dateLabel}</span>
      </div>

      <p className="font-serif text-lg sm:text-xl text-[#FFF8FC]/90 font-medium">
        {item.constellationName}
      </p>
      <p className="mt-1 text-xs text-[#FFF8FC]/55 max-w-[235px]">
        {item.subtitle}
      </p>
    </div>
  );
}

export function OurLittleMoments() {
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});
  const [selectedMoment, setSelectedMoment] = useState<MomentItem | null>(null);
  const [customNotes, setCustomNotes] = useState<Record<string, string>>({});

  const toggleFlip = (id: string) => {
    setFlippedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="relative py-16 md:py-24 px-6 max-w-6xl mx-auto">
      {/* Bölüm Başlığı */}
      <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A102D]/45 border border-[#F5D58A]/30 mb-3">
          <Camera className="w-3.5 h-3.5 text-[#F5D58A]" />
          <span className="text-xs tracking-[0.22em] uppercase text-[#F5D58A] font-medium">
            {UNIVERSE_CONFIG.momentsSection.badgeText}
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#FFF8FC] font-semibold">
          {UNIVERSE_CONFIG.momentsSection.title}
        </h2>

        <p className="mt-4 font-serif italic text-xl sm:text-2xl text-[#FFF8FC]/80">
          {UNIVERSE_CONFIG.momentsSection.subtitle}
        </p>

        <p className="mt-3 text-xs tracking-[0.16em] uppercase text-[#F5D58A]/75">
          {UNIVERSE_CONFIG.momentsSection.helperNote}
        </p>
      </div>

      {/* Tablet-First Grid: Dikey Tablette 2 Sütun, Yatay Tablet ve Masaüstünde 3 Sütun */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {UNIVERSE_CONFIG.momentsSection.items.map((item, idx) => {
          const isFlipped = !!flippedIds[item.id];
          const captionText = customNotes[item.id] ?? item.quote;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="group relative h-[425px] sm:h-[445px] safari-perspective"
            >
              <div
                className={`relative w-full h-full rounded-[2rem] transition-transform duration-700 safari-preserve-3d ${
                  isFlipped ? "safari-rotate-y-180" : ""
                }`}
              >
                {/* 3B KART ÖN YÜZÜ */}
                <div
                  className={`absolute inset-0 w-full h-full rounded-[2rem] p-4 flex flex-col justify-between bg-gradient-to-b from-[#1B0B28]/90 to-[#0C0614]/95 backdrop-blur-xl border border-[#F5D58A]/30 shadow-[0_15px_45px_rgba(8,6,17,0.85)] safari-backface-hidden ${
                    isFlipped ? "pointer-events-none" : "pointer-events-auto"
                  }`}
                >
                  {/* Fotoğraf / Çerçeve Alanı */}
                  <div
                    onClick={() => toggleFlip(item.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") toggleFlip(item.id);
                    }}
                    className="relative w-full h-60 rounded-2xl overflow-hidden border border-[#F5D58A]/25 cursor-pointer group/frame"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover/frame:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <RomanticPlaceholderArtwork item={item} />
                    )}

                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#080611]/75 backdrop-blur-md border border-[#F5D58A]/30 text-[11px] text-[#F5D58A] flex items-center gap-1">
                      <RotateCw className="w-3 h-3" />
                      <span>{UNIVERSE_CONFIG.momentsSection.flipBadgeText}</span>
                    </div>
                  </div>

                  {/* Kart Başlığı ve Butonlar */}
                  <div className="pt-3 px-1 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-semibold text-2xl text-[#FFF8FC]">
                        {item.title}
                      </h3>
                      <p className="mt-1 font-serif italic text-base text-[#FF91B5]/90 line-clamp-2">
                        &ldquo;{captionText}&rdquo;
                      </p>
                    </div>

                    <div className="pt-3 mt-2 border-t border-[#F5D58A]/15 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => toggleFlip(item.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[42px] rounded-full text-xs uppercase tracking-wider text-[#F5D58A] bg-[#4A102D]/50 hover:bg-[#4A102D] border border-[#F5D58A]/25 transition-colors cursor-pointer"
                      >
                        <RotateCw className="w-3.5 h-3.5 shrink-0" />
                        <span>{UNIVERSE_CONFIG.momentsSection.flipButtonText}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedMoment(item)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[42px] rounded-full text-xs uppercase tracking-wider text-[#FFF8FC] bg-[#E83E70]/80 hover:bg-[#E83E70] shadow-[0_0_20px_rgba(232,62,112,0.4)] transition-all cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {UNIVERSE_CONFIG.momentsSection.fullscreenButtonText}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3B KART ARKA YÜZÜ (ROMANTİK NOT VE MESAJ DÜZENLEME) */}
                <div
                  className={`absolute inset-0 w-full h-full rounded-[2rem] p-6 flex flex-col justify-between bg-gradient-to-br from-[#2B0C20] via-[#150821] to-[#080611] border-2 border-[#F5D58A]/50 shadow-[0_15px_50px_rgba(232,62,112,0.3)] safari-backface-hidden safari-rotate-y-180 ${
                    isFlipped ? "pointer-events-auto" : "pointer-events-none"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[#F5D58A]/20 pb-3">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#F5D58A] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {item.dateLabel}
                    </span>
                    <Heart className="w-4 h-4 text-[#E83E70] fill-[#E83E70]" />
                  </div>

                  <div className="my-auto py-4 text-center space-y-4">
                    <h4 className="font-serif text-2xl text-[#F5D58A] italic">
                      {item.title}
                    </h4>
                    <p className="font-serif italic text-xl text-[#FFF8FC]/95 leading-relaxed">
                      &ldquo;{captionText}&rdquo;
                    </p>

                    <div className="pt-2">
                      <label
                        htmlFor={`note-${item.id}`}
                        className="block text-[11px] uppercase tracking-[0.18em] text-[#FF91B5]/80 mb-1.5"
                      >
                        {UNIVERSE_CONFIG.momentsSection.editNoteLabel}
                      </label>
                      <input
                        id={`note-${item.id}`}
                        type="text"
                        value={captionText}
                        onChange={(e) =>
                          setCustomNotes((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-[#080611]/70 border border-[#F5D58A]/30 text-xs text-[#FFF8FC] focus:outline-none focus:border-[#F5D58A]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#F5D58A]/20">
                    <button
                      type="button"
                      onClick={() => toggleFlip(item.id)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full text-xs uppercase tracking-[0.2em] bg-[#4A102D] text-[#F5D58A] border border-[#F5D58A]/40 hover:bg-[#E83E70] hover:text-[#FFF8FC] transition-colors cursor-pointer"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>
                        {UNIVERSE_CONFIG.momentsSection.flipBackButtonText}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* TAM EKRAN ANI MODALI */}
      <AnimatePresence>
        {selectedMoment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMoment(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20 sm:p-8 sm:pt-20 bg-[#080611]/90 backdrop-blur-2xl overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[85dvh] overflow-y-auto overscroll-contain rounded-[2.25rem] p-5 sm:p-10 bg-gradient-to-b from-[#1E0C29] to-[#0B0512] border-2 border-[#F5D58A]/50 shadow-[0_25px_90px_rgba(232,62,112,0.45)]"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F5D58A]/20">
                <div>
                  <span className="text-xs uppercase tracking-[0.22em] text-[#F5D58A]">
                    {selectedMoment.dateLabel} • {selectedMoment.constellationName}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-4xl text-[#FFF8FC] font-semibold mt-0.5">
                    {selectedMoment.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMoment(null)}
                  aria-label={UNIVERSE_CONFIG.momentsSection.closeModalAriaLabel}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[#4A102D]/70 border border-[#F5D58A]/40 text-[#FFF8FC] hover:bg-[#E83E70] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-[#F5D58A]/30 mb-6">
                {selectedMoment.imageUrl ? (
                  <img
                    src={selectedMoment.imageUrl}
                    alt={selectedMoment.title}
                    className="w-full h-full object-contain bg-[#080611]"
                  />
                ) : (
                  <RomanticPlaceholderArtwork item={selectedMoment} />
                )}
              </div>

              <div className="text-center space-y-2">
                <p className="font-serif italic text-2xl sm:text-3xl text-[#FF91B5]">
                  &ldquo;
                  {customNotes[selectedMoment.id] ?? selectedMoment.quote}
                  &rdquo;
                </p>
                <p className="text-xs text-[#FFF8FC]/60">
                  {UNIVERSE_CONFIG.momentsSection.configTipText}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
