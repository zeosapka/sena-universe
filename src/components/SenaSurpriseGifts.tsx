import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Gift,
  Heart,
  Sparkles,
  Star,
  Moon,
  Mail,
  Flower2,
  X,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { UNIVERSE_CONFIG } from "../config/universeConfig";
import { usePerformanceProfile } from "../hooks/usePerformanceProfile";

const STORAGE_KEY = "sena_universe_opened_gifts_v1";

interface BloomingFlowerNode {
  id: number;
  x: number;
  y: number;
  size: number;
  hue: string;
  delay: number;
}

export function SenaSurpriseGifts() {
  const cfg = UNIVERSE_CONFIG.surpriseGiftsSection;
  const { isReducedMotion, particleCountMultiplier } = usePerformanceProfile();

  // Sayfa yenilendiğinde kutu durumlarının tutarlı kalması için localStorage senkronizasyonu
  const [openedBoxIds, setOpenedBoxIds] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Hediye açılma animasyonu aşaması:
  // "shaking" (sallanma) -> "untying" (kurdele çözülmesi) -> "lid-opening" (kapak açılması & ışıklar) -> modal
  const [animatingBoxId, setAnimatingBoxId] = useState<number | null>(null);
  const [animPhase, setAnimPhase] = useState<
    "idle" | "shaking" | "untying" | "lid-opening"
  >("idle");
  const [activeModalBoxId, setActiveModalBoxId] = useState<number | null>(null);

  // 2. Kutu (Sonsuz Çiçekler) için dinamik çiçek bahçesi durumu
  const [flowers, setFlowers] = useState<BloomingFlowerNode[]>([]);
  // 3. Kutu (Küçük Bir Yıldız) için dilek sayacı
  const [starWishCount, setStarWishCount] = useState(1);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(openedBoxIds));
    } catch {
      // ignore storage quota errors in private mode
    }
  }, [openedBoxIds]);

  const spawnInitialFlowers = () => {
    const palette = ["#FF91B5", "#E83E70", "#FFB8D2", "#F5D58A", "#FF6B9D"];
    const initial: BloomingFlowerNode[] = [];
    for (let i = 0; i < 12; i++) {
      initial.push({
        id: i + 1,
        x: 10 + ((i * 23) % 80),
        y: 15 + ((i * 29) % 70),
        size: 32 + (i % 4) * 10,
        hue: palette[i % palette.length],
        delay: i * 0.07,
      });
    }
    setFlowers(initial);
  };

  const addMoreFlowers = () => {
    const palette = ["#FF91B5", "#E83E70", "#FFB8D2", "#F5D58A", "#FF6B9D"];
    setFlowers((prev) => {
      const nextId = prev.length + 1;
      const added: BloomingFlowerNode[] = [
        {
          id: nextId,
          x: 12 + Math.random() * 76,
          y: 14 + Math.random() * 72,
          size: 36 + Math.random() * 18,
          hue: palette[nextId % palette.length],
          delay: 0,
        },
        {
          id: nextId + 1,
          x: 12 + Math.random() * 76,
          y: 14 + Math.random() * 72,
          size: 32 + Math.random() * 16,
          hue: palette[(nextId + 1) % palette.length],
          delay: 0.06,
        },
        {
          id: nextId + 2,
          x: 12 + Math.random() * 76,
          y: 14 + Math.random() * 72,
          size: 38 + Math.random() * 14,
          hue: palette[(nextId + 2) % palette.length],
          delay: 0.12,
        },
      ];
      return [...prev.slice(-21), ...added];
    });
  };

  const handleBoxClick = (boxId: number) => {
    if (animatingBoxId !== null) return;

    const markOpenedAndShowModal = () => {
      setOpenedBoxIds((prev) =>
        prev.includes(boxId) ? prev : [...prev, boxId]
      );
      if (boxId === 2) {
        spawnInitialFlowers();
      }
      if (boxId === 3) {
        setStarWishCount(1);
      }
      setAnimatingBoxId(null);
      setAnimPhase("idle");
      setActiveModalBoxId(boxId);

      // Kutu açıldığında pembe ve altın parçacık patlaması
      const isGrand = boxId === 5;
      confetti({
        particleCount: Math.max(
          30,
          Math.round((isGrand ? 110 : 65) * particleCountMultiplier)
        ),
        spread: isGrand ? 130 : 95,
        origin: { y: 0.58 },
        colors: ["#E83E70", "#FF91B5", "#F5D58A", "#FFF8FC"],
        scalar: isGrand ? 1.2 : 1.0,
      });
    };

    if (isReducedMotion) {
      markOpenedAndShowModal();
      return;
    }

    // 1. Aşama: Kutu hafifçe sallansın
    setAnimatingBoxId(boxId);
    setAnimPhase("shaking");

    window.setTimeout(() => {
      // 2. Aşama: Kurdele çözülsün
      setAnimPhase("untying");
    }, 380);

    window.setTimeout(() => {
      // 3. Aşama: Kutu kapağı açılsın ve içinden pembe ışıklar/kalpler yükselsin
      setAnimPhase("lid-opening");
    }, 720);

    window.setTimeout(() => {
      // 4. Aşama: Sürpriz modalı açılsın
      markOpenedAndShowModal();
    }, 1180);
  };

  const activeBox = cfg.boxes.find((b) => b.id === activeModalBoxId) || null;
  const openedCount = openedBoxIds.length;

  return (
    <section
      id="surprise-gifts-section"
      className="relative py-16 md:py-24 px-5 sm:px-6 max-w-6xl mx-auto"
    >
      {/* Bölüm Başlığı */}
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A102D]/55 border border-[#F5D58A]/35 mb-3 shadow-[0_0_25px_rgba(232,62,112,0.25)]">
          <Gift className="w-4 h-4 text-[#F5D58A]" />
          <span className="text-xs tracking-[0.22em] uppercase text-[#F5D58A] font-semibold">
            {cfg.badgeText} • {openedCount} / {cfg.boxes.length}
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#FFF8FC] font-semibold">
          {cfg.title}
        </h2>

        <p className="mt-4 font-serif italic text-xl sm:text-2xl text-[#FFF8FC]/85 leading-relaxed">
          &ldquo;{cfg.subtitle}&rdquo;
        </p>
      </div>

      {/* 5 Hediye Kutusu Grid Düzeni (iPad Dikeyde 2+2+1, Yatay ve Masaüstünde 3+2 / 5'li Uyumlu) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 sm:gap-6">
        {cfg.boxes.map((box, idx) => {
          const isOpened = openedBoxIds.includes(box.id);
          const isAnimatingThis = animatingBoxId === box.id;
          const isGrand = !!box.isGrandSpecial;

          // İlk 3 kutu lg ekranlarda 2'şer birim (3 sütun), son 2 kutu 3'er birim (2 geniş sütun),
          // sm (iPad dikey) ekranlarda 5. kutu 2 sütunu birden kaplar
          const gridSpanClass =
            idx < 3
              ? "lg:col-span-2"
              : idx === 3
              ? "lg:col-span-3"
              : "sm:col-span-2 lg:col-span-3";

          return (
            <motion.div
              key={box.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.55, delay: idx * 0.08 }}
              className={gridSpanClass}
            >
              <button
                type="button"
                onClick={() => handleBoxClick(box.id)}
                aria-label={`${box.numberLabel}. Kutu: ${box.title}`}
                className={`group relative w-full min-h-[240px] sm:min-h-[255px] rounded-[2rem] p-6 sm:p-7 text-center flex flex-col items-center justify-between overflow-hidden transition-all duration-500 cursor-pointer touch-manipulation select-none bg-gradient-to-br ${
                  box.boxGradient
                } ${
                  isGrand
                    ? "border-2 border-[#F5D58A]/80 shadow-[0_0_55px_rgba(245,213,138,0.3)]"
                    : isOpened
                    ? "border-2 border-[#FF91B5]/65 shadow-[0_0_35px_rgba(232,62,112,0.28)]"
                    : "border border-[#F5D58A]/35 shadow-[0_15px_45px_rgba(8,6,17,0.85)] hover:border-[#F5D58A]/75"
                } active:scale-[0.98]`}
              >
                {/* Arka plan romantik ışıltı halesi */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-75"
                  style={{
                    background: `radial-gradient(circle at 50% 38%, ${box.accentColor}33 0%, transparent 68%)`,
                  }}
                />

                {/* Üst Numara Rozeti ve Açıldı Durumu */}
                <div className="relative z-20 w-full flex items-center justify-between gap-2">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#12071D]/85 border border-[#F5D58A]/50 font-serif font-bold text-base text-[#F5D58A] shadow-md">
                    {box.numberLabel}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.16em] font-medium border ${
                      isOpened
                        ? "bg-[#F5D58A]/20 border-[#F5D58A]/70 text-[#F5D58A]"
                        : "bg-[#12071D]/70 border-[#FF91B5]/35 text-[#FF91B5]"
                    }`}
                  >
                    {isOpened ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F5D58A]" />
                        <span>{cfg.openedBadgeText}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-[#FF91B5]" />
                        <span>{cfg.unopenedBadgeText}</span>
                      </>
                    )}
                  </span>
                </div>

                {/* MERKEZ 3B HEDİYE KUTUSU, KURDELE VE FİYONK ANİMASYONU */}
                <div
                  className={`relative z-20 my-3 flex flex-col items-center justify-center ${
                    isAnimatingThis && animPhase === "shaking"
                      ? "animate-gift-wobble"
                      : ""
                  }`}
                >
                  {/* Kutu İçinden Yükselen Işıklar ve Kalpler (Kapak Açılırken) */}
                  <AnimatePresence>
                    {isAnimatingThis &&
                      (animPhase === "untying" ||
                        animPhase === "lid-opening") && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.4, y: 15 }}
                          animate={{ opacity: 1, scale: 1.35, y: -28 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.45 }}
                          className="pointer-events-none absolute -top-8 flex items-center justify-center gap-2"
                        >
                          <Heart className="w-6 h-6 text-[#FF91B5] fill-[#FF91B5]" />
                          <Sparkles className="w-7 h-7 text-[#F5D58A]" />
                          <Heart className="w-6 h-6 text-[#E83E70] fill-[#E83E70]" />
                        </motion.div>
                      )}
                  </AnimatePresence>

                  {/* Fiyonk (Bow) & Kutu Kapağı (Lid) */}
                  <motion.div
                    animate={
                      isAnimatingThis && animPhase === "lid-opening"
                        ? { y: -26, rotate: -14, opacity: 0.25 }
                        : isOpened
                        ? { y: -4 }
                        : { y: [0, -3, 0] }
                    }
                    transition={
                      isAnimatingThis
                        ? { duration: 0.38, ease: "easeOut" }
                        : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                    }
                    className="relative z-20 flex flex-col items-center"
                  >
                    {/* Parlayan Fiyonk Kanatları */}
                    <motion.div
                      animate={
                        isAnimatingThis &&
                        (animPhase === "untying" || animPhase === "lid-opening")
                          ? { scaleX: 1.45, scaleY: 0.35, opacity: 0.2 }
                          : { scaleX: 1, scaleY: 1, opacity: 1 }
                      }
                      transition={{ duration: 0.32 }}
                      className="flex items-center justify-center -mb-1"
                    >
                      <span
                        className="w-6 h-3.5 rounded-full border-2 -mr-1 rotate-[-22deg] shadow-[0_0_12px_rgba(245,213,138,0.6)]"
                        style={{
                          borderColor: box.ribbonColor,
                          backgroundColor: `${box.ribbonColor}44`,
                        }}
                      />
                      <span
                        className="w-3 h-3 rounded-full z-10 shadow-sm"
                        style={{ backgroundColor: box.ribbonColor }}
                      />
                      <span
                        className="w-6 h-3.5 rounded-full border-2 -ml-1 rotate-[22deg] shadow-[0_0_12px_rgba(245,213,138,0.6)]"
                        style={{
                          borderColor: box.ribbonColor,
                          backgroundColor: `${box.ribbonColor}44`,
                        }}
                      />
                    </motion.div>

                    {/* Kutu Kapağı */}
                    <div
                      className="w-24 sm:w-28 h-5 rounded-lg border shadow-md flex items-center justify-center overflow-hidden"
                      style={{
                        backgroundColor: isGrand ? "#8E1D47" : "#5E1538",
                        borderColor: "#F5D58A99",
                      }}
                    >
                      <div
                        className="w-3.5 h-full"
                        style={{ backgroundColor: box.ribbonColor }}
                      />
                    </div>
                  </motion.div>

                  {/* Kutu Gövdesi + Dikey ve Yatay Kurdele */}
                  <div
                    className="relative w-20 sm:w-24 h-16 sm:h-18 -mt-0.5 rounded-b-2xl border flex items-center justify-center shadow-[0_10px_25px_rgba(8,6,17,0.75)] overflow-hidden"
                    style={{
                      backgroundColor: isGrand ? "#5E1133" : "#3B0D24",
                      borderColor: "#F5D58A66",
                    }}
                  >
                    {/* Dikey Kurdele */}
                    <motion.div
                      animate={
                        isAnimatingThis &&
                        (animPhase === "untying" || animPhase === "lid-opening")
                          ? { scaleY: 0.2, opacity: 0.25 }
                          : { scaleY: 1, opacity: 1 }
                      }
                      className="w-3.5 h-full"
                      style={{ backgroundColor: box.ribbonColor }}
                    />
                    {/* Yatay Kurdele */}
                    <motion.div
                      animate={
                        isAnimatingThis &&
                        (animPhase === "untying" || animPhase === "lid-opening")
                          ? { scaleX: 0.2, opacity: 0.25 }
                          : { scaleX: 1, opacity: 1 }
                      }
                      className="absolute inset-x-0 h-3"
                      style={{ backgroundColor: box.ribbonColor }}
                    />

                    {/* Kutu Üzerindeki Küçük Kalp / Numara Mührü */}
                    <div className="relative z-10 w-7 h-7 rounded-full bg-[#12071D] border border-[#F5D58A] flex items-center justify-center shadow-md">
                      <Heart className="w-3.5 h-3.5 text-[#E83E70] fill-[#E83E70]" />
                    </div>
                  </div>
                </div>

                {/* Alt Kutu Başlığı */}
                <div className="relative z-20 space-y-1">
                  <h3 className="font-serif font-semibold text-xl sm:text-2xl text-[#FFF8FC] group-hover:text-[#F5D58A] transition-colors">
                    {box.numberLabel}. Kutu — {box.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FFF8FC]/70 font-serif italic">
                    {box.shortHint}
                  </p>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* SÜRPRİZ HEDİYE İÇERİK MODALI (Dikey ve Yatay iPad Uyumlu, Taşma Yapmaz) */}
      <AnimatePresence>
        {activeBox && (
          <motion.div
            key={`gift-modal-${activeBox.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalBoxId(null)}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pt-16 sm:p-6 md:p-10 bg-[#080611]/90 backdrop-blur-2xl overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[86dvh] overflow-y-auto overscroll-contain rounded-[2.25rem] p-6 sm:p-10 bg-gradient-to-b from-[#260B21] via-[#15081E] to-[#0A0512] border-2 border-[#F5D58A]/65 shadow-[0_25px_90px_rgba(232,62,112,0.45)] text-center"
            >
              {/* Sağ Üst Kapatma Butonu */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F5D58A]/20">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#4A102D]/70 border border-[#F5D58A]/40 text-xs uppercase tracking-[0.2em] text-[#F5D58A]">
                  <Gift className="w-3.5 h-3.5" />
                  <span>
                    {activeBox.numberLabel}. Sürpriz • {activeBox.title}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={() => setActiveModalBoxId(null)}
                  aria-label={cfg.closeModalAriaLabel}
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-[#4A102D]/80 border border-[#F5D58A]/45 text-[#FFF8FC] hover:bg-[#E83E70] active:scale-95 transition-all cursor-pointer touch-manipulation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. KUTU İÇERİĞİ: SANA BİR MEKTUP 💌 */}
              {activeBox.id === 1 && (
                <div className="space-y-6 py-2">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.6, repeat: Infinity }}
                    className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#FF91B5] to-[#E83E70] p-0.5 shadow-[0_0_40px_rgba(232,62,112,0.6)] flex items-center justify-center"
                  >
                    <div className="w-full h-full rounded-full bg-[#14071E] flex items-center justify-center">
                      <Mail className="w-9 h-9 text-[#FF91B5]" />
                    </div>
                  </motion.div>

                  <h3 className="font-serif text-3xl sm:text-4xl text-[#F5D58A] font-semibold italic">
                    {activeBox.headline}
                  </h3>

                  <div className="p-6 sm:p-8 rounded-3xl bg-[#12061A]/85 border border-[#F5D58A]/30 shadow-inner">
                    <p className="font-serif italic text-xl sm:text-2xl text-[#FFF8FC]/95 leading-relaxed">
                      &ldquo;{activeBox.message}&rdquo;
                    </p>
                  </div>

                  <p className="text-xs uppercase tracking-[0.22em] text-[#FF91B5]">
                    {activeBox.subNote}
                  </p>
                </div>
              )}

              {/* 2. KUTU İÇERİĞİ: SONSUZ ÇİÇEKLER 🌸 */}
              {activeBox.id === 2 && (
                <div className="space-y-6 py-2">
                  <div
                    onClick={addMoreFlowers}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") addMoreFlowers();
                    }}
                    className="relative w-full h-56 sm:h-64 rounded-3xl bg-[radial-gradient(circle_at_center,#3B0E28_0%,#0E0515_85%)] border border-[#FF91B5]/40 overflow-hidden cursor-pointer select-none"
                  >
                    {flowers.map((fl) => (
                      <motion.div
                        key={fl.id}
                        initial={{ scale: 0, rotate: -45, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 220,
                          damping: 15,
                          delay: fl.delay,
                        }}
                        style={{
                          left: `${fl.x}%`,
                          top: `${fl.y}%`,
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      >
                        <Flower2
                          style={{
                            width: fl.size,
                            height: fl.size,
                            color: fl.hue,
                          }}
                          className="drop-shadow-[0_0_14px_rgba(255,145,181,0.8)]"
                        />
                      </motion.div>
                    ))}
                    <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#12071D]/85 border border-[#F5D58A]/35 text-[11px] uppercase tracking-[0.18em] text-[#F5D58A]">
                        <Sparkles className="w-3 h-3" />
                        <span>{activeBox.subNote}</span>
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif italic font-semibold text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-[#FFF8FC] via-[#FF91B5] to-[#F5D58A] bg-clip-text text-transparent leading-snug">
                    &ldquo;{activeBox.message}&rdquo;
                  </h3>

                  <button
                    type="button"
                    onClick={addMoreFlowers}
                    className="inline-flex items-center gap-2 px-6 py-3 min-h-[46px] rounded-full bg-[#4A102D]/80 hover:bg-[#E83E70] border border-[#F5D58A]/45 text-xs uppercase tracking-[0.2em] text-[#FFF8FC] transition-colors cursor-pointer touch-manipulation"
                  >
                    <Flower2 className="w-4 h-4 text-[#F5D58A]" />
                    <span>Daha Fazla Çiçek Açtır 🌸</span>
                  </button>
                </div>
              )}

              {/* 3. KUTU İÇERİĞİ: KÜÇÜK BİR YILDIZ ✨ */}
              {activeBox.id === 3 && (
                <div className="space-y-6 py-2">
                  <div
                    onClick={() => {
                      setStarWishCount((c) => c + 1);
                      confetti({
                        particleCount: Math.max(
                          25,
                          Math.round(50 * particleCountMultiplier)
                        ),
                        spread: 90,
                        origin: { y: 0.55 },
                        colors: ["#F5D58A", "#FFF8FC", "#FF91B5"],
                      });
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setStarWishCount((c) => c + 1);
                      }
                    }}
                    className="relative w-full h-56 sm:h-64 rounded-3xl bg-[radial-gradient(circle_at_center,#2B1338_0%,#090514_85%)] border border-[#F5D58A]/45 flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
                  >
                    {/* Kayan Yıldız Hüzmesi */}
                    <motion.div
                      key={starWishCount}
                      initial={{ x: -160, y: 60, opacity: 0, scale: 0.5 }}
                      animate={{
                        x: [0, 0],
                        y: [0, 0],
                        opacity: 1,
                        scale: [1, 1.18, 1],
                      }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      className="relative flex items-center justify-center w-28 h-28 rounded-full bg-[#F5D58A]/15 border border-[#F5D58A]/50 shadow-[0_0_70px_rgba(245,213,138,0.85)]"
                    >
                      <Star className="w-16 h-16 text-[#F5D58A] fill-[#F5D58A] drop-shadow-[0_0_25px_rgba(245,213,138,1)]" />
                    </motion.div>

                    <span className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#12071D]/80 border border-[#F5D58A]/35 text-[11px] uppercase tracking-[0.18em] text-[#F5D58A]">
                      <Sparkles className="w-3 h-3" />
                      <span>{activeBox.subNote}</span>
                    </span>
                  </div>

                  <h3 className="font-serif italic font-semibold text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-[#FFF8FC] via-[#F5D58A] to-[#FF91B5] bg-clip-text text-transparent leading-snug">
                    &ldquo;{activeBox.message}&rdquo;
                  </h3>
                </div>
              )}

              {/* 4. KUTU İÇERİĞİ: BİRLİKTE GELECEK HAYALLERİMİZ 🌙 */}
              {activeBox.id === 4 && (
                <div className="space-y-6 py-2">
                  <motion.div
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#F5D58A] to-[#FF91B5] p-0.5 shadow-[0_0_45px_rgba(245,213,138,0.55)] flex items-center justify-center"
                  >
                    <div className="w-full h-full rounded-full bg-[#14071E] flex items-center justify-center">
                      <Moon className="w-9 h-9 text-[#F5D58A] fill-[#F5D58A]/30" />
                    </div>
                  </motion.div>

                  <h3 className="font-serif text-2xl sm:text-4xl text-[#F5D58A] font-semibold italic">
                    {activeBox.headline}
                  </h3>

                  <p className="font-serif italic text-lg sm:text-xl text-[#FFF8FC]/90 leading-relaxed">
                    &ldquo;{activeBox.message}&rdquo;
                  </p>

                  {activeBox.futureDreams && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                      {activeBox.futureDreams.map((dream, dIdx) => (
                        <motion.div
                          key={dIdx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: dIdx * 0.12 }}
                          className="p-4 rounded-2xl bg-[#160824]/90 border border-[#F5D58A]/30 text-sm sm:text-base text-[#FFF8FC]/95 font-medium flex items-center gap-2.5"
                        >
                          <span>{dream}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs uppercase tracking-[0.2em] text-[#F5D58A]/85">
                    {activeBox.subNote}
                  </p>
                </div>
              )}

              {/* 5. KUTU İÇERİĞİ: EN BÜYÜK SÜRPRİZ ❤️ */}
              {activeBox.id === 5 && (
                <div className="space-y-6 py-3">
                  <div className="relative py-4 flex items-center justify-center">
                    <div className="pointer-events-none absolute w-44 h-44 rounded-full bg-[#E83E70]/35 blur-2xl animate-pulse" />
                    <motion.div
                      animate={{ scale: [1, 1.18, 1, 1.14, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-br from-[#F5D58A] via-[#FF91B5] to-[#E83E70] p-1 shadow-[0_0_70px_rgba(232,62,112,0.9)] flex items-center justify-center"
                    >
                      <div className="w-full h-full rounded-full bg-[#16061A] flex items-center justify-center">
                        <Heart className="w-14 h-14 text-[#E83E70] fill-[#E83E70]" />
                      </div>
                    </motion.div>
                  </div>

                  <h3 className="font-serif italic font-bold text-2xl sm:text-4xl md:text-5xl bg-gradient-to-r from-[#FFF8FC] via-[#F5D58A] to-[#FF91B5] bg-clip-text text-transparent leading-tight drop-shadow-[0_2px_30px_rgba(232,62,112,0.65)]">
                    &ldquo;{activeBox.message}&rdquo;
                  </h3>

                  <p className="text-xs sm:text-sm uppercase tracking-[0.24em] text-[#F5D58A]">
                    {activeBox.subNote}
                  </p>
                </div>
              )}

              {/* Alt Kapat / Hediyelere Dön Butonu */}
              <div className="pt-6 mt-6 border-t border-[#F5D58A]/20 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModalBoxId(null)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 min-h-[48px] rounded-full bg-gradient-to-r from-[#4A102D] via-[#E83E70] to-[#4A102D] border border-[#F5D58A]/65 text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold text-[#FFF8FC] shadow-[0_0_30px_rgba(232,62,112,0.5)] active:scale-95 transition-all cursor-pointer touch-manipulation"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{cfg.closeModalButtonText}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
