import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Heart,
  Sparkles,
  Star,
  Lock,
  Unlock,
  RotateCcw,
  Play,
  Trophy,
  Gamepad2,
  MailOpen,
  CheckCircle2,
} from "lucide-react";
import { UNIVERSE_CONFIG } from "../config/universeConfig";

type GameTab = "catch-hearts" | "find-star" | "heart-cipher";

interface SpawnedHeart {
  id: number;
  x: number; // % (10 - 88)
  y: number; // % (12 - 82)
  scale: number;
  color: string;
}

interface StarNode {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  isSecretGolden: boolean;
}

export function SenaGameCorner() {
  const [activeTab, setActiveTab] = useState<GameTab>("catch-hearts");

  return (
    <section className="relative py-16 md:py-24 px-6 max-w-6xl mx-auto">
      {/* Bölüm Başlığı */}
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A102D]/55 border border-[#F5D58A]/35 mb-3 shadow-[0_0_25px_rgba(232,62,112,0.2)]">
          <Gamepad2 className="w-4 h-4 text-[#F5D58A]" />
          <span className="text-xs tracking-[0.22em] uppercase text-[#F5D58A] font-semibold">
            {UNIVERSE_CONFIG.gamesSection.badgeText}
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#FFF8FC] font-semibold">
          {UNIVERSE_CONFIG.gamesSection.title}
        </h2>

        <p className="mt-4 font-serif italic text-xl sm:text-2xl text-[#FFF8FC]/85">
          {UNIVERSE_CONFIG.gamesSection.subtitle}
        </p>
      </div>

      {/* 3 Oyun Seçim Kartı (Tablet ve Mobil Dokunmatik Uyumlu) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab("catch-hearts")}
          className={`group text-left p-5 sm:p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[135px] ${
            activeTab === "catch-hearts"
              ? "bg-gradient-to-br from-[#4A102D]/85 via-[#240B22]/95 to-[#12071D] border-[#F5D58A] shadow-[0_0_40px_rgba(232,62,112,0.35)] scale-[1.01]"
              : "bg-[#150821]/75 hover:bg-[#1F0B2E]/80 border-[#F5D58A]/25 opacity-85 hover:opacity-100"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[#E83E70]/25 border border-[#E83E70]/50 text-[#FF91B5]">
              <Heart className="w-5 h-5 fill-[#E83E70] text-[#E83E70]" />
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#F5D58A]/80 font-medium">
              1. Oyun • 30 Sn
            </span>
          </div>
          <div>
            <h3 className="font-serif text-2xl font-semibold text-[#FFF8FC]">
              {UNIVERSE_CONFIG.gamesSection.catchHearts.cardTitle}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#FFF8FC]/70 line-clamp-2">
              {UNIVERSE_CONFIG.gamesSection.catchHearts.cardSubtitle}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("find-star")}
          className={`group text-left p-5 sm:p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[135px] ${
            activeTab === "find-star"
              ? "bg-gradient-to-br from-[#4A102D]/85 via-[#240B22]/95 to-[#12071D] border-[#F5D58A] shadow-[0_0_40px_rgba(245,213,138,0.3)] scale-[1.01]"
              : "bg-[#150821]/75 hover:bg-[#1F0B2E]/80 border-[#F5D58A]/25 opacity-85 hover:opacity-100"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[#F5D58A]/20 border border-[#F5D58A]/50 text-[#F5D58A]">
              <Star className="w-5 h-5 fill-[#F5D58A] text-[#F5D58A]" />
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#F5D58A]/80 font-medium">
              2. Oyun • Keşif
            </span>
          </div>
          <div>
            <h3 className="font-serif text-2xl font-semibold text-[#FFF8FC]">
              {UNIVERSE_CONFIG.gamesSection.findStar.cardTitle}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#FFF8FC]/70 line-clamp-2">
              {UNIVERSE_CONFIG.gamesSection.findStar.cardSubtitle}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("heart-cipher")}
          className={`group text-left p-5 sm:p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[135px] ${
            activeTab === "heart-cipher"
              ? "bg-gradient-to-br from-[#4A102D]/85 via-[#240B22]/95 to-[#12071D] border-[#F5D58A] shadow-[0_0_40px_rgba(232,62,112,0.35)] scale-[1.01]"
              : "bg-[#150821]/75 hover:bg-[#1F0B2E]/80 border-[#F5D58A]/25 opacity-85 hover:opacity-100"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[#FF91B5]/20 border border-[#FF91B5]/50 text-[#FF91B5]">
              <Lock className="w-5 h-5 text-[#FF91B5]" />
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#F5D58A]/80 font-medium">
              3. Oyun • 3 Aşama
            </span>
          </div>
          <div>
            <h3 className="font-serif text-2xl font-semibold text-[#FFF8FC]">
              {UNIVERSE_CONFIG.gamesSection.heartCipher.cardTitle}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#FFF8FC]/70 line-clamp-2">
              {UNIVERSE_CONFIG.gamesSection.heartCipher.cardSubtitle}
            </p>
          </div>
        </button>
      </div>

      {/* Aktif Oyun Sahnesi */}
      <div className="relative rounded-[2.25rem] p-6 sm:p-10 bg-gradient-to-b from-[#1B0A28]/90 via-[#11071C]/95 to-[#080611]/95 backdrop-blur-2xl border border-[#F5D58A]/35 shadow-[0_20px_70px_rgba(8,6,17,0.9)] overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "catch-hearts" && (
            <motion.div
              key="game-catch-hearts"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <CatchHeartsGame />
            </motion.div>
          )}

          {activeTab === "find-star" && (
            <motion.div
              key="game-find-star"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <FindSecretStarGame />
            </motion.div>
          )}

          {activeTab === "heart-cipher" && (
            <motion.div
              key="game-heart-cipher"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <HeartCipherGame />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ============================================================================
 * 1. OYUN: KALPLERİ YAKALA (30 SANİYE, HER KALP 10 PUAN)
 * ========================================================================== */
function CatchHeartsGame() {
  const cfg = UNIVERSE_CONFIG.gamesSection.catchHearts;
  const [status, setStatus] = useState<"idle" | "playing" | "finished">("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(cfg.durationSeconds);
  const [hearts, setHearts] = useState<SpawnedHeart[]>([]);
  const nextHeartId = useRef(1);

  const colors = ["#E83E70", "#FF91B5", "#F5D58A"];

  const createRandomHeart = (): SpawnedHeart => {
    const id = nextHeartId.current++;
    return {
      id,
      x: 10 + Math.random() * 78,
      y: 14 + Math.random() * 68,
      scale: 0.9 + Math.random() * 0.35,
      color: colors[id % colors.length],
    };
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(cfg.durationSeconds);
    setHearts([
      createRandomHeart(),
      createRandomHeart(),
      createRandomHeart(),
      createRandomHeart(),
    ]);
    setStatus("playing");
  };

  // Süre sayacı
  useEffect(() => {
    if (status !== "playing") return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setStatus("finished");
          confetti({
            particleCount: 70,
            spread: 100,
            origin: { y: 0.6 },
            colors: ["#E83E70", "#FF91B5", "#F5D58A", "#FFF8FC"],
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status]);

  // Dinamik kalp yenileme
  useEffect(() => {
    if (status !== "playing") return;

    const spawner = window.setInterval(() => {
      setHearts((prev) => {
        if (prev.length >= 7) return prev;
        return [...prev, createRandomHeart()];
      });
    }, 650);

    return () => window.clearInterval(spawner);
  }, [status]);

  const handleCatchHeart = (id: number, e: React.PointerEvent) => {
    e.stopPropagation();
    if (status !== "playing") return;
    setScore((prev) => prev + cfg.pointsPerHeart);
    setHearts((prev) => [
      ...prev.filter((h) => h.id !== id),
      createRandomHeart(),
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Üst Skor & Süre Çubuğu */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F5D58A]/20">
        <div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#FFF8FC] font-semibold">
            {cfg.cardTitle}
          </h3>
          <p className="text-xs sm:text-sm text-[#FFF8FC]/70">
            {cfg.cardSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-[#4A102D]/60 border border-[#F5D58A]/35 text-center min-w-[95px]">
            <span className="block text-[10px] uppercase tracking-[0.2em] text-[#F5D58A]/80">
              {cfg.scoreLabel}
            </span>
            <span className="font-serif font-bold text-2xl text-[#FFF8FC] tabular-nums">
              {score}
            </span>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-[#160924] border border-[#FF91B5]/35 text-center min-w-[95px]">
            <span className="block text-[10px] uppercase tracking-[0.2em] text-[#FF91B5]/80">
              {cfg.timeLabel}
            </span>
            <span className="font-serif font-bold text-2xl text-[#F5D58A] tabular-nums">
              {timeLeft} {cfg.timeUnit}
            </span>
          </div>
        </div>
      </div>

      {/* Oyun Alanı */}
      <div className="relative w-full h-[340px] sm:h-[380px] rounded-3xl bg-[radial-gradient(circle_at_center,#2B0B22_0%,#0B0514_80%)] border border-[#F5D58A]/25 overflow-hidden select-none">
        {status === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#E83E70]/20 border border-[#E83E70]/50 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-[#E83E70] fill-[#E83E70] animate-pulse" />
            </div>
            <p className="font-serif italic text-xl sm:text-2xl text-[#FFF8FC]/90 max-w-md mb-6">
              {cfg.startPrompt}
            </p>
            <button
              type="button"
              onClick={startGame}
              className="inline-flex items-center gap-2.5 px-8 py-4 min-h-[54px] rounded-full font-sans font-semibold text-sm uppercase tracking-[0.2em] text-[#FFF8FC] bg-gradient-to-r from-[#E83E70] to-[#4A102D] border border-[#F5D58A]/60 shadow-[0_0_30px_rgba(232,62,112,0.5)] active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{UNIVERSE_CONFIG.gamesSection.playButtonText}</span>
            </button>
          </div>
        )}

        {status === "playing" && (
          <AnimatePresence>
            {hearts.map((h) => (
              <motion.button
                key={h.id}
                type="button"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: h.scale }}
                exit={{ opacity: 0, scale: 1.6 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                onPointerDown={(e) => handleCatchHeart(h.id, e)}
                style={{
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                }}
                aria-label="Kalbi yakala"
                className="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-[#4A102D]/55 border border-[#F5D58A]/40 shadow-[0_0_25px_rgba(232,62,112,0.6)] active:scale-125 cursor-pointer touch-manipulation"
              >
                <Heart
                  className="w-8 h-8 sm:w-9 sm:h-9 transition-transform"
                  style={{ color: h.color, fill: h.color }}
                />
              </motion.button>
            ))}
          </AnimatePresence>
        )}

        {status === "finished" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#080611]/85 backdrop-blur-md"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E83E70] to-[#F5D58A] flex items-center justify-center text-[#080611] shadow-[0_0_35px_rgba(245,213,138,0.6)] mb-4">
              <Trophy className="w-8 h-8" />
            </div>

            <p className="text-xs uppercase tracking-[0.24em] text-[#F5D58A] font-semibold">
              {cfg.collectedSummaryPrefix} {score} Puan ({score / 10} Kalp)
            </p>

            <h4 className="mt-2 font-serif font-bold text-2xl sm:text-4xl bg-gradient-to-r from-[#FFF8FC] via-[#FF91B5] to-[#F5D58A] bg-clip-text text-transparent">
              {cfg.finalMessage}
            </h4>

            <button
              type="button"
              onClick={startGame}
              className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 min-h-[50px] rounded-full text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold text-[#FFF8FC] bg-[#4A102D] hover:bg-[#E83E70] border border-[#F5D58A]/50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{UNIVERSE_CONFIG.gamesSection.playAgainButtonText}</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
 * 2. OYUN: GİZLİ YILDIZI BUL
 * ========================================================================== */
function FindSecretStarGame() {
  const cfg = UNIVERSE_CONFIG.gamesSection.findStar;
  const [stars, setStars] = useState<StarNode[]>([]);
  const [found, setFound] = useState(false);
  const [hintText, setHintText] = useState(cfg.instructionText);

  const generateStarField = () => {
    const count = 17;
    const secretIndex = Math.floor(Math.random() * count);
    const list: StarNode[] = [];

    for (let i = 0; i < count; i++) {
      // Dağılımın birbirine çok çarpmaması için ızgara + rastgele sapma
      const col = i % 6;
      const row = Math.floor(i / 6);
      const baseX = 12 + col * 15 + (Math.random() * 8 - 4);
      const baseY = 18 + row * 28 + (Math.random() * 12 - 6);

      list.push({
        id: i + 1,
        x: Math.min(88, Math.max(10, baseX)),
        y: Math.min(84, Math.max(14, baseY)),
        size: i === secretIndex ? 30 : 22 + (i % 3) * 4,
        duration: 2.2 + (i % 4) * 0.6,
        delay: (i % 5) * 0.3,
        isSecretGolden: i === secretIndex,
      });
    }

    setStars(list);
    setFound(false);
    setHintText(cfg.instructionText);
  };

  useEffect(() => {
    generateStarField();
  }, []);

  const handleStarTap = (star: StarNode) => {
    if (found) return;
    if (star.isSecretGolden) {
      setFound(true);
      confetti({
        particleCount: 85,
        spread: 115,
        origin: { y: 0.6 },
        colors: ["#F5D58A", "#FFF8FC", "#FF91B5", "#E83E70"],
      });
    } else {
      setHintText(cfg.wrongStarHint);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F5D58A]/20">
        <div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#FFF8FC] font-semibold">
            {cfg.cardTitle}
          </h3>
          <p className="text-xs sm:text-sm text-[#F5D58A]/90 mt-1">{hintText}</p>
        </div>

        <button
          type="button"
          onClick={generateStarField}
          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full text-xs uppercase tracking-[0.18em] text-[#F5D58A] bg-[#4A102D]/50 hover:bg-[#4A102D] border border-[#F5D58A]/35 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{cfg.playAgainText}</span>
        </button>
      </div>

      {/* Yıldız Haritası */}
      <div className="relative w-full h-[340px] sm:h-[380px] rounded-3xl bg-[radial-gradient(ellipse_at_center,#1E0B2C_0%,#07040F_85%)] border border-[#F5D58A]/25 overflow-hidden select-none">
        {stars.map((s) => (
          <motion.button
            key={s.id}
            type="button"
            onClick={() => handleStarTap(s)}
            animate={{
              y: [0, -8, 0, 6, 0],
              scale: s.isSecretGolden ? [1, 1.22, 1] : [1, 1.08, 1],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
            }}
            aria-label={s.isSecretGolden ? "Gizli altın yıldız" : "Parlayan yıldız"}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer touch-manipulation transition-shadow ${
              s.isSecretGolden
                ? "bg-[#F5D58A]/15 shadow-[0_0_28px_rgba(245,213,138,0.75)] border border-[#F5D58A]/50"
                : "bg-[#FFF8FC]/5 hover:bg-[#FF91B5]/15"
            }`}
          >
            <Star
              style={{ width: s.size, height: s.size }}
              className={
                s.isSecretGolden
                  ? "text-[#F5D58A] fill-[#F5D58A] drop-shadow-[0_0_12px_rgba(245,213,138,0.95)]"
                  : "text-[#FFF8FC]/80 fill-[#FF91B5]/40"
              }
            />
          </motion.button>
        ))}

        {/* Doğru Yıldız Bulunduğunda Işık Patlaması Ekranı */}
        <AnimatePresence>
          {found && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[radial-gradient(circle_at_center,rgba(245,213,138,0.28)_0%,rgba(8,6,17,0.92)_75%)] backdrop-blur-md"
            >
              <motion.div
                initial={{ rotate: -20, scale: 0.5 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 14 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F5D58A] via-[#FF91B5] to-[#E83E70] p-0.5 shadow-[0_0_60px_rgba(245,213,138,0.9)] mb-5 flex items-center justify-center"
              >
                <div className="w-full h-full rounded-full bg-[#12071D] flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-[#F5D58A]" />
                </div>
              </motion.div>

              <h4 className="font-serif font-bold text-3xl sm:text-5xl bg-gradient-to-r from-[#FFF8FC] via-[#F5D58A] to-[#FF91B5] bg-clip-text text-transparent drop-shadow-[0_2px_25px_rgba(245,213,138,0.6)]">
                {cfg.finalMessage}
              </h4>

              <button
                type="button"
                onClick={generateStarField}
                className="mt-7 inline-flex items-center gap-2 px-7 py-3.5 min-h-[50px] rounded-full text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold text-[#080611] bg-gradient-to-r from-[#F5D58A] to-[#FF91B5] shadow-[0_0_30px_rgba(245,213,138,0.5)] cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{UNIVERSE_CONFIG.gamesSection.playAgainButtonText}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================================
 * 3. OYUN: KALBİN ŞİFRESİ (3 AŞAMALI ROMANTİK BİLMECE)
 * ========================================================================== */
function HeartCipherGame() {
  const cfg = UNIVERSE_CONFIG.gamesSection.heartCipher;
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStage = cfg.stages[currentStageIdx];

  const handleSelectOption = (optionIndex: number) => {
    if (isCompleted) return;

    if (optionIndex === currentStage.correctIndex) {
      setHintMessage(null);
      const nextUnlocked = unlockedCount + 1;
      setUnlockedCount(nextUnlocked);

      if (currentStageIdx + 1 < cfg.stages.length) {
        setCurrentStageIdx((prev) => prev + 1);
      } else {
        setIsCompleted(true);
        confetti({
          particleCount: 80,
          spread: 110,
          origin: { y: 0.6 },
          colors: ["#E83E70", "#FF91B5", "#F5D58A", "#FFF8FC"],
        });
      }
    } else {
      setHintMessage(currentStage.hint);
    }
  };

  const resetCipher = () => {
    setCurrentStageIdx(0);
    setUnlockedCount(0);
    setHintMessage(null);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık ve 3 Kilit Göstergesi */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F5D58A]/20">
        <div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#FFF8FC] font-semibold">
            {cfg.cardTitle}
          </h3>
          <p className="text-xs sm:text-sm text-[#FFF8FC]/70">
            {cfg.cardSubtitle}
          </p>
        </div>

        {/* 3 Kilit İkonu */}
        <div className="flex items-center gap-2.5">
          {cfg.stages.map((stage, idx) => {
            const isUnlocked = idx < unlockedCount;
            return (
              <motion.div
                key={stage.id}
                animate={isUnlocked ? { scale: [1, 1.2, 1] } : {}}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-medium ${
                  isUnlocked
                    ? "bg-[#F5D58A]/20 border-[#F5D58A] text-[#F5D58A] shadow-[0_0_20px_rgba(245,213,138,0.4)]"
                    : "bg-[#160924] border-[#FFF8FC]/20 text-[#FFF8FC]/50"
                }`}
              >
                {isUnlocked ? (
                  <Unlock className="w-4 h-4 text-[#F5D58A]" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>
                  {cfg.stagePrefix} {idx + 1}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bilmece Kartı veya Açılan Sürpriz Mektup */}
      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key={`stage-${currentStage.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="p-6 sm:p-8 rounded-3xl bg-[radial-gradient(circle_at_top,#2B0C21_0%,#0D0618_85%)] border border-[#F5D58A]/25 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#4A102D]/60 border border-[#F5D58A]/30 text-xs uppercase tracking-[0.2em] text-[#F5D58A]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {cfg.stagePrefix} {currentStageIdx + 1} / {cfg.stages.length}
              </span>
            </div>

            <h4 className="font-serif text-2xl sm:text-3xl text-[#FFF8FC] leading-relaxed">
              {currentStage.question}
            </h4>

            <div className="grid grid-cols-1 gap-3.5">
              {currentStage.options.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className="w-full text-left px-6 py-4 min-h-[56px] rounded-2xl bg-[#160A26]/85 hover:bg-[#4A102D]/75 border border-[#F5D58A]/30 hover:border-[#F5D58A] text-base sm:text-lg text-[#FFF8FC] font-medium flex items-center justify-between gap-4 transition-all active:scale-[0.99] cursor-pointer"
                >
                  <span>{option}</span>
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-[#F5D58A]/50" />
                </button>
              ))}
            </div>

            {hintMessage && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-[#4A102D]/50 border border-[#FF91B5]/40 text-sm sm:text-base text-[#FF91B5] font-serif italic"
              >
                {hintMessage}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="cipher-completed-letter"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#2B0C20] via-[#160822] to-[#0B0514] border-2 border-[#F5D58A]/60 shadow-[0_0_60px_rgba(232,62,112,0.35)] text-center space-y-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#F5D58A] to-[#E83E70] p-0.5 shadow-[0_0_45px_rgba(245,213,138,0.7)]">
              <div className="w-full h-full rounded-full bg-[#12071D] flex items-center justify-center">
                <MailOpen className="w-9 h-9 text-[#F5D58A]" />
              </div>
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="inline-block px-4 py-1 rounded-full bg-[#4A102D]/70 border border-[#F5D58A]/40 text-xs uppercase tracking-[0.22em] text-[#F5D58A]">
                {cfg.unlockedBadge}
              </span>

              <h4 className="font-serif font-bold text-2xl sm:text-4xl md:text-5xl bg-gradient-to-r from-[#FFF8FC] via-[#F5D58A] to-[#FF91B5] bg-clip-text text-transparent leading-tight">
                {cfg.finalMessage}
              </h4>

              <p className="font-serif italic text-xl sm:text-2xl text-[#FFF8FC]/85 pt-2">
                {cfg.finalLetterSubtext}
              </p>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={resetCipher}
                className="inline-flex items-center gap-2 px-7 py-3.5 min-h-[50px] rounded-full text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold text-[#F5D58A] bg-[#4A102D]/70 hover:bg-[#E83E70] hover:text-[#FFF8FC] border border-[#F5D58A]/45 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{UNIVERSE_CONFIG.gamesSection.playAgainButtonText}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
