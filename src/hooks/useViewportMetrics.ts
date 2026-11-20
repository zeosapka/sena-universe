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

  const docEl = document.documentElement;
  const vv = window.visualViewport;

  // CSS layout genişliğini kilitlememek için clientWidth ve innerWidth'i referans al
  const clientW = docEl?.clientWidth || 0;
  const innerW = window.innerWidth || 0;
  const vvW = vv?.width || 0;

  const clientH = docEl?.clientHeight || 0;
  const innerH = window.innerHeight || 0;
  const vvH = vv?.height || 0;

  const rawW = clientW > 100 ? clientW : innerW > 100 ? innerW : vvW || 1024;
  const rawH = vvH > 100 ? vvH : innerH > 100 ? innerH : clientH || 768;

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

  // Yön değişiminde oluşabilecek yatay scrollX kaymasını sıfırla
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

  if (orientationChanged || sizeChanged || forceOrientationBump) {
    currentMetrics = next;
    subscribers.forEach((fn) => fn(currentMetrics));
  }
}

function forceWebKitViewportResync() {
  if (typeof document === "undefined") return;
  const meta = document.querySelector('meta[name="viewport"]');
  if (meta) {
    // iPadOS Chrome (CriOS) ve Safari WKWebView yön değişiminde eski 744px / 1133px
    // zoom/viewport kilidini anında sıfırlamaya zorlar
    meta.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
    );
  }
}

function scheduleOrientationSettlement(isOrientationEvent: boolean) {
  if (typeof window === "undefined") return;
  clearSettlementTimers();

  if (isOrientationEvent) {
    forceWebKitViewportResync();
  }
  notifySubscribers(isOrientationEvent);

  // iPad Safari & iPad Chrome (CriOS) ekran döndürme animasyonu boyunca ve sonrasında
  // ölçüleri kademeli olarak yeniden oku
  const delays = isOrientationEvent
    ? [50, 150, 300, 480, 720, 1000]
    : [60, 200, 420];

  for (const delay of delays) {
    const tid = window.setTimeout(() => {
      if (isOrientationEvent && (delay === 50 || delay === 300)) {
        forceWebKitViewportResync();
      }
      notifySubscribers(false);
    }, delay);
    settlementTimers.push(tid);
  }
}

function initSingletonListeners() {
  if (isInitialized || typeof window === "undefined") return;
  isInitialized = true;

  currentMetrics = readCurrentViewport(currentVersion);

  const onResize = () => scheduleOrientationSettlement(false);
  const onOrientation = () => scheduleOrientationSettlement(true);

  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("orientationchange", onOrientation, {
    passive: true,
  });
  window.visualViewport?.addEventListener("resize", onResize, {
    passive: true,
  });

  if (window.screen?.orientation?.addEventListener) {
    window.screen.orientation.addEventListener("change", onOrientation);
  }

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
    notifySubscribers(false);

    return () => {
      subscribers.delete(listener);
    };
  }, []);

  return metrics;
}
