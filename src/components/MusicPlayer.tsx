import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music, SkipForward } from "lucide-react";
import { UNIVERSE_CONFIG } from "../config/universeConfig";

const MASTER_VOLUME = 0.68;

export function MusicPlayer() {
  const playlist = UNIVERSE_CONFIG.musicPlaylist;
  const crossfadeDurationSec = UNIVERSE_CONFIG.crossfadeSeconds || 6.0;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isCrossfading, setIsCrossfading] = useState(false);

  // Çift Deck (Deck A & Deck B) — Yön değişiminde (Portrait <-> Landscape) asla yeniden oluşturulmaz
  const deckARef = useRef<HTMLAudioElement | null>(null);
  const deckBRef = useRef<HTMLAudioElement | null>(null);
  const activeDeckKeyRef = useRef<"A" | "B">("A");

  // Hangi deck'te hangi şarkının yüklü olduğunu takip eder (gereksiz src sıfırlamasını önler)
  const loadedTrackDeckARef = useRef<number | null>(null);
  const loadedTrackDeckBRef = useRef<number | null>(null);

  const isPlayingRef = useRef(false);
  const isStartingPromiseRef = useRef(false);
  const isMutedRef = useRef(false);
  const manualPauseRef = useRef(false);
  const currentTrackIndexRef = useRef(0);
  const isCrossfadingRef = useRef(false);

  const fadeTimerRef = useRef<number | null>(null);
  const monitorTimerRef = useRef<number | null>(null);

  const getDeck = (key: "A" | "B"): HTMLAudioElement | null => {
    return key === "A" ? deckARef.current : deckBRef.current;
  };

  const getLoadedTrackRef = (key: "A" | "B") => {
    return key === "A" ? loadedTrackDeckARef : loadedTrackDeckBRef;
  };

  const getTrackTargetVolume = (index: number): number => {
    const track = playlist[index];
    const scale =
      track && "volumeScale" in track && typeof track.volumeScale === "number"
        ? track.volumeScale
        : 1.0;
    return Math.max(0, Math.min(1, MASTER_VOLUME * scale));
  };

  const setDeckVolumeSafe = (deck: HTMLAudioElement | null, vol: number) => {
    if (!deck) return;
    try {
      deck.volume = Math.max(0, Math.min(1, vol));
    } catch {
      // iOS/iPadOS donanım ses kontrolü kısıtlamalarında hata fırlatmasını engelle
    }
  };

  const clearFadeTimer = () => {
    if (fadeTimerRef.current !== null) {
      window.clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  };

  const getSafeAudioUrl = (rawSrc: string): string => {
    const normalizedSrc = rawSrc.startsWith("/") ? rawSrc.slice(1) : rawSrc;
    return encodeURI(`./${normalizedSrc}`);
  };

  /**
   * Belirtilen deck içine şarkıyı yalnızca henüz yüklenmemişse yükler (mevcut currentTime'ı sıfırlamaz!)
   */
  const ensureTrackLoadedOnDeck = (key: "A" | "B", trackIdx: number) => {
    const deck = getDeck(key);
    const loadedRef = getLoadedTrackRef(key);
    if (!deck || !playlist[trackIdx]) return;

    if (loadedRef.current !== trackIdx) {
      const track = playlist[trackIdx];
      deck.src = getSafeAudioUrl(track.src);
      loadedRef.current = trackIdx;
      try {
        deck.load();
        if (track.startAtSeconds > 0) {
          deck.currentTime = track.startAtSeconds;
        }
      } catch {
        // metadata yüklendiğinde ayarlanır
      }
    }
  };

  /**
   * Aktif şarkıdan sıradaki şarkıya yumuşak (Crossfade) geçiş yapar
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
    const incomingTargetVol = getTrackTargetVolume(nextIndex);

    // Yeni şarkıyı incomingDeck'e yükle
    const incomingLoadedRef = getLoadedTrackRef(incomingKey);
    incomingDeck.src = getSafeAudioUrl(nextTrack.src);
    incomingLoadedRef.current = nextIndex;
    incomingDeck.muted = isMutedRef.current;
    setDeckVolumeSafe(incomingDeck, 0.02);

    const startIncomingPlayback = () => {
      try {
        incomingDeck.currentTime =
          nextTrack.startAtSeconds > 0 ? nextTrack.startAtSeconds : 0;
      } catch {
        // ignore before metadata
      }

      incomingDeck
        .play()
        .then(() => {
          activeDeckKeyRef.current = incomingKey;
          currentTrackIndexRef.current = nextIndex;
          setCurrentTrackIndex(nextIndex);
          isPlayingRef.current = true;
          setIsPlaying(true);

          const startOutVol =
            outgoingDeck.volume ||
            getTrackTargetVolume(currentTrackIndexRef.current);
          const totalSteps = Math.max(
            24,
            Math.round((crossfadeDurationSec * 1000) / 60)
          );
          let step = 0;

          fadeTimerRef.current = window.setInterval(() => {
            step += 1;
            const progress = Math.min(1, step / totalSteps);
            const smoothT = 0.5 - 0.5 * Math.cos(progress * Math.PI);

            setDeckVolumeSafe(outgoingDeck, startOutVol * (1 - smoothT));
            setDeckVolumeSafe(incomingDeck, incomingTargetVol * smoothT);

            if (progress >= 1) {
              clearFadeTimer();
              outgoingDeck.pause();
              setDeckVolumeSafe(outgoingDeck, 0);
              setDeckVolumeSafe(incomingDeck, incomingTargetVol);
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
   * Müziği gerçek kullanıcı etkileşimi (veya izin verilen autoplay) ile güvenli başlatır.
   * Eşzamanlı pointerdown/touchstart/click çakışmalarını isStartingPromiseRef ile engeller.
   */
  const startPlaybackSafe = () => {
    if (manualPauseRef.current) return;

    const activeKey = activeDeckKeyRef.current;
    const activeDeck = getDeck(activeKey);
    if (!activeDeck || playlist.length === 0) return;

    // Zaten gerçekten sesli çalıyorsa tekrar başlatma
    if (isPlayingRef.current && !activeDeck.paused) {
      return;
    }

    // Bir play() Promise'i halen devam ediyorsa ikinci kez çağırıp AbortError oluşturma
    if (isStartingPromiseRef.current) {
      return;
    }

    const trackIdx = currentTrackIndexRef.current;
    ensureTrackLoadedOnDeck(activeKey, trackIdx);
    const targetVol = getTrackTargetVolume(trackIdx);

    activeDeck.muted = isMutedRef.current;
    setDeckVolumeSafe(activeDeck, 0.08);
    isStartingPromiseRef.current = true;

    const playPromise = activeDeck.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isStartingPromiseRef.current = false;
          if (manualPauseRef.current) {
            activeDeck.pause();
            return;
          }
          isPlayingRef.current = true;
          setIsPlaying(true);

          // Yumuşak fade-in
          clearFadeTimer();
          const fadeSteps = 24;
          let step = 0;
          fadeTimerRef.current = window.setInterval(() => {
            step += 1;
            const p = Math.min(1, step / fadeSteps);
            setDeckVolumeSafe(activeDeck, targetVol * p);
            if (p >= 1) {
              clearFadeTimer();
            }
          }, 75);
        })
        .catch(() => {
          // Tarayıcı autoplay politikası nedeniyle ilk dokunuşu bekliyorsa sessizce hazır bekle
          isStartingPromiseRef.current = false;
          isPlayingRef.current = false;
          setIsPlaying(false);
        });
    } else {
      isStartingPromiseRef.current = false;
    }
  };

  const togglePlayback = () => {
    const activeDeck = getDeck(activeDeckKeyRef.current);
    const isActuallyPlaying =
      isPlayingRef.current && activeDeck !== null && !activeDeck.paused;

    if (isActuallyPlaying) {
      manualPauseRef.current = true;
      isPlayingRef.current = false;
      isStartingPromiseRef.current = false;
      clearFadeTimer();
      deckARef.current?.pause();
      deckBRef.current?.pause();
      isCrossfadingRef.current = false;
      setIsCrossfading(false);
      setIsPlaying(false);
    } else {
      manualPauseRef.current = false;
      startPlaybackSafe();
    }
  };

  const handleNextTrackClick = () => {
    manualPauseRef.current = false;
    const activeDeck = getDeck(activeDeckKeyRef.current);
    if (!isPlayingRef.current || !activeDeck || activeDeck.paused) {
      startPlaybackSafe();
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
    // 1. İlk şarkıyı Deck A üzerine önceden hazırla (dikey ve yatay açılışta aynı şekilde initialize edilir)
    ensureTrackLoadedOnDeck("A", 0);

    // 2. Tarayıcı izin veriyorsa başlatmayı dene; izin vermiyorsa (iPad Safari/Chrome autoplay kilidi)
    // isPlaying = false ("Şarkımızı Başlat") olarak kalır ve ilk gerçek dokunuşta %100 başlar.
    const initTimer = window.setTimeout(() => {
      startPlaybackSafe();
    }, 60);

    // 3. Kullanıcı siteye ilk dokunduğunda (dikey veya yatay fark etmeksizin) müziği güvenle başlat.
    // ÖNEMLİ: Eğer kullanıcı doğrudan müzik kontrol butonuna dokunduysa, butonun kendi onClick'i
    // ile çakışmaması için data-music-control kontrolü yapılır!
    const handleFirstUserGesture = (e: Event) => {
      if (manualPauseRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target && target.closest("[data-music-control='true']")) {
        return;
      }

      const activeDeck = getDeck(activeDeckKeyRef.current);
      if (!isPlayingRef.current || !activeDeck || activeDeck.paused) {
        startPlaybackSafe();
      }
    };

    // capture: true sayesinde e.stopPropagation() kullanan butonlara (örn. "Kasımpatının Kalbine Dokun")
    // dokunulduğunda bile ilk kullanıcı etkileşimi yakalanır ve iPadOS ses kilidi anında açılır!
    window.addEventListener("pointerdown", handleFirstUserGesture, {
      capture: true,
      passive: true,
    });
    window.addEventListener("touchend", handleFirstUserGesture, {
      capture: true,
      passive: true,
    });
    window.addEventListener("click", handleFirstUserGesture, {
      capture: true,
      passive: true,
    });
    window.addEventListener("keydown", handleFirstUserGesture, {
      capture: true,
      passive: true,
    });

    // 4. Gerçek Audio State Senkronizasyonu ve Tam Süreli Şarkı Geçiş İzleyicisi
    monitorTimerRef.current = window.setInterval(() => {
      const activeDeck = getDeck(activeDeckKeyRef.current);
      if (!activeDeck) return;

      // Eğer UI "Çalıyor" gösteriyor ama tarayıcı sesi duraklattıysa state'i gerçek duruma eşitle
      if (
        isPlayingRef.current &&
        !isCrossfadingRef.current &&
        !isStartingPromiseRef.current &&
        activeDeck.paused
      ) {
        isPlayingRef.current = false;
        setIsPlaying(false);
        return;
      }

      if (
        !isPlayingRef.current ||
        manualPauseRef.current ||
        isCrossfadingRef.current ||
        activeDeck.paused
      ) {
        return;
      }

      const track = playlist[currentTrackIndexRef.current];
      const startSec = track.startAtSeconds || 0;
      const fullPlayLen = track.excerptDurationSeconds || 230;
      const elapsedInTrack = activeDeck.currentTime - startSec;

      const hasValidDuration =
        Number.isFinite(activeDeck.duration) && activeDeck.duration > 30;
      const remainingInFile = hasValidDuration
        ? activeDeck.duration - activeDeck.currentTime
        : fullPlayLen - elapsedInTrack;

      if (
        remainingInFile <= crossfadeDurationSec + 0.8 ||
        elapsedInTrack >= fullPlayLen - crossfadeDurationSec
      ) {
        triggerSmoothCrossfade();
      }
    }, 350);

    return () => {
      window.clearTimeout(initTimer);
      window.removeEventListener("pointerdown", handleFirstUserGesture, {
        capture: true,
      });
      window.removeEventListener("touchend", handleFirstUserGesture, {
        capture: true,
      });
      window.removeEventListener("click", handleFirstUserGesture, {
        capture: true,
      });
      window.removeEventListener("keydown", handleFirstUserGesture, {
        capture: true,
      });
      clearFadeTimer();
      if (monitorTimerRef.current !== null) {
        window.clearInterval(monitorTimerRef.current);
      }
    };
  }, []);

  const activeTrack = playlist[currentTrackIndex] || playlist[0];

  return (
    <div
      data-music-control="true"
      className="fixed top-3.5 left-3.5 sm:top-4 sm:left-5 md:top-5 md:left-6 z-[60] flex items-center gap-1.5 sm:gap-2 max-w-[calc(100vw-8.5rem)]"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingLeft: "env(safe-area-inset-left, 0px)",
      }}
    >
      {/* Çift Deck Gerçek MP3 Oynatıcıları */}
      <audio
        ref={deckARef}
        preload="metadata"
        playsInline
        onPlay={() => {
          if (activeDeckKeyRef.current === "A") {
            isPlayingRef.current = true;
            setIsPlaying(true);
          }
        }}
        onPause={() => {
          if (
            activeDeckKeyRef.current === "A" &&
            !isCrossfadingRef.current &&
            !isStartingPromiseRef.current
          ) {
            isPlayingRef.current = false;
            setIsPlaying(false);
          }
        }}
        onEnded={() => {
          if (!isCrossfadingRef.current) triggerSmoothCrossfade();
        }}
      />
      <audio
        ref={deckBRef}
        preload="metadata"
        playsInline
        onPlay={() => {
          if (activeDeckKeyRef.current === "B") {
            isPlayingRef.current = true;
            setIsPlaying(true);
          }
        }}
        onPause={() => {
          if (
            activeDeckKeyRef.current === "B" &&
            !isCrossfadingRef.current &&
            !isStartingPromiseRef.current
          ) {
            isPlayingRef.current = false;
            setIsPlaying(false);
          }
        }}
        onEnded={() => {
          if (!isCrossfadingRef.current) triggerSmoothCrossfade();
        }}
      />

      {/* Ana Oynat / Duraklat & Şarkı Bilgisi Butonu */}
      <button
        type="button"
        data-music-control="true"
        onClick={togglePlayback}
        aria-label={
          isPlaying
            ? UNIVERSE_CONFIG.musicPlayer.pauseAriaLabel
            : UNIVERSE_CONFIG.musicPlayer.playAriaLabel
        }
        className="group flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 min-h-[46px] sm:min-h-[48px] rounded-full bg-[#12091E]/85 backdrop-blur-xl border border-[#F5D58A]/35 text-[#FFF8FC] shadow-[0_0_25px_rgba(232,62,112,0.28)] hover:border-[#F5D58A]/75 active:scale-95 transition-all duration-300 cursor-pointer touch-manipulation"
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
          <p className="text-[11px] sm:text-xs text-[#FFF8FC]/85 max-w-[135px] sm:max-w-[195px] truncate font-medium">
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
          data-music-control="true"
          onClick={handleNextTrackClick}
          title="Sıradaki şarkıya yumuşak geçiş yap"
          aria-label={UNIVERSE_CONFIG.musicPlayer.nextTrackAriaLabel}
          className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full bg-[#12091E]/85 backdrop-blur-xl border border-[#F5D58A]/30 text-[#F5D58A] hover:border-[#F5D58A]/75 hover:text-[#FFF8FC] active:scale-95 transition-all cursor-pointer touch-manipulation"
        >
          <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}

      {/* Sesi Aç / Kapat Butonu */}
      {isPlaying && (
        <button
          type="button"
          data-music-control="true"
          onClick={toggleMute}
          aria-label={
            isMuted
              ? UNIVERSE_CONFIG.musicPlayer.unmuteAriaLabel
              : UNIVERSE_CONFIG.musicPlayer.muteAriaLabel
          }
          className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full bg-[#12091E]/85 backdrop-blur-xl border border-[#F5D58A]/30 text-[#FFF8FC] hover:border-[#F5D58A]/75 active:scale-95 transition-all cursor-pointer touch-manipulation"
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
