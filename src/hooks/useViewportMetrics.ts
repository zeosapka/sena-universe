import { useEffect, useState } from "react";

export interface ViewportMetrics {
  width: number;
  height: number;
  isPortrait: boolean;
  isCompactHeight: boolean;
  orientationVersion: number;
}

function readCurrentViewport(version: number): ViewportMetrics {
  if (typeof window === "undefined") {
    return {
      width: 1024,
      height: 768,
      isPortrait: false,
      isCompactHeight: false,
      orientationVersion: version,
    };
  }

  const vv = window.visualViewport;
  const docEl = document.documentElement;

  // iPad Safari'de visualViewport gerçek görünür alanı (adres çubuğu hariç) en doğru şekilde verir
  const rawW =
    vv && vv.width > 100
      ? vv.width
      : window.innerWidth > 100
      ? window.innerWidth
      : docEl?.clientWidth || 1024;

  const rawH =
    vv && vv.height > 100
      ? vv.height
      : window.innerHeight > 100
      ? window.innerHeight
      : docEl?.clientHeight || 768;

  const width = Math.max(320, Math.round(rawW));
  const height = Math.max(320, Math.round(rawH));
  const isPortrait = height > width;
  const isCompactHeight = height < 760;

  return {
    width,
    height,
    isPortrait,
    isCompactHeight,
    orientationVersion: version,
  };
}

function applyCssViewportVars(metrics: ViewportMetrics) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--app-width", `${metrics.width}px`);
  root.style.setProperty("--app-height", `${metrics.height}px`);
}

// Tekil (Singleton) abonelik yöneticisi: Birden fazla bileşen kullansa bile
// window üzerinde yalnızca tek bir listener grubu çalışır, bellek sızıntısı ve titreme olmaz.
type Listener = (metrics: ViewportMetrics) => void;
const subscribers = new Set<Listener>();
let currentVersion = 1;
let currentMetrics: ViewportMetrics = readCurrentViewport(currentVersion);
let isInitialized = false;
let settlementTimers: number[] = [];

function clearSettlementTimers() {
  while (settlementTimers.length > 0) {
    const id = settlementTimers.pop();
    if (id !== undefined && typeof window !== "undefined") {
      window.clearTimeout(id);
    }
  }
}

function notifySubscribers(forceOrientationBump = false) {
  if (typeof window === "undefined") return;

  // Dikey <-> yatay geçişte Safari'nin yatay kaydırma (scrollX) sapmasını sıfırla
  if (window.scrollX !== 0) {
    window.scrollTo(0, window.scrollY);
  }

  const next = readCurrentViewport(
    forceOrientationBump ? currentVersion + 1 : currentVersion
  );

  const orientationChanged = next.isPortrait !== currentMetrics.isPortrait;
  const sizeChanged =
    Math.abs(next.width - currentMetrics.width) >= 2 ||
    Math.abs(next.height - currentMetrics.height) >= 2;

  if (orientationChanged || forceOrientationBump) {
    currentVersion += 1;
    next.orientationVersion = currentVersion;
  }

  applyCssViewportVars(next);

  if (orientationChanged || sizeChanged || forceOrientationBump) {
    currentMetrics = next;
    subscribers.forEach((fn) => fn(currentMetrics));
  }
}

function scheduleOrientationSettlement(isOrientationEvent: boolean) {
  if (typeof window === "undefined") return;
  clearSettlementTimers();

  notifySubscribers(isOrientationEvent);

  // iPad Safari'nin ~400ms süren ekran döndürme animasyonu boyunca ve tamamlandığında
  // ölçüleri kademeli olarak doğrula
  const delays = isOrientationEvent
    ? [60, 180, 340, 520, 750]
    : [80, 240];

  for (const delay of delays) {
    const tid = window.setTimeout(() => {
      notifySubscribers(false);
    }, delay);
    settlementTimers.push(tid);
  }
}

function initSingletonListeners() {
  if (isInitialized || typeof window === "undefined") return;
  isInitialized = true;

  currentMetrics = readCurrentViewport(currentVersion);
  applyCssViewportVars(currentMetrics);

  const onResize = () => scheduleOrientationSettlement(false);
  const onOrientation = () => scheduleOrientationSettlement(true);

  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("orientationchange", onOrientation, {
    passive: true,
  });
  window.visualViewport?.addEventListener("resize", onResize, {
    passive: true,
  });

  const mql = window.matchMedia("(orientation: portrait)");
  if (mql?.addEventListener) {
    mql.addEventListener("change", onOrientation);
  }
}

export function useViewportMetrics(): ViewportMetrics {
  const [metrics, setMetrics] = useState<ViewportMetrics>(() => {
    initSingletonListeners();
    return currentMetrics;
  });

  useEffect(() => {
    initSingletonListeners();
    const listener: Listener = (next) => {
      setMetrics(next);
    };
    subscribers.add(listener);
    // İlk mount anında güncel ölçüyü senkronla
    notifySubscribers(false);

    return () => {
      subscribers.delete(listener);
    };
  }, []);

  return metrics;
}
