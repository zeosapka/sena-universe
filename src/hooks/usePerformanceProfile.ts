import { useEffect, useState } from "react";

export interface PerformanceProfile {
  isReducedMotion: boolean;
  isLowEndDevice: boolean;
  isTabletOrMobile: boolean;
  particleCountMultiplier: number;
}

function computeProfile(): PerformanceProfile {
  if (typeof window === "undefined") {
    return {
      isReducedMotion: false,
      isLowEndDevice: false,
      isTabletOrMobile: false,
      particleCountMultiplier: 1,
    };
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const cores = navigator.hardwareConcurrency || 4;
  // @ts-expect-error deviceMemory is available in Chromium
  const memory = navigator.deviceMemory || 4;

  const isLowEnd = cores <= 4 || memory <= 4;
  const isTouchOrCompact =
    window.matchMedia("(pointer: coarse)").matches ||
    window.innerWidth <= 1180;

  let multiplier = 1;
  if (prefersReducedMotion) {
    multiplier = 0.25;
  } else if (isLowEnd) {
    multiplier = 0.45;
  } else if (isTouchOrCompact) {
    multiplier = 0.7;
  }

  return {
    isReducedMotion: prefersReducedMotion,
    isLowEndDevice: isLowEnd,
    isTabletOrMobile: isTouchOrCompact,
    particleCountMultiplier: multiplier,
  };
}

export function usePerformanceProfile(): PerformanceProfile {
  const [profile, setProfile] = useState<PerformanceProfile>(() =>
    computeProfile()
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleUpdate = () => {
      const next = computeProfile();
      setProfile((prev) => {
        if (
          prev.isReducedMotion === next.isReducedMotion &&
          prev.isLowEndDevice === next.isLowEndDevice &&
          prev.isTabletOrMobile === next.isTabletOrMobile &&
          prev.particleCountMultiplier === next.particleCountMultiplier
        ) {
          return prev;
        }
        return next;
      });
    };

    mediaQuery.addEventListener("change", handleUpdate);
    window.addEventListener("resize", handleUpdate, { passive: true });
    return () => {
      mediaQuery.removeEventListener("change", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
    };
  }, []);

  return profile;
}
