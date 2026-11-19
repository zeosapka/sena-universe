import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import confetti from "canvas-confetti";
import { Heart, Sparkles } from "lucide-react";
import { UNIVERSE_CONFIG } from "../config/universeConfig";
import { usePerformanceProfile } from "../hooks/usePerformanceProfile";

interface FlowerBloomIntroProps {
  onComplete: () => void;
}

interface ChrysanthemumPetal {
  ringIndex: number;
  totalRings: number;
  angle: number;
  length: number;
  width: number;
  cupCurve: number;
  openDelay: number;
}

interface BranchSpec {
  id: string;
  startX: number;
  startY: number;
  ctrl1X: number;
  ctrl1Y: number;
  ctrl2X: number;
  ctrl2Y: number;
  endX: number;
  endY: number;
  thicknessStart: number;
  thicknessEnd: number;
  startTime: number;
  duration: number;
  leaves: {
    t: number;
    side: -1 | 1;
    angleOffset: number;
    scale: number;
    delayOffset: number;
  }[];
  flowerScale: number;
  bloomStartTime: number;
  isMainCenter?: boolean;
}

interface SparkleMote {
  angle: number;
  dist: number;
  speed: number;
  size: number;
  color: string;
  phase: number;
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function easeOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

function getCubicBezierPoint(
  t: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x: uuu * x0 + 3 * uu * t * x1 + 3 * u * tt * x2 + ttt * x3,
    y: uuu * y0 + 3 * uu * t * y1 + 3 * u * tt * y2 + ttt * y3,
  };
}

function getCubicBezierAngle(
  t: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
) {
  const u = 1 - t;
  const dx =
    3 * u * u * (x1 - x0) + 6 * u * t * (x2 - x1) + 3 * t * t * (x3 - x2);
  const dy =
    3 * u * u * (y1 - y0) + 6 * u * t * (y2 - y1) + 3 * t * t * (y3 - y2);
  return Math.atan2(dy, dx);
}

function traceCenteredHeartPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number
) {
  const r = radius;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.36);
  ctx.bezierCurveTo(
    cx - r * 0.12,
    cy - r * 0.95,
    cx - r * 1.05,
    cy - r * 0.88,
    cx - r * 1.05,
    cy - r * 0.25
  );
  ctx.bezierCurveTo(
    cx - r * 1.05,
    cy + r * 0.32,
    cx - r * 0.35,
    cy + r * 0.68,
    cx,
    cy + r * 1.02
  );
  ctx.bezierCurveTo(
    cx + r * 0.35,
    cy + r * 0.68,
    cx + r * 1.05,
    cy + r * 0.32,
    cx + r * 1.05,
    cy - r * 0.25
  );
  ctx.bezierCurveTo(
    cx + r * 1.05,
    cy - r * 0.88,
    cx + r * 0.12,
    cy - r * 0.95,
    cx,
    cy - r * 0.36
  );
  ctx.closePath();
}

function traceChrysanthemumLeaf(
  ctx: CanvasRenderingContext2D,
  len: number,
  wid: number
) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(
    len * 0.15,
    -wid * 0.45,
    len * 0.26,
    -wid * 0.98,
    len * 0.42,
    -wid * 0.82
  );
  ctx.bezierCurveTo(
    len * 0.48,
    -wid * 0.52,
    len * 0.55,
    -wid * 1.05,
    len * 0.74,
    -wid * 0.78
  );
  ctx.bezierCurveTo(len * 0.88, -wid * 0.5, len * 0.96, -wid * 0.2, len, 0);
  ctx.bezierCurveTo(
    len * 0.96,
    wid * 0.2,
    len * 0.88,
    wid * 0.5,
    len * 0.74,
    wid * 0.78
  );
  ctx.bezierCurveTo(
    len * 0.55,
    wid * 1.05,
    len * 0.48,
    wid * 0.52,
    len * 0.42,
    wid * 0.82
  );
  ctx.bezierCurveTo(
    len * 0.26,
    wid * 0.98,
    len * 0.15,
    wid * 0.45,
    0,
    0
  );
  ctx.closePath();
}

function readLiveViewportSize(wrapper: HTMLDivElement | null): {
  width: number;
  height: number;
} {
  // iPad Safari'de dikey <-> yatay geçişlerinde en güncel ekran ölçüsünü okur
  const vvW = window.visualViewport?.width || 0;
  const vvH = window.visualViewport?.height || 0;
  const docW = document.documentElement?.clientWidth || 0;
  const docH = document.documentElement?.clientHeight || 0;
  const winW = window.innerWidth || 0;
  const winH = window.innerHeight || 0;
  const wrapW = wrapper?.clientWidth || 0;
  const wrapH = wrapper?.clientHeight || 0;

  const rawW = vvW > 100 ? vvW : winW > 100 ? winW : docW > 100 ? docW : wrapW || 1024;
  const rawH = vvH > 100 ? vvH : winH > 100 ? winH : docH > 100 ? docH : wrapH || 768;

  return {
    width: Math.max(320, Math.round(rawW)),
    height: Math.max(320, Math.round(rawH)),
  };
}

export function FlowerBloomIntro({ onComplete }: FlowerBloomIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageWrapperRef = useRef<HTMLDivElement | null>(null);

  const [stage, setStage] = useState<"growing" | "bloomed" | "transitioning">(
    "growing"
  );
  const { isReducedMotion, particleCountMultiplier } = usePerformanceProfile();

  const isReducedMotionRef = useRef(isReducedMotion);
  const particleMultiplierRef = useRef(particleCountMultiplier);
  isReducedMotionRef.current = isReducedMotion;
  particleMultiplierRef.current = particleCountMultiplier;

  const hasBloomedRef = useRef(false);
  const isTransitioningRef = useRef(false);
  const heartPortalRef = useRef({ progress: 0 });

  const triggerCinematicHeartDive = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setStage("transitioning");

    try {
      confetti({
        particleCount: Math.max(
          30,
          Math.round(75 * particleMultiplierRef.current)
        ),
        spread: 115,
        origin: { y: 0.45 },
        colors: ["#E83E70", "#FF91B5", "#F5D58A", "#FFF8FC"],
        scalar: 1.1,
      });
    } catch {
      // ignore confetti canvas error on low-memory devices
    }

    if (isReducedMotionRef.current) {
      window.setTimeout(onComplete, 420);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    tl.to(
      heartPortalRef.current,
      {
        progress: 1,
        duration: 1.28,
        ease: "power3.inOut",
      },
      0
    );

    if (stageWrapperRef.current) {
      tl.to(
        stageWrapperRef.current,
        {
          opacity: 0,
          duration: 0.35,
          ease: "power2.out",
        },
        0.98
      );
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = stageWrapperRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Her mount/refresh'te başlangıç durumunu deterministik olarak sıfırla
    hasBloomedRef.current = false;
    isTransitioningRef.current = false;
    heartPortalRef.current.progress = 0;
    setStage("growing");

    const generateChrysanthemumRings = (
      ringCount: number
    ): ChrysanthemumPetal[] => {
      const petals: ChrysanthemumPetal[] = [];
      for (let r = 0; r < ringCount; r++) {
        const ringNorm = r / (ringCount - 1);
        const petalsInRing = Math.round(22 - ringNorm * 10);
        const ringAngleOffset = r * GOLDEN_ANGLE;

        for (let p = 0; p < petalsInRing; p++) {
          const baseAngle =
            (p / petalsInRing) * Math.PI * 2 + ringAngleOffset;
          const jitter = Math.sin(r * 7.3 + p * 3.1) * 0.035;

          petals.push({
            ringIndex: r,
            totalRings: ringCount,
            angle: baseAngle + jitter,
            length: 98 * (1 - ringNorm * 0.68),
            width: 26 * (1 - ringNorm * 0.45),
            cupCurve: (p % 2 === 0 ? 1 : -1) * (0.06 + (1 - ringNorm) * 0.05),
            openDelay: ringNorm * 0.38 + (p / petalsInRing) * 0.035,
          });
        }
      }
      return petals;
    };

    const mainChrysanthemumPetals = generateChrysanthemumRings(9);
    const sideChrysanthemumPetals = generateChrysanthemumRings(6);

    const sceneW = 780;
    const sceneH = 620;
    const cx = sceneW / 2;
    const baseY = sceneH - 18;

    // 0. saniyeden itibaren hemen görünür şekilde yükselen ve erken çiçeklenen dallar
    const branches: BranchSpec[] = [
      {
        id: "main-stem",
        startX: cx,
        startY: baseY,
        ctrl1X: cx - 26,
        ctrl1Y: 468,
        ctrl2X: cx + 20,
        ctrl2Y: 340,
        endX: cx,
        endY: 232,
        thicknessStart: 10.5,
        thicknessEnd: 4.8,
        startTime: 0.0,
        duration: 0.34,
        leaves: [
          { t: 0.24, side: -1, angleOffset: -0.68, scale: 1.06, delayOffset: 0.06 },
          { t: 0.42, side: 1, angleOffset: 0.64, scale: 1.0, delayOffset: 0.12 },
          { t: 0.62, side: -1, angleOffset: -0.58, scale: 0.9, delayOffset: 0.18 },
        ],
        flowerScale: 1.12,
        bloomStartTime: 0.14,
        isMainCenter: true,
      },
      {
        id: "left-upper-branch",
        startX: cx - 6,
        startY: 440,
        ctrl1X: cx - 72,
        ctrl1Y: 405,
        ctrl2X: 258,
        ctrl2Y: 350,
        endX: 236,
        endY: 288,
        thicknessStart: 6.5,
        thicknessEnd: 3.2,
        startTime: 0.08,
        duration: 0.34,
        leaves: [
          { t: 0.36, side: -1, angleOffset: -0.72, scale: 0.86, delayOffset: 0.14 },
          { t: 0.66, side: 1, angleOffset: 0.58, scale: 0.76, delayOffset: 0.22 },
        ],
        flowerScale: 0.68,
        bloomStartTime: 0.24,
      },
      {
        id: "right-upper-branch",
        startX: cx + 4,
        startY: 416,
        ctrl1X: cx + 74,
        ctrl1Y: 386,
        ctrl2X: 522,
        ctrl2Y: 342,
        endX: 544,
        endY: 284,
        thicknessStart: 6.5,
        thicknessEnd: 3.2,
        startTime: 0.1,
        duration: 0.34,
        leaves: [
          { t: 0.38, side: 1, angleOffset: 0.72, scale: 0.86, delayOffset: 0.16 },
          { t: 0.68, side: -1, angleOffset: -0.58, scale: 0.76, delayOffset: 0.24 },
        ],
        flowerScale: 0.68,
        bloomStartTime: 0.26,
      },
      {
        id: "left-lower-branch",
        startX: cx - 8,
        startY: 506,
        ctrl1X: 312,
        ctrl1Y: 486,
        ctrl2X: 218,
        ctrl2Y: 444,
        endX: 172,
        endY: 392,
        thicknessStart: 5.0,
        thicknessEnd: 2.5,
        startTime: 0.14,
        duration: 0.34,
        leaves: [
          { t: 0.48, side: -1, angleOffset: -0.66, scale: 0.75, delayOffset: 0.2 },
        ],
        flowerScale: 0.5,
        bloomStartTime: 0.32,
      },
      {
        id: "right-lower-branch",
        startX: cx + 2,
        startY: 494,
        ctrl1X: 468,
        ctrl1Y: 476,
        ctrl2X: 562,
        ctrl2Y: 440,
        endX: 608,
        endY: 388,
        thicknessStart: 5.0,
        thicknessEnd: 2.5,
        startTime: 0.16,
        duration: 0.34,
        leaves: [
          { t: 0.5, side: 1, angleOffset: 0.66, scale: 0.75, delayOffset: 0.22 },
        ],
        flowerScale: 0.5,
        bloomStartTime: 0.34,
      },
      {
        id: "crown-left-shoot",
        startX: cx + 4,
        startY: 318,
        ctrl1X: 348,
        ctrl1Y: 270,
        ctrl2X: 322,
        ctrl2Y: 214,
        endX: 302,
        endY: 168,
        thicknessStart: 4.2,
        thicknessEnd: 2.2,
        startTime: 0.18,
        duration: 0.32,
        leaves: [
          { t: 0.52, side: -1, angleOffset: -0.6, scale: 0.64, delayOffset: 0.24 },
        ],
        flowerScale: 0.44,
        bloomStartTime: 0.38,
      },
      {
        id: "crown-right-shoot",
        startX: cx + 6,
        startY: 308,
        ctrl1X: 432,
        ctrl1Y: 265,
        ctrl2X: 458,
        ctrl2Y: 214,
        endX: 478,
        endY: 168,
        thicknessStart: 4.2,
        thicknessEnd: 2.2,
        startTime: 0.2,
        duration: 0.32,
        leaves: [
          { t: 0.52, side: 1, angleOffset: 0.6, scale: 0.64, delayOffset: 0.26 },
        ],
        flowerScale: 0.44,
        bloomStartTime: 0.4,
      },
    ];

    const motes: SparkleMote[] = [];
    const moteColors = ["#F5D58A", "#FF91B5", "#E83E70", "#FFF8FC"];
    for (let i = 0; i < 38; i++) {
      motes.push({
        angle: (Math.PI * 2 * i) / 38,
        dist: 38 + (i % 7) * 32,
        speed: 0.25 + (i % 4) * 0.15,
        size: 1.5 + (i % 3) * 1.1,
        color: moteColors[i % moteColors.length],
        phase: i * 0.7,
      });
    }

    let firstFrameTime: number | null = null;
    let hiddenAtTime: number | null = null;
    let rafId: number | null = null;
    let isCancelled = false;
    const orientationTimeouts: number[] = [];

    // Dal büyürken uç kısmında parlayan tomurcuk (0. milisaniyeden itibaren net görünür)
    const drawGlowingStemBud = (
      x: number,
      y: number,
      scale: number,
      growthP: number
    ) => {
      const r = Math.max(5, 14 * scale * (0.45 + 0.55 * growthP));
      ctx.save();
      ctx.translate(x, y);

      const budHalo = ctx.createRadialGradient(0, 0, 1, 0, 0, r * 2.4);
      budHalo.addColorStop(0, "rgba(255, 248, 252, 0.9)");
      budHalo.addColorStop(0.45, "rgba(245, 213, 138, 0.65)");
      budHalo.addColorStop(0.8, "rgba(232, 62, 112, 0.35)");
      budHalo.addColorStop(1, "rgba(232, 62, 112, 0)");
      ctx.fillStyle = budHalo;
      ctx.beginPath();
      ctx.arc(0, 0, r * 2.4, 0, Math.PI * 2);
      ctx.fill();

      // Tomurcuk taç yaprakları
      const budGrad = ctx.createLinearGradient(0, r, 0, -r);
      budGrad.addColorStop(0, "#5A1234");
      budGrad.addColorStop(0.5, "#E83E70");
      budGrad.addColorStop(0.85, "#FF91B5");
      budGrad.addColorStop(1, "#F5D58A");
      ctx.fillStyle = budGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.75, r, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(245, 213, 138, 0.75)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    const drawBranch = (
      b: BranchSpec,
      globalProgress: number,
      swayX: number
    ) => {
      // easeOutCubic sayesinde t=0 anında hemen hızlıca filizlenir (ölü bölge yoktur)
      const localP = easeOutCubic(
        (globalProgress - b.startTime) / b.duration
      );
      if (localP <= 0.002) return null;

      const steps = 26;
      const maxStep = Math.max(1, Math.floor(steps * localP));

      ctx.save();
      ctx.lineCap = "round";

      for (let s = 0; s < maxStep; s++) {
        const t1 = s / steps;
        const t2 = (s + 1) / steps;

        const p1 = getCubicBezierPoint(
          t1,
          b.startX,
          b.startY,
          b.ctrl1X + swayX * t1,
          b.ctrl1Y,
          b.ctrl2X + swayX * t1,
          b.ctrl2Y,
          b.endX + swayX,
          b.endY
        );
        const p2 = getCubicBezierPoint(
          t2,
          b.startX,
          b.startY,
          b.ctrl1X + swayX * t2,
          b.ctrl1Y,
          b.ctrl2X + swayX * t2,
          b.ctrl2Y,
          b.endX + swayX,
          b.endY
        );

        const widthSeg =
          b.thicknessStart + (b.thicknessEnd - b.thicknessStart) * t1;

        // Koyu arka planda ilk andan itibaren parlak ve net görünen gül kurusu-altın gövde rengi
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = widthSeg;
        ctx.strokeStyle =
          t1 < 0.35 ? "#6E2246" : t1 < 0.7 ? "#9E3562" : "#C95B82";
        ctx.stroke();

        // Altın ışık yansıması çizgisi
        ctx.beginPath();
        ctx.moveTo(p1.x + 1, p1.y);
        ctx.lineTo(p2.x + 1, p2.y);
        ctx.lineWidth = Math.max(1.0, widthSeg * 0.22);
        ctx.strokeStyle = "rgba(245, 213, 138, 0.52)";
        ctx.stroke();
      }
      ctx.restore();

      for (const lf of b.leaves) {
        if (localP <= lf.t) continue;
        const leafP = easeOutCubic(
          (globalProgress - (b.startTime + lf.delayOffset)) / 0.26
        );
        if (leafP <= 0.01) continue;

        const pt = getCubicBezierPoint(
          lf.t,
          b.startX,
          b.startY,
          b.ctrl1X + swayX * lf.t,
          b.ctrl1Y,
          b.ctrl2X + swayX * lf.t,
          b.ctrl2Y,
          b.endX + swayX,
          b.endY
        );
        const tangent = getCubicBezierAngle(
          lf.t,
          b.startX,
          b.startY,
          b.ctrl1X,
          b.ctrl1Y,
          b.ctrl2X,
          b.ctrl2Y,
          b.endX,
          b.endY
        );

        const len = 66 * lf.scale * leafP;
        const wid = 27 * lf.scale * leafP;

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(tangent + lf.angleOffset + swayX * 0.003);

        const leafGrad = ctx.createLinearGradient(0, 0, len, 0);
        leafGrad.addColorStop(0, "#381226");
        leafGrad.addColorStop(0.55, "#782850");
        leafGrad.addColorStop(1, "#D47496");

        ctx.fillStyle = leafGrad;
        ctx.strokeStyle = "rgba(245, 213, 138, 0.68)";
        ctx.lineWidth = 1.05;

        traceChrysanthemumLeaf(ctx, len, wid);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(len * 0.86, 0);
        ctx.moveTo(len * 0.25, 0);
        ctx.lineTo(len * 0.4, -wid * 0.52);
        ctx.moveTo(len * 0.25, 0);
        ctx.lineTo(len * 0.4, wid * 0.52);
        ctx.moveTo(len * 0.54, 0);
        ctx.lineTo(len * 0.72, -wid * 0.52);
        ctx.moveTo(len * 0.54, 0);
        ctx.lineTo(len * 0.72, wid * 0.52);
        ctx.strokeStyle = "rgba(245, 213, 138, 0.45)";
        ctx.lineWidth = 0.85;
        ctx.stroke();

        ctx.restore();
      }

      const tipPt = getCubicBezierPoint(
        localP,
        b.startX,
        b.startY,
        b.ctrl1X + swayX * localP,
        b.ctrl1Y,
        b.ctrl2X + swayX * localP,
        b.ctrl2Y,
        b.endX + swayX,
        b.endY
      );

      // Çiçek henüz tam açmadan önce dalın ucunda parlayan tomurcuk göster
      drawGlowingStemBud(tipPt.x, tipPt.y, b.flowerScale, localP);

      return tipPt;
    };

    const drawRoyalChrysanthemum = (
      x: number,
      y: number,
      scale: number,
      bloomProgress: number,
      timeSec: number,
      isMainCenter: boolean
    ) => {
      if (bloomProgress <= 0.005) return;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      const auraR = 45 + bloomProgress * 112;
      const auraGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, auraR);
      auraGrad.addColorStop(0, "rgba(245, 213, 138, 0.55)");
      auraGrad.addColorStop(0.48, "rgba(232, 62, 112, 0.3)");
      auraGrad.addColorStop(1, "rgba(8, 6, 17, 0)");
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, auraR, 0, Math.PI * 2);
      ctx.fill();

      const petals = isMainCenter
        ? mainChrysanthemumPetals
        : sideChrysanthemumPetals;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        const ringNorm = p.ringIndex / (p.totalRings - 1);
        const localRaw = (bloomProgress - p.openDelay) / (1 - p.openDelay);
        if (localRaw <= 0.005) continue;

        const openT = easeOutCubic(localRaw);
        const len = p.length * (0.25 + openT * 0.75);
        const wid = p.width * (0.38 + openT * 0.62);
        const breathe =
          Math.sin(timeSec * 1.6 + p.ringIndex * 0.6 + i * 0.2) *
          0.014 *
          openT;
        const curveX = len * p.cupCurve * openT;

        ctx.save();
        ctx.rotate(p.angle + breathe);

        const petalGrad = ctx.createLinearGradient(0, 0, curveX, -len);
        if (ringNorm < 0.28) {
          petalGrad.addColorStop(0, "#240515");
          petalGrad.addColorStop(0.38, "#6E1238");
          petalGrad.addColorStop(0.78, "#C92A5D");
          petalGrad.addColorStop(0.95, "#FF85B0");
          petalGrad.addColorStop(1, "#FFD4E5");
        } else if (ringNorm < 0.62) {
          petalGrad.addColorStop(0, "#360820");
          petalGrad.addColorStop(0.36, "#9E1B4E");
          petalGrad.addColorStop(0.75, "#E83E70");
          petalGrad.addColorStop(0.93, "#FFA6C6");
          petalGrad.addColorStop(1, "#F5D58A");
        } else {
          petalGrad.addColorStop(0, "#520E2F");
          petalGrad.addColorStop(0.35, "#C72B62");
          petalGrad.addColorStop(0.72, "#FF7EA8");
          petalGrad.addColorStop(0.9, "#F5D58A");
          petalGrad.addColorStop(1, "#FFF8FC");
        }

        ctx.fillStyle = petalGrad;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          -wid * 0.52 + curveX * 0.15,
          -len * 0.28,
          -wid * 0.96 + curveX * 0.65,
          -len * 0.82,
          curveX,
          -len
        );
        ctx.bezierCurveTo(
          wid * 0.96 + curveX * 0.65,
          -len * 0.82,
          wid * 0.52 + curveX * 0.15,
          -len * 0.28,
          0,
          0
        );
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle =
          ringNorm > 0.55
            ? "rgba(245, 213, 138, 0.68)"
            : "rgba(255, 182, 210, 0.36)";
        ctx.lineWidth = ringNorm > 0.55 ? 0.9 : 0.65;
        ctx.stroke();

        if (len > 18) {
          ctx.beginPath();
          ctx.moveTo(0, -len * 0.14);
          ctx.quadraticCurveTo(
            curveX * 0.5,
            -len * 0.55,
            curveX * 0.92,
            -len * 0.92
          );
          ctx.strokeStyle = "rgba(255, 248, 252, 0.24)";
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }

        ctx.restore();
      }

      const centerGrad = ctx.createRadialGradient(
        0,
        0,
        1,
        0,
        0,
        24 * bloomProgress
      );
      centerGrad.addColorStop(0, "rgba(255, 248, 252, 0.95)");
      centerGrad.addColorStop(0.45, "rgba(245, 213, 138, 0.85)");
      centerGrad.addColorStop(0.8, "rgba(232, 62, 112, 0.35)");
      centerGrad.addColorStop(1, "rgba(232, 62, 112, 0)");
      ctx.fillStyle = centerGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 24 * bloomProgress, 0, Math.PI * 2);
      ctx.fill();

      if (isMainCenter && bloomProgress > 0.25) {
        const heartAlpha = easeOutCubic((bloomProgress - 0.25) / 0.75);
        const pulse = 1 + Math.sin(timeSec * 3.4) * 0.08;
        const hRadius = 11.5 * heartAlpha * pulse;

        ctx.save();
        ctx.globalAlpha = heartAlpha * 0.92;
        const hGrad = ctx.createRadialGradient(0, -2, 1, 0, 0, hRadius * 1.3);
        hGrad.addColorStop(0, "#FFF8FC");
        hGrad.addColorStop(0.45, "#FFD1E3");
        hGrad.addColorStop(0.8, "#E83E70");
        hGrad.addColorStop(1, "#9E1B4E");

        traceCenteredHeartPath(ctx, 0, 0, hRadius);
        ctx.fillStyle = hGrad;
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    };

    const paintSceneFrame = (elapsedMs: number) => {
      const totalDuration = isReducedMotionRef.current ? 150 : 3400;
      // İlk karede (0ms) bile %4 başlangıç filizi hazır çizilir; asla siyah/boş ekran olmaz!
      const rawProgress = clamp01(0.04 + (elapsedMs / totalDuration) * 0.96);
      const timeSec = elapsedMs * 0.001;
      const swayX = isReducedMotionRef.current
        ? 0
        : Math.sin(timeSec * 1.35) * 4.2;

      // Her karede canlı ekran boyutunu oku (iPad dikey <-> yatay geçişlerinde yarım/siyah ekran kalmasını %100 önler)
      const { width: vpW, height: vpH } = readLiveViewportSize(wrapper);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetPxW = Math.round(vpW * dpr);
      const targetPxH = Math.round(vpH * dpr);

      if (canvas.width !== targetPxW || canvas.height !== targetPxH) {
        canvas.width = targetPxW;
        canvas.height = targetPxH;
        canvas.style.width = `${vpW}px`;
        canvas.style.height = `${vpH}px`;
      }

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Kanvasın tamamını her karede kendi romantik bordo-kozmik radial gradientiyle doldur
      // (Böylece iPad yatay modda veya sayfa yenilemede hiçbir piksel siyah/boş kalmaz!)
      const bgGrad = ctx.createRadialGradient(
        vpW * 0.5,
        vpH * 0.42,
        10,
        vpW * 0.5,
        vpH * 0.45,
        Math.max(vpW, vpH) * 0.85
      );
      bgGrad.addColorStop(0, "#4A102D");
      bgGrad.addColorStop(0.55, "#160618");
      bgGrad.addColorStop(1, "#080611");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, vpW, vpH);

      const isPortrait = vpH > vpW;
      const maxAvailW = vpW * (isPortrait ? 0.94 : 0.88);
      const maxAvailH = vpH * (isPortrait ? 0.58 : 0.68);
      const fitScale = Math.min(maxAvailW / sceneW, maxAvailH / sceneH, 1.15);

      const offsetX = (vpW - sceneW * fitScale) / 2;
      const offsetY =
        (vpH - sceneH * fitScale) / 2 - vpH * (isPortrait ? 0.01 : 0.02);

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(fitScale, fitScale);

      // 0. Merkez sıcak ışık halesi ve kök tohum ışıltısı (0. milisaniyeden itibaren aktif!)
      const seedGlow = ctx.createRadialGradient(cx, 320, 8, cx, 360, 260);
      seedGlow.addColorStop(0, "rgba(232, 62, 112, 0.25)");
      seedGlow.addColorStop(0.5, "rgba(245, 213, 138, 0.12)");
      seedGlow.addColorStop(1, "rgba(8, 6, 17, 0)");
      ctx.fillStyle = seedGlow;
      ctx.beginPath();
      ctx.arc(cx, 340, 260, 0, Math.PI * 2);
      ctx.fill();

      // 1. Dalları, yaprakları ve uç tomurcuklarını çiz
      const tipPositions: {
        branch: BranchSpec;
        pt: { x: number; y: number };
      }[] = [];

      for (const b of branches) {
        const tip = drawBranch(b, rawProgress, swayX);
        if (tip) {
          tipPositions.push({ branch: b, pt: tip });
        }
      }

      // 2. Yan kasımpatıları önce, ana Kraliçe Kasımpatıyı en üstte çiz (easeOutCubic ile gecikmesiz açılış)
      const sortedTips = [...tipPositions].sort((a, b) =>
        a.branch.isMainCenter ? 1 : b.branch.isMainCenter ? -1 : 0
      );

      let mainFlowerPos = { x: cx + swayX, y: 232 };

      for (const item of sortedTips) {
        const { branch, pt } = item;
        if (branch.isMainCenter) {
          mainFlowerPos = pt;
        }
        const bloomP = easeOutCubic(
          (rawProgress - branch.bloomStartTime) /
            (1 - branch.bloomStartTime)
        );
        if (bloomP > 0.005) {
          drawRoyalChrysanthemum(
            pt.x,
            pt.y,
            branch.flowerScale,
            bloomP,
            timeSec,
            !!branch.isMainCenter
          );
        }
      }

      // 3. Altın polen ve yıldız ışıltıları (0. milisaniyeden itibaren görünür)
      const moteOpacity = 0.45 + 0.55 * rawProgress;
      for (const m of motes) {
        const curAngle = m.angle + timeSec * m.speed * 0.35;
        const r = m.dist + Math.sin(timeSec * 1.5 + m.phase) * 14;
        const mx = cx + Math.cos(curAngle) * r * 1.25;
        const my = 285 + Math.sin(curAngle) * r * 0.85;

        ctx.save();
        ctx.globalAlpha =
          (0.38 + 0.55 * Math.sin(timeSec * 2.4 + m.phase)) * moteOpacity;
        ctx.fillStyle = m.color;
        ctx.beginPath();
        ctx.arc(mx, my, m.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();

      // 4. Tam ekran vektörel kalp geçiş dalgası
      const portalP = heartPortalRef.current.progress;
      if (portalP > 0.001) {
        const screenFlowerX = offsetX + mainFlowerPos.x * fitScale;
        const screenFlowerY = offsetY + mainFlowerPos.y * fitScale;
        const maxScreenDiag = Math.hypot(vpW, vpH) * 1.45;

        const rings = [
          {
            delay: 0,
            colorInner: "#FFF8FC",
            colorMid: "#F5D58A",
            colorOuter: "#E83E70",
            alpha: 0.96,
          },
          {
            delay: 0.12,
            colorInner: "#FFF8FC",
            colorMid: "#FF91B5",
            colorOuter: "#8E1D47",
            alpha: 0.98,
          },
          {
            delay: 0.24,
            colorInner: "#4A102D",
            colorMid: "#1B071A",
            colorOuter: "#080611",
            alpha: 1,
          },
        ];

        for (const ring of rings) {
          const localT = clamp01((portalP - ring.delay) / (1 - ring.delay));
          if (localT <= 0.001) continue;
          const easedT = Math.pow(localT, 2.35);
          const heartRadius = 14 * fitScale + easedT * maxScreenDiag;

          ctx.save();
          ctx.globalAlpha = ring.alpha;
          const grad = ctx.createRadialGradient(
            screenFlowerX,
            screenFlowerY,
            heartRadius * 0.05,
            screenFlowerX,
            screenFlowerY,
            heartRadius * 1.15
          );
          grad.addColorStop(0, ring.colorInner);
          grad.addColorStop(0.48, ring.colorMid);
          grad.addColorStop(1, ring.colorOuter);

          traceCenteredHeartPath(
            ctx,
            screenFlowerX,
            screenFlowerY,
            heartRadius
          );
          ctx.fillStyle = grad;
          ctx.fill();

          ctx.lineWidth = Math.max(2, 5 * (1 - localT));
          ctx.strokeStyle = "rgba(245, 213, 138, 0.85)";
          ctx.stroke();
          ctx.restore();
        }
      }

      ctx.restore();

      if (rawProgress >= 0.92 && !hasBloomedRef.current) {
        hasBloomedRef.current = true;
        setStage("bloomed");

        try {
          confetti({
            particleCount: Math.max(
              24,
              Math.round(55 * particleMultiplierRef.current)
            ),
            spread: 100,
            origin: { y: 0.45 },
            colors: ["#F5D58A", "#FF91B5", "#E83E70", "#FFF8FC"],
            scalar: 1.0,
          });
        } catch {
          // ignore confetti errors
        }
      }
    };

    const scheduleNextFrame = () => {
      if (isCancelled) return;
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(renderLoop);
    };

    const renderLoop = (now: number) => {
      if (isCancelled) return;
      rafId = null;

      if (document.visibilityState === "hidden") {
        if (hiddenAtTime === null) {
          hiddenAtTime = now;
        }
        scheduleNextFrame();
        return;
      } else if (hiddenAtTime !== null) {
        if (firstFrameTime !== null) {
          firstFrameTime += now - hiddenAtTime;
        }
        hiddenAtTime = null;
      }

      if (firstFrameTime === null) {
        firstFrameTime = now;
      }

      const elapsed = Math.max(0, now - firstFrameTime);
      paintSceneFrame(elapsed);
      scheduleNextFrame();
    };

    // 1. SENKRON İLK KARE ÇİZİMİ: İlk requestAnimationFrame'i bile beklemeden
    // mount anında (0. milisaniyede) ilk kareyi kanvasa çiz (Siyah ekranı %100 engeller!)
    paintSceneFrame(0);
    scheduleNextFrame();

    // 2. Fail-safe Watchdog: iPad Düşük Güç Modu veya arka plan kısıtlaması rAF'ı yavaşlatsa bile
    // en geç 3.8 saniye sonra çiçek açılmış durumuna ("bloomed") geçmeyi garanti et
    const watchdogTimer = window.setTimeout(() => {
      if (!isCancelled && !hasBloomedRef.current) {
        hasBloomedRef.current = true;
        setStage("bloomed");
      }
    }, 3800);

    // 3. iPad Safari Dikey <-> Yatay Döndürme (Orientation Change) Çok Aşamalı Yeniden Boyutlandırma
    const clearOrientationTimeouts = () => {
      while (orientationTimeouts.length > 0) {
        const id = orientationTimeouts.pop();
        if (id !== undefined) window.clearTimeout(id);
      }
    };

    const handleViewportOrOrientationChange = () => {
      if (isCancelled) return;
      clearOrientationTimeouts();
      // iPad Safari'nin 400ms'lik döndürme animasyonu boyunca ve bittiğinde kanvası zorla güncelle
      for (const delay of [0, 80, 200, 380, 650]) {
        const tid = window.setTimeout(() => {
          if (isCancelled) return;
          const elapsed =
            firstFrameTime !== null
              ? Math.max(0, performance.now() - firstFrameTime)
              : 0;
          paintSceneFrame(elapsed);
        }, delay);
        orientationTimeouts.push(tid);
      }
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && wrapper) {
      resizeObserver = new ResizeObserver(() => {
        handleViewportOrOrientationChange();
      });
      resizeObserver.observe(wrapper);
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (hiddenAtTime === null) {
          hiddenAtTime = performance.now();
        }
      } else {
        if (hiddenAtTime !== null && firstFrameTime !== null) {
          firstFrameTime += performance.now() - hiddenAtTime;
        }
        hiddenAtTime = null;
        handleViewportOrOrientationChange();
        scheduleNextFrame();
      }
    };

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        // Safari BFCache'den geri dönüldüyse animasyonu temiz şekilde baştan başlat
        firstFrameTime = null;
        hiddenAtTime = null;
        hasBloomedRef.current = false;
        isTransitioningRef.current = false;
        heartPortalRef.current.progress = 0;
        setStage("growing");
      }
      handleViewportOrOrientationChange();
      scheduleNextFrame();
    };

    window.addEventListener("resize", handleViewportOrOrientationChange, {
      passive: true,
    });
    window.addEventListener(
      "orientationchange",
      handleViewportOrOrientationChange,
      { passive: true }
    );
    window.visualViewport?.addEventListener(
      "resize",
      handleViewportOrOrientationChange,
      { passive: true }
    );
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      isCancelled = true;
      window.clearTimeout(watchdogTimer);
      clearOrientationTimeouts();
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", handleViewportOrOrientationChange);
      window.removeEventListener(
        "orientationchange",
        handleViewportOrOrientationChange
      );
      window.visualViewport?.removeEventListener(
        "resize",
        handleViewportOrOrientationChange
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return (
    <div
      ref={stageWrapperRef}
      onClick={() => {
        if (stage === "bloomed") triggerCinematicHeartDive();
      }}
      style={{
        paddingTop: "max(1.25rem, env(safe-area-inset-top, 0px))",
        paddingBottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))",
      }}
      className={`fixed inset-0 w-full h-full z-50 flex flex-col items-center justify-between min-h-screen min-h-[100dvh] px-4 overflow-hidden bg-[radial-gradient(circle_at_50%_42%,#4A102D_0%,#160618_58%,#080611_100%)] select-none ${
        stage === "bloomed" ? "cursor-pointer" : ""
      }`}
    >
      {/* TAM EKRAN Kasımpatı & Vektörel Kalp Geçiş Kanvası */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-10 block"
      />

      {/* Üst Rozet */}
      <div className="relative z-20 mt-14 sm:mt-16 lg:mt-1 text-center pointer-events-none px-2">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#190824]/80 border border-[#F5D58A]/35 text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#F5D58A] shadow-[0_0_20px_rgba(8,6,17,0.6)]">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{UNIVERSE_CONFIG.flowerIntro.badgeText}</span>
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
        </span>
      </div>

      {/* Orta Boşluk */}
      <div className="my-auto" />

      {/* Alt Romantik Kasımpatı Mesajı ve Geçiş Butonu */}
      <div className="relative z-30 min-h-[130px] sm:min-h-[150px] flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4 pb-2">
        <AnimatePresence mode="wait">
          {stage !== "growing" ? (
            <motion.div
              key="bloom-complete-message"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: stage === "transitioning" ? 0 : 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45 }}
              className="space-y-2.5 flex flex-col items-center"
            >
              <h2 className="font-serif italic font-semibold text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-[#FFF8FC] via-[#FF91B5] to-[#F5D58A] bg-clip-text text-transparent drop-shadow-[0_2px_25px_rgba(232,62,112,0.65)]">
                &ldquo;{UNIVERSE_CONFIG.flowerIntro.message}&rdquo;
              </h2>

              <p className="font-serif italic text-sm sm:text-base text-[#F5D58A]/90 tracking-wide max-w-lg">
                {UNIVERSE_CONFIG.flowerIntro.novemberSubtext}
              </p>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerCinematicHeartDive();
                  }}
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 min-h-[52px] rounded-full bg-gradient-to-r from-[#4A102D] via-[#E83E70] to-[#4A102D] bg-[length:200%_100%] hover:bg-right border border-[#F5D58A]/70 text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold text-[#FFF8FC] shadow-[0_0_35px_rgba(232,62,112,0.55)] hover:scale-105 active:scale-95 transition-all duration-500 cursor-pointer touch-manipulation"
                >
                  <Heart className="w-4 h-4 text-[#F5D58A] fill-[#F5D58A] animate-pulse shrink-0" />
                  <span>{UNIVERSE_CONFIG.flowerIntro.touchHeartButtonText}</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.p
              key="growing-status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.92 }}
              exit={{ opacity: 0 }}
              className="font-serif italic text-base sm:text-xl text-[#F5D58A]/95 tracking-wide"
            >
              {UNIVERSE_CONFIG.flowerIntro.growingText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
