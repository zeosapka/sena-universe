import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { CosmicBackground } from "./components/CosmicBackground";
import { TouchHeartBursts } from "./components/TouchHeartBursts";
import { MusicPlayer } from "./components/MusicPlayer";
import { FlowerBloomIntro } from "./components/FlowerBloomIntro";
import { OpeningPortal } from "./components/OpeningPortal";
import { HeroCelebration } from "./components/HeroCelebration";
import { BirthdayCountdown } from "./components/BirthdayCountdown";
import { InteractiveLoveLetter } from "./components/InteractiveLoveLetter";
import { FireworksCelebration } from "./components/FireworksCelebration";
import { OurLittleMoments } from "./components/OurLittleMoments";
import { SenaGameCorner } from "./components/SenaGameCorner";
import { SenaSurpriseGifts } from "./components/SenaSurpriseGifts";
import { FinalSurprise } from "./components/FinalSurprise";
import { UNIVERSE_CONFIG } from "./config/universeConfig";
import { useViewportMetrics } from "./hooks/useViewportMetrics";

export function App() {
  const [hasFlowerBloomed, setHasFlowerBloomed] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  useViewportMetrics();

  return (
    <div className="relative w-full max-w-full min-h-[100dvh] overflow-x-hidden bg-[radial-gradient(circle_at_50%_42%,#4A102D_0%,#160618_58%,#080611_100%)] text-[#FFF8FC] selection:bg-[#E83E70]/40 selection:text-[#FFF8FC]">
      {/* Persistent Cosmic Starfield & Rising Hearts */}
      <CosmicBackground />

      {/* Interactive Touch / Tap Heart Bursts */}
      <TouchHeartBursts />

      {/* Optional Romantic Music Box / MP3 Player (Never autoplays) */}
      <MusicPlayer />

      {/* 0. Initial Procedural Flower Blooming Layer (Plays once before OpeningPortal) */}
      {!hasFlowerBloomed && (
        <FlowerBloomIntro onComplete={() => setHasFlowerBloomed(true)} />
      )}

      {/* First Impression Fullscreen Portal */}
      {hasFlowerBloomed && !hasEntered && (
        <OpeningPortal onEnterUniverse={() => setHasEntered(true)} />
      )}

      {/* Main Universe Experience */}
      {hasEntered && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="relative z-10 w-full max-w-full overflow-x-hidden pb-16"
        >
          {/* 1. Hero Celebration Screen */}
          <HeroCelebration />

          {/* Ornamental Divider */}
          <div className="flex items-center justify-center gap-4 max-w-xs mx-auto opacity-50">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#F5D58A]" />
            <Sparkles className="w-4 h-4 text-[#F5D58A]" />
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#F5D58A]" />
          </div>

          {/* 2. Real-Time Birthday Countdown to 21 Nov 2026 */}
          <BirthdayCountdown />

          {/* 3. Interactive Golden Wax-Sealed Love Letter */}
          <InteractiveLoveLetter />

          {/* 4. Fullscreen Make A Wish Fireworks Celebration */}
          <FireworksCelebration />

          {/* 5. Our Little Moments 3D Gallery */}
          <OurLittleMoments />

          {/* 5.5. Sena'nın Oyun Köşesi (Mini Games) */}
          <SenaGameCorner />

          {/* 5.8. Sena'nın Küçük Sürprizleri (5 İnteraktif Hediye Kutusu) */}
          <SenaSurpriseGifts />

          {/* 6. Final Surprise Button & Finale */}
          <FinalSurprise />

          {/* Romantic Footer */}
          <footer className="relative z-10 pt-12 pb-8 px-6 text-center border-t border-[#F5D58A]/15 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#F5D58A]/80">
              <span>{UNIVERSE_CONFIG.siteTitle}</span>
              <Heart className="w-3.5 h-3.5 text-[#E83E70] fill-[#E83E70]" />
              <span>{UNIVERSE_CONFIG.birthdayDisplayDate}</span>
            </div>
          </footer>
        </motion.main>
      )}
    </div>
  );
}

export default App;
