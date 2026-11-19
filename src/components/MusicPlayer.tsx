import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music, SkipForward } from "lucide-react";
import { UNIVERSE_CONFIG } from "../config/universeConfig";

const MASTER_VOLUME = 0.68;

export function MusicPlayer() {
  const playlist = UNIVERSE_CONFIG.musicPlaylist;
  const crossfadeDurationSec = UNIVERSE_CONFIG.crossfadeSeconds || 5.5;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isCrossfading, setIsCrossfading] = useState(false);

  // Çift Deck (Deck A & Deck B) ile DJ tarzı kesintisiz yumuşak Crossfade (Fade-Out + Fade-In) motoru
  const deckARef = useRef<HTMLAudioElement | null>(null);
  const deckBRef = useRef<HTMLAudioElement | null>(null);
  const activeDeckKeyRef = useRef<"A" | "B">("A");

  const isPlayingRef = useRef(false);
  const isMutedRef = useRef(false);
  const manualPauseRef = useRef(false);
  const currentTrackIndexRef = useRef(0);
  const isCrossfadingRef = useRef(false);

  const fadeTimerRef = useRef<number | null>(null);
  const monitorTimerRef = useRef<number | null>(null);

  const getDeck = (key: "A" | "B"): HTMLAudioElement | null => {
    return key === "A" ? deckARef.current : deckBRef.current;
  };

  const clearFadeTimer = () => {
    if (fadeTimerRef.current !== null) {
      window.clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  };

  // Türkçe karakterler ve boşluklar içeren dosya yollarını güvenli göreceli URI haline getirir
  const getSafeAudioUrl = (rawSrc: string): string => {
    const normalizedSrc = rawSrc.startsWith("/") ? rawSrc.slice(1) : rawSrc;
    return encodeURI(`./${normalizedSrc}`);
  };

  /**
   * Aktif şarkıdan sıradaki şarkıya yumuşak (Crossfade) geçiş yapar:
   * Çalan şarkının sesi yavaşça kısılırken (fade-out), yeni şarkı aynı anda yavaşça yükselerek (fade-in) girer.
   */
  const triggerSmoothCrossfade = (targetIndex?: number) => {
    if (playlist.length <= 1) return;

    const nextIndex =
      typeof targetIndex === "number"
        ? targetIndex % playlist.length
        : (currentTrackIndexRef.current + 1) % playlist.length;

    const outgoingKey = activeDeckKeyRef.current;
    const incomingKey: "A" | "B" = outgoingKey === "A" ? "B" : "A";

    const outgoingDeck = getDeck(outgoingKey);
    const incomingDeck = getDeck(incomingKey);
    if (!outgoingDeck || !incomingDeck) return;

    clearFadeTimer();
    isCrossfadingRef.current = true;
    setIsCrossfading(true);

    const nextTrack = playlist[nextIndex];
    const targetSrc = getSafeAudioUrl(nextTrack.src);

    incomingDeck.src = targetSrc;
    incomingDeck.muted = isMutedRef.current;
    incomingDeck.volume = 0.01;

    const startIncomingPlayback = () => {
      try {
        if (nextTrack.startAtSeconds > 0) {
          incomingDeck.currentTime = nextTrack.startAtSeconds;
        } else {
          incomingDeck.currentTime = 0;
        }
      } catch {
        // Metadata henüz yüklenmediyse 0'dan başlar
      }

      incomingDeck
        .play()
        .then(() => {
          activeDeckKeyRef.current = incomingKey;
          currentTrackIndexRef.current = nextIndex;
          setCurrentTrackIndex(nextIndex);
          isPlayingRef.current = true;
          setIsPlaying(true);

          const startOutVol = outgoingDeck.volume;
          const totalSteps = Math.max(20, Math.round((crossfadeDurationSec * 1000) / 60));
          let step = 0;

          fadeTimerRef.current = window.setInterval(() => {
            step += 1;
            const progress = Math.min(1, step / totalSteps);
            // Yumuşak S-eğrisi (Cosine / Equal-Power) geçişi
            const smoothT = 0.5 - 0.5 * Math.cos(progress * Math.PI);

            outgoingDeck.volume = Math.max(0, startOutVol * (1 - smoothT));
            incomingDeck.volume = Math.min(MASTER_VOLUME, MASTER_VOLUME * smoothT);

            if (progress >= 1) {
              clearFadeTimer();
              outgoingDeck.pause();
              outgoingDeck.volume = 0;
              incomingDeck.volume = MASTER_VOLUME;
              isCrossfadingRef.current = false;
              setIsCrossfading(false);
            }
          }, 60);
        })
        .catch(() => {
          isCrossfadingRef.current = false;
          setIsCrossfading(false);
        });
    };

    if (incomingDeck.readyState >= 1) {
      startIncomingPlayback();
    } else {
      const onLoadedMeta = () => {
        incomingDeck.removeEventListener("loadedmetadata", onLoadedMeta);
        startIncomingPlayback();
      };
      incomingDeck.addEventListener("loadedmetadata", onLoadedMeta);
      incomingDeck.load();
    }
  };

  /**
   * İlk açılışta (veya duraklatıldıktan sonra devam edildiğinde) aktif şarkıyı yumuşak fade-in ile başlatır
   */
  const ensureCollageStarted = () => {
    if (manualPauseRef.current || isPlayingRef.current) return;

    const activeDeck = getDeck(activeDeckKeyRef.current);
    if (!activeDeck || playlist.length === 0) return;

    const currentTrack = playlist[currentTrackIndexRef.current];
    const expectedUrl = getSafeAudioUrl(currentTrack.src);

    if (!activeDeck.src || !activeDeck.src.endsWith(encodeURI(currentTrack.src))) {
      activeDeck.src = expectedUrl;
      if (currentTrack.startAtSeconds > 0) {
        try {
          activeDeck.currentTime = currentTrack.startAtSeconds;
        } catch {
          // ignore before metadata
        }
      }
    }

    activeDeck.muted = isMutedRef.current;
    activeDeck.volume = 0.04;

    activeDeck
      .play()
      .then(() => {
        isPlayingRef.current = true;
        setIsPlaying(true);

        // 2.2 saniyelik zarif başlangıç fade-in
        clearFadeTimer();
        const fadeSteps = 28;
        let step = 0;
        fadeTimerRef.current = window.setInterval(() => {
          step += 1;
          const p = Math.min(1, step / fadeSteps);
          activeDeck.volume = MASTER_VOLUME * p;
          if (p >= 1) {
            clearFadeTimer();
          }
        }, 75);
      })
      .catch(() => {
        // Tarayıcı ilk tıklamayı bekliyorsa false kalır, ilk tıklamada anında başlar
        isPlayingRef.current = false;
        setIsPlaying(false);
      });
  };

  const togglePlayback = () => {
    const activeDeck = getDeck(activeDeckKeyRef.current);
    const isActuallyPlaying =
      isPlayingRef.current && activeDeck && !activeDeck.paused;

    if (isActuallyPlaying) {
      manualPauseRef.current = true;
      isPlayingRef.current = false;
      clearFadeTimer();
      deckARef.current?.pause();
      deckBRef.current?.pause();
      isCrossfadingRef.current = false;
      setIsCrossfading(false);
      setIsPlaying(false);
    } else {
      manualPauseRef.current = false;
      ensureCollageStarted();
    }
  };

  const handleNextTrackClick = () => {
    manualPauseRef.current = false;
    if (!isPlayingRef.current) {
      ensureCollageStarted();
      return;
    }
    triggerSmoothCrossfade();
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    isMutedRef.current = nextMuted;
    if (deckARef.current) deckARef.current.muted = nextMuted;
    if (deckBRef.current) deckBRef.current.muted = nextMuted;
  };

  useEffect(() => {
    // Sayfa açıldığında hemen başlatmayı dene; tarayıcı otomatik sesi engellerse
    // kullanıcının ekrana ilk dokunuşunda milisaniyesinde yumuşak fade-in ile başlat
    ensureCollageStarted();

    const unlockOnFirstInteraction = () => {
      if (manualPauseRef.current || isPlayingRef.current) return;
      ensureCollageStarted();
    };

    window.addEventListener("pointerdown", unlockOnFirstInteraction, {
      passive: true,
    });
    window.addEventListener("touchstart", unlockOnFirstInteraction, {
      passive: true,
    });
    window.addEventListener("click", unlockOnFirstInteraction, {
      passive: true,
    });
    window.addEventListener("keydown", unlockOnFirstInteraction, {
      passive: true,
    });

    // Kolaj zamanlayıcısı: Her şarkı belirlenen kolaj süresinin (veya şarkı sonunun)
    // bitimine crossfadeSeconds kala sıradaki şarkıya otomatik yumuşak geçiş yapar
    monitorTimerRef.current = window.setInterval(() => {
      if (
        !isPlayingRef.current ||
        manualPauseRef.current ||
        isCrossfadingRef.current
      ) {
        return;
      }

      const activeDeck = getDeck(activeDeckKeyRef.current);
      if (!activeDeck || activeDeck.paused) return;

      const track = playlist[currentTrackIndexRef.current];
      const startSec = track.startAtSeconds || 0;
      const excerptLen = track.excerptDurationSeconds || 75;
      const elapsedInExcerpt = activeDeck.currentTime - startSec;

      const remainingInFile =
        Number.isFinite(activeDeck.duration) && activeDeck.duration > 0
          ? activeDeck.duration - activeDeck.currentTime
          : 999;

      if (
        elapsedInExcerpt >= excerptLen - crossfadeDurationSec ||
        remainingInFile <= crossfadeDurationSec + 0.5
      ) {
        triggerSmoothCrossfade();
      }
    }, 250);

    return () => {
      window.removeEventListener("pointerdown", unlockOnFirstInteraction);
      window.removeEventListener("touchstart", unlockOnFirstInteraction);
      window.removeEventListener("click", unlockOnFirstInteraction);
      window.removeEventListener("keydown", unlockOnFirstInteraction);
      clearFadeTimer();
      if (monitorTimerRef.current !== null) {
        window.clearInterval(monitorTimerRef.current);
      }
    };
  }, []);

  const activeTrack = playlist[currentTrackIndex] || playlist[0];

  return (
    <div
      className="fixed top-4 left-4 sm:top-5 sm:left-6 md:top-6 md:left-8 z-[60] flex items-center gap-1.5 sm:gap-2 max-w-[calc(100vw-7.5rem)]"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingLeft: "env(safe-area-inset-left, 0px)",
      }}
    >
      {/* Çift Deck Gerçek MP3 Oynatıcıları */}
      <audio
        ref={deckARef}
        preload="auto"
        onEnded={() => {
          if (!isCrossfadingRef.current) triggerSmoothCrossfade();
        }}
      />
      <audio
        ref={deckBRef}
        preload="auto"
        onEnded={() => {
          if (!isCrossfadingRef.current) triggerSmoothCrossfade();
        }}
      />

      {/* Ana Oynat / Duraklat & Şarkı Bilgisi Butonu */}
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={
          isPlaying
            ? UNIVERSE_CONFIG.musicPlayer.pauseAriaLabel
            : UNIVERSE_CONFIG.musicPlayer.playAriaLabel
        }
        className="group flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 min-h-[46px] sm:min-h-[48px] rounded-full bg-[#12091E]/85 backdrop-blur-xl border border-[#F5D58A]/35 text-[#FFF8FC] shadow-[0_0_25px_rgba(232,62,112,0.28)] hover:border-[#F5D58A]/75 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        <span
          className={`relative flex items-center justify-center w-7 h-7 shrink-0 rounded-full ${
            isPlaying
              ? "bg-gradient-to-tr from-[#E83E70] to-[#F5D58A] text-[#080611]"
              : "bg-[#4A102D]/70 text-[#FF91B5]"
          } transition-colors`}
        >
          <Music className="w-3.5 h-3.5" />
          {isPlaying && !isMuted && (
            <span className="absolute inset-0 rounded-full border border-[#F5D58A] animate-ping opacity-50" />
          )}
        </span>

        <div className="text-left pr-1 min-w-0">
          <p className="text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-[#F5D58A] truncate">
            {isPlaying
              ? `${currentTrackIndex + 1}/${playlist.length} • ${
                  isCrossfading
                    ? "Yumuşak Geçiş..."
                    : UNIVERSE_CONFIG.musicPlayer.playingLabel
                }`
              : UNIVERSE_CONFIG.musicPlayer.pausedLabel}
          </p>
          <p className="text-[11px] sm:text-xs text-[#FFF8FC]/85 max-w-[140px] sm:max-w-[205px] truncate font-medium">
            {activeTrack?.title || UNIVERSE_CONFIG.musicTrackTitle}
          </p>
        </div>

        {/* Hareketli Ekolayzer Çubukları */}
        {isPlaying && !isMuted && (
          <div
            className="flex items-end gap-0.5 h-3.5 ml-0.5 shrink-0"
            aria-hidden="true"
          >
            <span className="w-0.5 bg-[#FF91B5] animate-[pulse_0.8s_ease-in-out_infinite] h-3" />
            <span className="w-0.5 bg-[#F5D58A] animate-[pulse_1.1s_ease-in-out_infinite] h-2" />
            <span className="w-0.5 bg-[#E83E70] animate-[pulse_0.6s_ease-in-out_infinite] h-3.5" />
          </div>
        )}
      </button>

      {/* Sıradaki Şarkıya Yumuşak Geçiş (Crossfade) Butonu */}
      {isPlaying && playlist.length > 1 && (
        <button
          type="button"
          onClick={handleNextTrackClick}
          title="Sıradaki şarkıya yumuşak geçiş yap"
          aria-label={UNIVERSE_CONFIG.musicPlayer.nextTrackAriaLabel}
          className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full bg-[#12091E]/85 backdrop-blur-xl border border-[#F5D58A]/30 text-[#F5D58A] hover:border-[#F5D58A]/75 hover:text-[#FFF8FC] active:scale-95 transition-all cursor-pointer"
        >
          <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}

      {/* Sesi Aç / Kapat Butonu */}
      {isPlaying && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={
            isMuted
              ? UNIVERSE_CONFIG.musicPlayer.unmuteAriaLabel
              : UNIVERSE_CONFIG.musicPlayer.muteAriaLabel
          }
          className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full bg-[#12091E]/85 backdrop-blur-xl border border-[#F5D58A]/30 text-[#FFF8FC] hover:border-[#F5D58A]/75 active:scale-95 transition-all cursor-pointer"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-[#FF91B5]" />
          ) : (
            <Volume2 className="w-5 h-5 text-[#F5D58A]" />
          )}
        </button>
      )}
    </div>
  );
}
