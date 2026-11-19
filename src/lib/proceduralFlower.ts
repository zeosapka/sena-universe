/**
 * Procedural-Flower Engine (TypeScript / ES Module Adaptation)
 *
 * Original Author: Arthur Brongniart (Platane) — https://github.com/Platane/Procedural-Flower
 * License: MIT License
 *
 * Copyright (c) 2012 Arthur Brongniart
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 */

export interface Point2D {
  x: number;
  y: number;
}

export class FlwColor {
  private _r: number | null = null;
  private _g: number | null = null;
  private _b: number | null = null;
  private _t: number | null = null;
  private _s: number | null = null;
  private _v: number | null = null;

  init(
    r: number | null,
    g: number | null,
    b: number | null,
    t: number | null = null,
    s: number | null = null,
    v: number | null = null
  ) {
    this._r = r;
    this._g = g;
    this._b = b;
    this._t = t;
    this._s = s;
    this._v = v;
  }

  clone(): FlwColor {
    const c = new FlwColor();
    c.init(this._r, this._g, this._b, this._t, this._s, this._v);
    return c;
  }

  toString(): string {
    if (this._r == null) this._calcRGB();
    const r = Math.min(255, Math.max(0, Math.floor(this._r ?? 0)));
    const g = Math.min(255, Math.max(0, Math.floor(this._g ?? 0)));
    const b = Math.min(255, Math.max(0, Math.floor(this._b ?? 0)));
    let hex = ((r << 16) + (g << 8) + b).toString(16);
    while (hex.length < 6) hex = "0" + hex;
    return "#" + hex;
  }

  private _calcTSV() {
    const r = this._r ?? 0;
    const g = this._g ?? 0;
    const b = this._b ?? 0;
    const max = Math.max(r, b, g);
    const min = Math.min(r, b, g);

    if (max === min) this._t = 0;
    else if (max === r) this._t = (60 * (g - b) / (max - min) + 360) % 360;
    else if (max === g) this._t = 60 * (b - r) / (max - min) + 120;
    else this._t = 60 * (r - g) / (max - min) + 240;

    if (max === 0) this._s = 0;
    else this._s = 1 - min / max;

    this._v = max / 256;
  }

  private _calcRGB() {
    const t = ((this._t ?? 0) % 360 + 360) % 360;
    const s = this._s ?? 0;
    const v = this._v ?? 0;

    const k = Math.floor(t / 60) % 6;
    const f = t / 60 - k;
    let r = 0,
      g = 0,
      b = 0;

    switch (k) {
      case 0:
        r = v;
        g = v * (1 - (1 - f) * s);
        b = v * (1 - s);
        break;
      case 1:
        r = v * (1 - f * s);
        g = v;
        b = v * (1 - s);
        break;
      case 2:
        r = v * (1 - s);
        g = v;
        b = v * (1 - (1 - f) * s);
        break;
      case 3:
        r = v * (1 - s);
        g = v * (1 - f * s);
        b = v;
        break;
      case 4:
        r = v * (1 - (1 - f) * s);
        g = v * (1 - s);
        b = v;
        break;
      case 5:
        r = v;
        g = v * (1 - s);
        b = v * (1 - f * s);
        break;
    }
    this._r = r * 256;
    this._g = g * 256;
    this._b = b * 256;
  }

  getTint(): number {
    if (this._t == null) this._calcTSV();
    return this._t ?? 0;
  }
  getValue(): number {
    if (this._v == null) this._calcTSV();
    return this._v ?? 0;
  }
  getSaturation(): number {
    if (this._s == null) this._calcTSV();
    return this._s ?? 0;
  }
  getSat(): number {
    return this.getSaturation();
  }
  getR(): number {
    if (this._r == null) this._calcRGB();
    return this._r ?? 0;
  }
  getG(): number {
    if (this._g == null) this._calcRGB();
    return this._g ?? 0;
  }
  getB(): number {
    if (this._b == null) this._calcRGB();
    return this._b ?? 0;
  }

  setTint(x: number): this {
    if (this._t == null) this._calcTSV();
    this._t = x;
    this._r = null;
    this._g = null;
    this._b = null;
    return this;
  }
  setSaturation(x: number): this {
    if (this._s == null) this._calcTSV();
    this._s = x;
    this._r = null;
    this._g = null;
    this._b = null;
    return this;
  }
  setSat(x: number): this {
    return this.setSaturation(x);
  }
  setValue(x: number): this {
    if (this._v == null) this._calcTSV();
    this._v = x;
    this._r = null;
    this._g = null;
    this._b = null;
    return this;
  }

  static createWithRGB(r: number, g: number, b: number): FlwColor {
    const c = new FlwColor();
    c.init(r, g, b);
    return c;
  }

  static createWithHex(s: string): FlwColor {
    let r = 0,
      g = 0,
      b = 0;
    if (s.length === 4) {
      r = parseInt(s.substr(1, 1), 16) * 17;
      g = parseInt(s.substr(2, 1), 16) * 17;
      b = parseInt(s.substr(3, 1), 16) * 17;
    } else if (s.length === 7) {
      r = parseInt(s.substr(1, 2), 16);
      g = parseInt(s.substr(3, 2), 16);
      b = parseInt(s.substr(5, 2), 16);
    }
    const c = new FlwColor();
    c.init(r, g, b);
    return c;
  }

  static createWithTSV(t: number, s: number, v: number): FlwColor {
    const c = new FlwColor();
    c.init(null, null, null, t, Math.min(0.9999, s), Math.min(0.9999, v));
    return c;
  }
}

interface IntervalleBound {
  a: number;
  b: number;
}

export class FlwIntervalle {
  _tab: IntervalleBound[] = [];

  initWithTab(t: IntervalleBound[]) {
    this._tab = t;
  }

  initWithBornes(a: number, b: number) {
    a = a % (Math.PI * 2);
    if (a < 0) a += Math.PI * 2;
    b = b % (Math.PI * 2);
    if (b <= 0) b += Math.PI * 2;

    if (a > b) {
      this._tab = [
        { a: 0, b },
        { a, b: Math.PI * 2 },
      ];
    } else {
      this._tab = [{ a, b }];
    }
  }

  getRandom(randFn: () => number = Math.random): number {
    let r = randFn();
    if (this.isEmpty()) return 0;
    const t = new Array<number>(this._tab.length + 1);
    let sum = 0;
    t[0] = 0;
    for (let i = 0; i < this._tab.length; i++) {
      t[i + 1] = sum += this._tab[i].b - this._tab[i].a;
    }
    r *= sum;
    let idx = 1;
    while (idx < this._tab.length && t[idx] <= r) idx++;
    const localR = (r - t[idx - 1]) / (t[idx] - t[idx - 1] || 1);
    return this._tab[idx - 1].a * (1 - localR) + this._tab[idx - 1].b * localR;
  }

  isEmpty(): boolean {
    return this._tab.length === 0;
  }

  getSum(): number {
    let sum = 0;
    for (let i = 0; i < this._tab.length; i++) {
      sum += this._tab[i].b - this._tab[i].a;
    }
    return sum;
  }

  intersection(ia: FlwIntervalle, ib?: FlwIntervalle): FlwIntervalle {
    const targetB = ib || this;
    const ta = ia._tab;
    const tb = targetB._tab;
    const te: IntervalleBound[] = [];

    for (let a = 0; a < ta.length; a++) {
      let b = 0;
      while (b < tb.length && tb[b].b < ta[a].a) b++;
      for (; b < tb.length && tb[b].a < ta[a].b; b++) {
        te.push({
          a: Math.max(ta[a].a, tb[b].a),
          b: Math.min(ta[a].b, tb[b].b),
        });
      }
    }
    const res = new FlwIntervalle();
    res.initWithTab(te);
    return res;
  }

  static create(a: number, b: number): FlwIntervalle {
    const i = new FlwIntervalle();
    i.initWithBornes(a, b);
    return i;
  }
}

export interface FlwOptions {
  widthStart: number;
  widthEnd: number;
  colorStart: FlwColor;
  colorEnd: FlwColor;
  maxDeepness: number;
  maxDeepnessVar: number;
  maxDeepnessTwisted: number;
  maxDeepnessTwistedVar: number;
  maxDeepnessMajor: number;
  maxDeepnessMajorVar: number;
  maxDeepnessMaster: number;
  maxDeepnessMasterVar: number;
  headSize: number;
  headSizeVar: number;
  leafSize: number;
  leafSizeVar: number;
  headColor: FlwColor;
  headColorTintVar: number;
  headColorValueVar: number;
  headColorSatVar: number;
  leafColor: FlwColor;
  leafColorTintVar: number;
  leafColorValueVar: number;
  leafColorSatVar: number;
  radius: number;
  radiusVar: number;
  globalDirection: number;
  growVelocity: number;
  strokeBranchWidth: number;
  strokeBranchColor: string;
  strokeLeafWidth: number;
  strokeLeafColor: string;
  strokeHeadWidth: number;
  strokeHeadColor: string;
  rand: () => number;
}

export function createSeededRandom(initialSeed: number): () => number {
  let seed = initialSeed;
  const offset = initialSeed;
  return () => {
    const s = seed;
    const square = s * s;
    const nseed = Math.floor(square / 1000) % 10000000000;
    if (nseed !== seed) seed = nseed;
    else seed = nseed + offset;
    return (seed % 10000000000) / 10000000000;
  };
}

export function buildRomanticFlowerOptions(
  overrides: Partial<FlwOptions> = {}
): FlwOptions {
  // Romantic Rose Pink (#E83E70 / #FF91B5), Deep Rose & Soft Gold (#F5D58A) palette
  const defaults: FlwOptions = {
    widthStart: 5.2,
    widthEnd: 0.9,
    colorStart: FlwColor.createWithHex("#3B1528"), // Deep burgundy-rose stem base
    colorEnd: FlwColor.createWithHex("#B86B77"),   // Warm rose-gold upper stem
    maxDeepness: 3,
    maxDeepnessVar: 2,
    maxDeepnessTwisted: 5,
    maxDeepnessTwistedVar: 0,
    maxDeepnessMajor: 2,
    maxDeepnessMajorVar: 2,
    maxDeepnessMaster: 5,
    maxDeepnessMasterVar: 2,
    headSize: 58,
    headSizeVar: 28,
    leafSize: 28,
    leafSizeVar: 10,
    headColor: FlwColor.createWithHex("#E83E70"), // Romantic Red / Rose Pink petals
    headColorTintVar: 24,
    headColorValueVar: 0.18,
    headColorSatVar: 0.15,
    leafColor: FlwColor.createWithHex("#7A3E58"), // Dusty rose-gold foliage
    leafColorTintVar: 22,
    leafColorValueVar: 0.18,
    leafColorSatVar: 0.18,
    radius: 54,
    radiusVar: 45,
    globalDirection: Math.PI / 2,
    growVelocity: 0.24,
    strokeBranchWidth: 0.5,
    strokeBranchColor: "#240A18",
    strokeLeafWidth: 0.6,
    strokeLeafColor: "#F5D58A",
    strokeHeadWidth: 0.7,
    strokeHeadColor: "#F5D58A", // Soft gold petal rim illumination
    rand: Math.random,
  };

  return { ...defaults, ...overrides };
}

interface FlwNode {
  getHatchinTime(): number;
  visitFromTo(
    ctxDynamic: CanvasRenderingContext2D,
    ctxStatic: CanvasRenderingContext2D,
    t1: number,
    t2: number
  ): void;
  getZ?(): number;
}

export class FlwLeaf implements FlwNode {
  private _o!: Point2D;
  private _pic!: Point2D;
  private _topEar!: number;
  private _botEar!: number;
  private _creux!: number;
  private _hatchingTime!: number;
  private _radius!: number;
  private _d!: number;
  private _color!: FlwColor;
  private _staticlyDrawn = false;
  private _option!: FlwOptions;

  init(o: Point2D, d: number, size: number, option: FlwOptions) {
    const rand = option.rand;
    this._o = o;
    this._radius = (option.leafSize + (rand() - 0.5) * option.leafSizeVar) * size;
    this._pic = {
      x: o.x + Math.cos(d) * this._radius,
      y: o.y + Math.sin(d) * this._radius,
    };
    this._d = d;
    this._hatchingTime = Math.floor(rand() * 140 + 140);
    this._creux = rand() * 0.5 + 0.2;
    this._topEar = rand() * 0.5 + 0.4;
    this._botEar = rand() * 0.5 + 0.4;

    this._color = option.leafColor.clone();
    this._color.setTint(
      (this._color.getTint() + (rand() - 0.5) * option.leafColorTintVar + 360) %
        360
    );
    this._color.setSat(
      Math.min(
        0.99,
        Math.max(
          0.01,
          this._color.getSat() + (rand() - 0.5) * option.leafColorSatVar
        )
      )
    );
    this._color.setValue(
      Math.min(
        0.99,
        Math.max(
          0.01,
          this._color.getValue() + (rand() - 0.5) * option.leafColorValueVar
        )
      )
    );
    this._option = option;
  }

  getHatchinTime(): number {
    return this._hatchingTime;
  }

  drawWithParam(
    context: CanvasRenderingContext2D,
    pic: Point2D,
    o: Point2D,
    topEarBelly: number,
    botEarBelly: number,
    creux: number,
    color: FlwColor
  ) {
    const opic = { x: pic.x - o.x, y: pic.y - o.y };
    const rebond = {
      x: pic.x - opic.x * 0.8 - opic.y * botEarBelly,
      y: pic.y - opic.y * 0.8 + opic.x * botEarBelly,
    };
    const n = Math.sqrt(
      (o.x - pic.x) * (o.x - pic.x) + (o.y - pic.y) * (o.y - pic.y)
    );
    if (n < 0.5) return;

    const grd = context.createRadialGradient(
      pic.x - opic.y * botEarBelly * 0.1,
      pic.y + opic.x * botEarBelly * 0.1,
      0,
      pic.x - opic.x * 0.5 - opic.y * creux * botEarBelly * 0.5,
      pic.y - opic.y * 0.5 + opic.x * creux * botEarBelly * 0.5,
      Math.max(1, n * 0.8)
    );

    const secondaryColor = color
      .clone()
      .setTint((color.getTint() - 30 + 360) % 360)
      .setValue(Math.min(0.999, color.getValue() * 1.15 + 0.1));

    grd.addColorStop(1, color.toString());
    grd.addColorStop(0, secondaryColor.toString());

    context.fillStyle = grd;
    context.beginPath();
    context.moveTo(o.x, o.y);
    context.quadraticCurveTo(
      o.x - opic.x * 0.2 + opic.y * topEarBelly,
      o.y - opic.y * 0.2 - opic.x * topEarBelly,
      pic.x,
      pic.y
    );
    context.bezierCurveTo(
      pic.x - opic.x * creux * 0.5 - opic.y * creux * botEarBelly * 0.5,
      pic.y - opic.y * creux * 0.5 + opic.x * creux * botEarBelly * 0.5,
      pic.x - opic.x * creux * 0.9 - opic.y * botEarBelly,
      pic.y - opic.y * creux * 0.9 + opic.x * botEarBelly,
      rebond.x,
      rebond.y
    );
    context.bezierCurveTo(
      pic.x - opic.x * 1.2 - opic.y * botEarBelly * 0.85,
      pic.y - opic.y * 1.2 + opic.x * botEarBelly * 0.85,
      pic.x - opic.x * 1.1 - opic.y * botEarBelly * 0.1,
      pic.y - opic.y * 1.1 + opic.x * botEarBelly * 0.1,
      o.x,
      o.y
    );
    context.fill();

    if (this._option.strokeLeafWidth > 0) {
      context.strokeStyle = this._option.strokeLeafColor;
      context.lineWidth = this._option.strokeLeafWidth;
      context.stroke();
    }

    // Soft gold vein detail inside leaf
    context.fillStyle = "rgba(245, 213, 138, 0.35)";
    context.beginPath();
    context.moveTo(
      o.x - opic.y * botEarBelly * 0.05,
      o.y + opic.x * botEarBelly * 0.05
    );
    context.quadraticCurveTo(
      o.x + opic.x * 0.15 + opic.y * topEarBelly * 0.2,
      o.y + opic.y * 0.15 - opic.x * topEarBelly * 0.2,
      o.x + opic.x * 0.8 - opic.y * botEarBelly * 0.08,
      o.y + opic.y * 0.8 + opic.x * botEarBelly * 0.08
    );
    context.bezierCurveTo(
      o.x + opic.x * 0.1 + opic.y * topEarBelly * 0.25,
      o.y + opic.y * 0.1 - opic.x * topEarBelly * 0.25,
      o.x,
      o.y,
      o.x + opic.y * topEarBelly * 0.08,
      o.y - opic.x * topEarBelly * 0.08
    );
    context.lineTo(
      o.x - opic.y * botEarBelly * 0.05,
      o.y + opic.x * botEarBelly * 0.05
    );
    context.fill();
  }

  drawFromTo(context: CanvasRenderingContext2D, _t1: number, t2: number) {
    const r = t2 / this._hatchingTime;
    let o: Point2D,
      pic: Point2D,
      topEarBelly: number,
      botEarBelly: number,
      creux: number,
      color: FlwColor;

    if (r < 0.7) {
      const rr = r / 0.7;
      const radius = (0.3 + r) * this._radius;
      const d = (Math.PI / 2) * (1 - rr) + this._d * rr;
      o = this._o;
      pic = {
        x: o.x + Math.cos(d) * radius,
        y: o.y + Math.sin(d) * radius,
      };
      topEarBelly = (0.3 + rr) * this._topEar;
      botEarBelly = (0.3 + rr) * this._botEar;
      creux = this._creux;
      color = FlwColor.createWithRGB(
        (1 - rr) * this._option.colorStart.getR() + rr * this._color.getR(),
        (1 - rr) * this._option.colorStart.getG() + rr * this._color.getG(),
        (1 - rr) * this._option.colorStart.getB() + rr * this._color.getB()
      );
    } else if (r < 0.99) {
      const rr = (r - 0.7) / 0.3;
      const sinr = Math.cos(rr * 3 * Math.PI * 2) * 0.3 * (1 - rr) + 1;
      const radius = this._radius;
      const d =
        this._d * (Math.cos(rr * 3 * Math.PI * 2) * 0.05 * (1 - rr) + 1);
      o = {
        x: this._o.x + Math.cos(d) * 10 * (sinr - 1),
        y: this._o.y + Math.sin(d) * 10 * (sinr - 1),
      };
      pic = {
        x: o.x + Math.cos(d) * radius,
        y: o.y + Math.sin(d) * radius,
      };
      topEarBelly = sinr * this._topEar;
      botEarBelly = sinr * this._botEar;
      creux = this._creux;
      color = this._color;
    } else {
      o = this._o;
      pic = this._pic;
      topEarBelly = this._topEar;
      botEarBelly = this._botEar;
      creux = this._creux;
      color = this._color;
    }

    this.drawWithParam(context, pic, o, topEarBelly, botEarBelly, creux, color);
  }

  visitFromTo(
    contextDynamique: CanvasRenderingContext2D,
    contextStatique: CanvasRenderingContext2D,
    t1: number,
    t2: number
  ) {
    if (t2 > this._hatchingTime) {
      if (!this._staticlyDrawn) {
        this.drawFromTo(contextStatique, t1, t2);
        this._staticlyDrawn = true;
      }
    } else {
      this.drawFromTo(contextDynamique, t1, t2);
    }
  }
}

export class FlwPetal implements FlwNode {
  private _hatchingTime!: number;
  private _deep!: number;
  private _globalbours!: number;
  private _t1!: number;
  private _t2!: number;
  private _ellipseA!: number;
  private _ellipseB!: number;
  private _o!: Point2D;
  private _pic!: Point2D;
  private _staticlyDrawn = false;
  private _color!: FlwColor;
  private _option!: FlwOptions;

  init(
    o: Point2D,
    pic: Point2D,
    ellipseA: number,
    ellipseB: number,
    t1: number,
    t2: number,
    size: number,
    ht: number,
    color: FlwColor,
    option: FlwOptions
  ) {
    const rand = option.rand;
    this._o = o;
    this._pic = pic;
    this._ellipseA = ellipseA;
    this._ellipseB = ellipseB;

    while (
      Math.abs(Math.sin(Math.PI * 2 * t1) - Math.sin(Math.PI * 2 * t2)) < 0.2
    ) {
      t2 += 0.05;
    }

    this._t1 = t1;
    this._t2 = t2;
    this._deep = Math.min(
      0.9,
      Math.max(
        0.1,
        0.5 +
          (rand() - 0.5) *
            4 *
            Math.abs(Math.sin(Math.PI * 2 * t1) - Math.sin(Math.PI * 2 * t2))
      )
    );
    this._globalbours = (size * 0.8 + 0.2) * (rand() * 0.15 + 0.25);
    this._hatchingTime = ht;
    this._color = color;
    this._option = option;
  }

  getZ(): number {
    return this._ellipseA * Math.cos((this._t1 + this._t2) * Math.PI);
  }

  getHatchinTime(): number {
    return this._hatchingTime;
  }

  drawWithParam(
    context: CanvasRenderingContext2D,
    o: Point2D,
    pic: Point2D,
    ellipseA: number,
    ellipseB: number,
    t1: number,
    t2: number,
    deep: number,
    globalbours: number,
    color: FlwColor
  ) {
    const opic = { x: pic.x - o.x, y: pic.y - o.y };
    const hoop = {
      h: 0.5,
      v:
        0.02 +
        0.2 * Math.abs(Math.sin(Math.PI * 2 * t1) - Math.sin(Math.PI * 2 * t2)),
    };
    const decbours = Math.sin(Math.PI * (t1 + t2)) * 0.3;
    let bours1: number, bours2: number;

    if (Math.sin(Math.PI * 2 * t1) > Math.sin(Math.PI * 2 * t2)) {
      bours1 = globalbours + decbours;
      bours2 = globalbours - decbours;
    } else {
      bours2 = globalbours + decbours;
      bours1 = globalbours - decbours;
    }

    if (bours1 < 0.06 && bours1 > -0.2) bours1 = bours1 * 0.5 - 0.1;
    if (bours2 < 0.06 && bours2 > -0.2) bours2 = bours2 * 0.5 - 0.1;

    const c1 = {
      x:
        pic.x +
        Math.cos(Math.PI * 2 * t1) * opic.x * ellipseA +
        Math.sin(Math.PI * 2 * t1) * opic.y * ellipseB,
      y:
        pic.y +
        Math.cos(Math.PI * 2 * t1) * opic.y * ellipseA -
        Math.sin(Math.PI * 2 * t1) * opic.x * ellipseB,
    };
    const c2 = {
      x:
        pic.x +
        Math.cos(Math.PI * 2 * t2) * opic.x * ellipseA +
        Math.sin(Math.PI * 2 * t2) * opic.y * ellipseB,
      y:
        pic.y +
        Math.cos(Math.PI * 2 * t2) * opic.y * ellipseA -
        Math.sin(Math.PI * 2 * t2) * opic.x * ellipseB,
    };

    const d1 = {
      x:
        o.x +
        Math.cos(Math.PI * 2 * t1) * opic.x * ellipseA * 0.3 +
        Math.sin(Math.PI * 2 * t1) * opic.y * ellipseB * 0.3,
      y:
        o.y +
        Math.cos(Math.PI * 2 * t1) * opic.y * ellipseA * 0.3 -
        Math.sin(Math.PI * 2 * t1) * opic.x * ellipseB * 0.3,
    };
    const d2 = {
      x:
        o.x +
        Math.cos(Math.PI * 2 * t2) * opic.x * ellipseA * 0.3 +
        Math.sin(Math.PI * 2 * t2) * opic.y * ellipseB * 0.3,
      y:
        o.y +
        Math.cos(Math.PI * 2 * t2) * opic.y * ellipseA * 0.3 -
        Math.sin(Math.PI * 2 * t2) * opic.x * ellipseB * 0.3,
    };

    const c1c2 = { x: c2.x - c1.x, y: c2.y - c1.y };
    const up = { x: opic.x, y: opic.y };
    const cm = {
      x: c1.x + hoop.h * c1c2.x + hoop.v * up.x,
      y: c1.y + hoop.h * c1c2.y + hoop.v * up.y,
    };

    const d1c1 = { x: c1.x - d1.x, y: c1.y - d1.y };
    const d1c1ext =
      d1c1.x * c1c2.y - d1c1.y * c1c2.x > 0
        ? { x: d1c1.y, y: -d1c1.x }
        : { x: -d1c1.y, y: d1c1.x };

    const b1 = {
      x: d1.x + d1c1.x * 0.5 + d1c1ext.x * bours1,
      y: d1.y + d1c1.y * 0.5 + d1c1ext.y * bours1,
    };

    const d2c2 = { x: c2.x - d2.x, y: c2.y - d2.y };
    const d2c2ext =
      d2c2.x * c1c2.y - d2c2.y * c1c2.x < 0
        ? { x: d2c2.y, y: -d2c2.x }
        : { x: -d2c2.y, y: d2c2.x };

    const b2 = {
      x: d2.x + d2c2.x * 0.7 + d2c2ext.x * bours2,
      y: d2.y + d2c2.y * 0.7 + d2c2ext.y * bours2,
    };
    const b2bis = {
      x: d2.x + d2c2.x * 0.3 + d2c2ext.x * bours2,
      y: d2.y + d2c2.y * 0.3 + d2c2ext.y * bours2,
    };

    const ctrlC1 = {
      x: c1.x + c1c2.x * hoop.h * 0.5 + up.x * hoop.v * deep,
      y: c1.y + c1c2.y * hoop.h * 0.5 + up.y * hoop.v * deep,
    };
    const ctrlC1_ = {
      x: c1.x + c1c2.x * hoop.h * 0.6 + up.x * hoop.v,
      y: c1.y + c1c2.y * hoop.h * 0.6 + up.y * hoop.v,
    };
    const ctrlC2_ = {
      x: cm.x + c1c2.x * (1 - hoop.h) * 0.5,
      y: cm.y + c1c2.y * (1 - hoop.h) * 0.5,
    };
    const ctrlC2 = {
      x: c2.x + (c2.x - b2.x) * hoop.h * hoop.v,
      y: c2.y + (c2.y - b2.y) * hoop.h * hoop.v,
    };
    const ctrlB1_ = {
      x: c1.x + (c1.x - ctrlC1.x) * 2,
      y: c1.y + (c1.y - ctrlC1.y) * 2,
    };

    // Highlight gradient with Soft Rose Pink & Gold sheen
    const secondaryColor = color
      .clone()
      .setTint((color.getTint() - 18 + 360) % 360)
      .setValue(0.96);

    const grd = context.createLinearGradient(
      c1.x + opic.x * 0.3,
      c1.y + opic.y * 0.3,
      Math.floor(c1.x - opic.x * 0.5),
      Math.floor(c1.y - opic.y * 0.5)
    );

    grd.addColorStop(0, "#FF91B5");
    grd.addColorStop(0.35, secondaryColor.toString());
    grd.addColorStop(0.95, color.toString());

    context.fillStyle = grd;
    context.beginPath();
    context.moveTo(d1.x, d1.y);
    context.bezierCurveTo(b1.x, b1.y, ctrlB1_.x, ctrlB1_.y, c1.x, c1.y);
    context.bezierCurveTo(ctrlC1.x, ctrlC1.y, ctrlC1_.x, ctrlC1_.y, cm.x, cm.y);
    context.bezierCurveTo(ctrlC2_.x, ctrlC2_.y, ctrlC2.x, ctrlC2.y, c2.x, c2.y);
    context.bezierCurveTo(b2.x, b2.y, b2bis.x, b2bis.y, d2.x, d2.y);
    context.lineTo(d1.x, d1.y);
    context.fill();

    if (this._option.strokeHeadWidth > 0) {
      context.strokeStyle = this._option.strokeHeadColor;
      context.lineWidth = this._option.strokeHeadWidth;
      context.stroke();
    }
  }

  drawFromTo(context: CanvasRenderingContext2D, _t1: number, t2: number) {
    let o: Point2D,
      pic: Point2D,
      ellipseA: number,
      ellipseB: number,
      globalbours: number;
    const r = t2 / this._hatchingTime;

    if (r < 0.35) {
      const rr = r / 0.35;
      o = this._o;
      const opic = {
        x: this._pic.x - this._o.x,
        y: this._pic.y - this._o.y,
      };
      pic = {
        x: this._o.x + opic.x * (rr * 0.6 + 0.45),
        y: this._o.y + opic.y * (rr * 0.6 + 0.45),
      };
      ellipseA = this._ellipseA * (rr * 0.1 + 0.1);
      ellipseB = this._ellipseB * (rr * 0.1 + 0.1);
      globalbours = this._globalbours * (rr * 0.8 + 0.4);
    } else if (r < 0.5) {
      const rr = (r - 0.35) / 0.15;
      o = this._o;
      pic = this._pic;
      ellipseA = this._ellipseA * 0.2;
      ellipseB = this._ellipseB * 0.2;
      globalbours = this._globalbours * (-rr * 0.2 + 1.2);
    } else if (r < 0.7) {
      const rr = (r - 0.5) / 0.2;
      o = this._o;
      pic = this._pic;
      ellipseA = this._ellipseA * (rr + 0.2);
      ellipseB = this._ellipseB * (rr + 0.2);
      globalbours = this._globalbours;
    } else if (r < 0.99) {
      const rr = (r - 0.7) / 0.3;
      const sinr = Math.cos(rr * 3 * Math.PI * 2) * 0.3 * (1 - rr) + 1;
      o = this._o;
      pic = this._pic;
      ellipseA = this._ellipseA * sinr;
      ellipseB = this._ellipseB * sinr;
      globalbours = this._globalbours * sinr;
    } else {
      pic = this._pic;
      o = this._o;
      ellipseA = this._ellipseA;
      ellipseB = this._ellipseB;
      globalbours = this._globalbours;
    }

    this.drawWithParam(
      context,
      o,
      pic,
      ellipseA,
      ellipseB,
      this._t1,
      this._t2,
      this._deep,
      globalbours,
      this._color
    );
  }

  visitFromTo(
    contextDynamique: CanvasRenderingContext2D,
    contextStatique: CanvasRenderingContext2D,
    t1: number,
    t2: number
  ) {
    if (this._staticlyDrawn) return;
    if (t2 > this._hatchingTime) {
      this._staticlyDrawn = true;
      this.drawFromTo(contextStatique, t1, t2);
    } else {
      this.drawFromTo(contextDynamique, t1, t2);
    }
  }
}

export class FlwHead implements FlwNode {
  private _children: FlwNode[] = [];

  init(o: Point2D, d: number, option: FlwOptions) {
    const rand = option.rand;
    this._children = [];

    const radius = option.headSize + (rand() - 0.5) * option.headSizeVar;
    const pic = {
      x: o.x + Math.cos(d) * radius,
      y: o.y + Math.sin(d) * radius,
    };
    const inclinaison = 0.08 + rand() * 0.14;
    const hatchingTime = Math.floor(rand() * 80 + 150);

    const color = option.headColor.clone();
    color.setTint(
      (color.getTint() + (rand() - 0.5) * option.headColorTintVar + 360) % 360
    );
    const sat = Math.min(
      0.9,
      Math.max(0.25, color.getSat() + (rand() - 0.5) * option.headColorSatVar)
    );
    const value = Math.min(
      0.92,
      Math.max(
        0.35,
        color.getValue() + (rand() - 0.5) * option.headColorValueVar
      )
    );

    // Inner circle of petals
    let t = 0;
    const lInner = 4;
    for (let i = 0; t < 1; i++) {
      t += ((rand() * 0.4 + 0.8) * 1) / 2 / lInner;
      const t1 = t;
      t += ((rand() * 0.4 + 0.8) * 1) / 2 / lInner;
      const t2 = t;
      const y = 0.499 - Math.cos((t1 + t2) * Math.PI) / 4;

      const p = new FlwPetal();
      p.init(
        {
          x: o.x + Math.cos(d) * radius * 0.18,
          y: o.y + Math.sin(d) * radius * 0.18,
        },
        pic,
        inclinaison,
        0.4,
        t1,
        t2,
        0,
        hatchingTime,
        color
          .clone()
          .setSat(Math.min(0.99, Math.max(0, sat + 0.3 * y)))
          .setValue(Math.min(0.99, Math.max(0, value + 0.15 * y))),
        option
      );
      this._children.push(p);
    }

    // Outer circle of petals
    t = 0;
    const lOuter = 8;
    for (let i = 0; t < 1; i++) {
      t += ((rand() * 0.4 + 0.8) * 1) / 2 / lOuter;
      const t1 = t;
      t += ((rand() * 0.4 + 0.8) * 1) / 2 / lOuter;
      const t2 = t;
      const y = 0.499 - Math.cos((t1 + t2) * Math.PI) / 2;

      const p = new FlwPetal();
      p.init(
        o,
        pic,
        inclinaison * 2,
        0.6,
        t1,
        t2,
        0.8,
        hatchingTime,
        color
          .clone()
          .setSat(Math.min(0.99, Math.max(0, sat + 0.3 * y)))
          .setValue(Math.min(0.99, Math.max(0, value + 0.15 * y))),
        option
      );
      this._children.push(p);
    }

    // Calyx / Tendrils around flower head
    let avaibleAngles = FlwIntervalle.create(d + Math.PI / 2, d - Math.PI / 2);
    let w = 1.2;
    while (rand() < w && avaibleAngles.getSum() > 0.1) {
      const a = avaibleAngles.getRandom(rand);
      avaibleAngles = avaibleAngles.intersection(
        FlwIntervalle.create(a + Math.PI / 7, a - Math.PI / 7)
      );
      const dir = { x: Math.cos(a), y: Math.sin(a) };
      const r = rand() * 40 + 20;
      const exA = { x: o.x - dir.x * r, y: o.y - dir.y * r };
      const exC = {
        x: o.x - dir.x * r + dir.y * r * 0.5,
        y: o.y - dir.y * r - dir.y * r * 0.5,
      };

      if (rand() > 0.3) {
        const tb = new FlwTwistedBranch();
        tb.initTwisted(
          o,
          dir,
          exA,
          exC,
          option,
          false,
          0,
          5,
          false,
          false,
          0,
          Math.ceil(
            (option.maxDeepnessTwisted +
              (rand() - 0.5) * option.maxDeepnessTwistedVar) /
              2
          )
        );
        this._children.push(tb);
      } else {
        const b = new FlwBranch();
        b.init(o, dir, exA, exC, option, false, 0, 5, false, false);
        this._children.push(b);
      }
      w -= 0.2;
    }

    this._children.sort((a, b) => {
      if (!a.getZ) return -1;
      if (!b.getZ) return 1;
      return b.getZ() - a.getZ();
    });

    // Small calyx leaves under flower head
    let leafAngles = FlwIntervalle.create(d + Math.PI / 1.5, d - Math.PI / 1.5);
    w = 1.2;
    while (rand() < w && leafAngles.getSum() > 0.1) {
      const a = leafAngles.getRandom(rand);
      leafAngles = leafAngles.intersection(
        FlwIntervalle.create(a + Math.PI / 4, a - Math.PI / 4)
      );
      const dec = (rand() - 0.5) * 10;
      const lf = new FlwLeaf();
      lf.init(
        {
          x: o.x + Math.cos(d) * 5 + Math.sin(d) * dec,
          y: o.y + Math.sin(d) * 5 - Math.cos(d) * dec,
        },
        a,
        0.7,
        option
      );
      this._children.push(lf);
      w -= 0.3;
    }
  }

  getHatchinTime(): number {
    let m = 0;
    for (let i = 0; i < this._children.length; i++) {
      const mm = this._children[i].getHatchinTime();
      if (m < mm) m = mm;
    }
    return m;
  }

  visitFromTo(
    contextDynamique: CanvasRenderingContext2D,
    contextStatique: CanvasRenderingContext2D,
    t1: number,
    t2: number
  ) {
    if (t2 > 0) {
      for (let i = 0; i < this._children.length; i++) {
        this._children[i].visitFromTo(
          contextDynamique,
          contextStatique,
          Math.max(0, t1),
          t2
        );
      }
    }
  }
}

export class FlwBranch implements FlwNode {
  protected _direction!: Point2D;
  protected _A!: Point2D;
  protected _C!: Point2D;
  protected _B!: Point2D;
  protected _children: FlwNode[] = [];
  protected _deepness = 0;
  protected _maxDeepness = 0;
  protected _grown = false;
  protected _master = false;
  protected _major = false;
  protected _option!: FlwOptions;
  protected _len = 0;

  init(
    A: Point2D,
    d: Point2D,
    exA: Point2D,
    exC: Point2D,
    option: FlwOptions,
    fork: boolean,
    deepness: number,
    maxDeepness: number,
    major: boolean,
    master: boolean
  ) {
    this._children = [];
    this._A = A;
    this._direction = d;
    this._deepness = deepness || 0;
    this._maxDeepness = maxDeepness || 0;
    this._option = option;
    this._major = major;
    this._master = master;
    this.pullCurve(exA, exC, fork);
    this._len = this._calcLength();
  }

  pullCurve(exA: Point2D, exC: Point2D, fork: boolean) {
    const rand = this._option.rand;
    let radius =
      this._option.radius + (rand() - 0.5) * this._option.radiusVar;
    if (!this._major) {
      radius *= 0.3 + 0.7 * (1 / (1.8 + this._deepness / 2));
    }

    this._B = {
      x: this._A.x + this._direction.x * radius,
      y: this._A.y + this._direction.y * radius,
    };

    let c_radius = radius * (0.2 + rand() * 0.5);
    const dirC = {
      x: this._A.x - exC.x,
      y: this._A.y - exC.y,
    };
    let n = Math.sqrt(dirC.x * dirC.x + dirC.y * dirC.y) || 1;

    if (fork) {
      const deviance = 0.2 + rand() * 0.5;
      dirC.x = (dirC.x / n) * (1 - deviance) + this._direction.x * deviance;
      dirC.y = (dirC.y / n) * (1 - deviance) + this._direction.y * deviance;
      n = Math.sqrt(dirC.x * dirC.x + dirC.y * dirC.y) || 1;
      c_radius *= 1 + rand();
    }

    this._C = {
      x: this._A.x + (dirC.x / n) * c_radius,
      y: this._A.y + (dirC.y / n) * c_radius,
    };
    void exA;
  }

  protected _pointAt(t: number): Point2D {
    return {
      x:
        (1 - t) * (1 - t) * this._A.x +
        2 * t * (1 - t) * this._C.x +
        t * t * this._B.x,
      y:
        (1 - t) * (1 - t) * this._A.y +
        2 * t * (1 - t) * this._C.y +
        t * t * this._B.y,
    };
  }

  protected _calcLength(): number {
    const n1 = Math.hypot(this._A.x - this._B.x, this._A.y - this._B.y);
    const n2 = Math.hypot(this._A.x - this._C.x, this._A.y - this._C.y);
    const n3 = Math.hypot(this._B.x - this._C.x, this._B.y - this._C.y);
    return (n1 + n2 + n3) / 2;
  }

  getLength(): number {
    return this._len;
  }

  getHatchinTime(): number {
    let m = 0;
    for (let i = 0; i < this._children.length; i++) {
      const mm = this._children[i].getHatchinTime();
      if (m < mm) m = mm;
    }
    return m + this.getLength();
  }

  protected _subCurve(t1: number, t2: number) {
    const a_ = t1 > 0.001 ? this._pointAt(t1) : this._A;
    const b_ = t2 < 0.999 ? this._pointAt(t2) : this._B;
    let c_: Point2D;

    if (t2 - t1 < 0.001) {
      c_ = { x: (a_.x + b_.x) * 0.5, y: (a_.y + b_.y) * 0.5 };
    } else if (t1 !== 0) {
      c_ = {
        x:
          (a_.x * t2 * t2 +
            b_.x * t1 * t1 -
            this._A.x * (t1 - t2) * (t1 - t2)) /
          (t1 * t2 * 2),
        y:
          (a_.y * t2 * t2 +
            b_.y * t1 * t1 -
            this._A.y * (t1 - t2) * (t1 - t2)) /
          (t1 * t2 * 2),
      };
    } else {
      const t = (t1 + t2) * 0.5;
      c_ = {
        x:
          (a_.x * (t - t2) * (t - t2) +
            b_.x * (t - t1) * (t - t1) -
            ((1 - t) * (1 - t) * this._A.x +
              2 * (1 - t) * t * this._C.x +
              t * t * this._B.x) *
              (t1 - t2) *
              (t1 - t2)) /
          ((t - t1) * (t - t2) * 2),
        y:
          (a_.y * (t - t2) * (t - t2) +
            b_.y * (t - t1) * (t - t1) -
            ((1 - t) * (1 - t) * this._A.y +
              2 * (1 - t) * t * this._C.y +
              t * t * this._B.y) *
              (t1 - t2) *
              (t1 - t2)) /
          ((t - t1) * (t - t2) * 2),
      };
    }
    return { a: a_, b: b_, c: c_ };
  }

  protected _widthStart(): number {
    if (this._major) return this._option.widthStart;
    return (
      this._option.widthEnd +
      (this._option.widthStart - this._option.widthEnd) /
        (1 + (this._deepness / (this._maxDeepness || 1)) * 4)
    );
  }

  protected _widthEnd(): number {
    if (this._children.length === 0 && this._grown)
      return this._option.widthEnd;
    if (this._major) return this._option.widthStart;
    return (
      this._option.widthEnd +
      (this._option.widthStart - this._option.widthEnd) /
        (1 + ((this._deepness + 1) / (this._maxDeepness || 1)) * 4)
    );
  }

  protected _colorStart(): FlwColor {
    if (this._major) return this._option.colorStart.clone();
    const alpha = 1 / (1 + (this._deepness / (this._maxDeepness || 1)) * 4);
    return FlwColor.createWithRGB(
      alpha * this._option.colorStart.getR() +
        (1 - alpha) * this._option.colorEnd.getR(),
      alpha * this._option.colorStart.getG() +
        (1 - alpha) * this._option.colorEnd.getG(),
      alpha * this._option.colorStart.getB() +
        (1 - alpha) * this._option.colorEnd.getB()
    );
  }

  protected _colorEnd(): FlwColor {
    if (this._major) return this._option.colorStart.clone();
    const alpha =
      1 / (1 + ((this._deepness + 1) / (this._maxDeepness || 1)) * 4);
    return FlwColor.createWithRGB(
      alpha * this._option.colorStart.getR() +
        (1 - alpha) * this._option.colorEnd.getR(),
      alpha * this._option.colorStart.getG() +
        (1 - alpha) * this._option.colorEnd.getG(),
      alpha * this._option.colorStart.getB() +
        (1 - alpha) * this._option.colorEnd.getB()
    );
  }

  buildTotal() {
    if (this._maxDeepness > 999) return;
    if (!this._grown) {
      this.grow();
      this._grown = true;
    }
    for (let i = 0; i < this._children.length; i++) {
      const child = this._children[i];
      if (child instanceof FlwBranch) {
        child.buildTotal();
      }
    }
  }

  grow() {
    const rand = this._option.rand;
    if (this._grown || this._deepness > this._maxDeepness) {
      if (this._major) {
        const aToC = Math.atan2(
          this._C.y - this._B.y,
          this._C.x - this._B.x
        );
        const lu = FlwIntervalle.create(
          aToC + Math.PI - Math.PI / 10,
          aToC + Math.PI + Math.PI / 10
        );
        const a = lu.getRandom(rand);
        const head = new FlwHead();
        head.init(this._B, a, this._option);
        this._children.push(head);
      }
      return;
    }

    const angles: number[] = [];
    const aToA = Math.atan2(this._A.y - this._B.y, this._A.x - this._B.x);
    const aToC = Math.atan2(this._C.y - this._B.y, this._C.x - this._B.x);
    let avaibleAngles = FlwIntervalle.create(
      this._option.globalDirection + Math.PI + Math.PI / 6,
      this._option.globalDirection + Math.PI - Math.PI / 6
    );

    avaibleAngles = avaibleAngles.intersection(
      FlwIntervalle.create(aToA + Math.PI / 4, aToA - Math.PI / 4)
    );
    avaibleAngles = avaibleAngles.intersection(
      FlwIntervalle.create(aToC + Math.PI / 6, aToC - Math.PI / 6)
    );

    if (this._major) {
      let lu = avaibleAngles.intersection(
        FlwIntervalle.create(
          this._option.globalDirection - Math.PI / 5,
          this._option.globalDirection + Math.PI / 5
        )
      );
      lu = lu.intersection(
        FlwIntervalle.create(
          this._option.globalDirection + Math.PI / 8,
          this._option.globalDirection - Math.PI / 8
        )
      );
      const a = lu.getRandom(rand);
      avaibleAngles = avaibleAngles.intersection(
        FlwIntervalle.create(a + Math.PI / 4, a - Math.PI / 4)
      );
      const mjb = new FlwBranch();
      mjb.init(
        this._B,
        { x: Math.cos(a), y: Math.sin(a) },
        this._A,
        this._C,
        this._option,
        false,
        this._deepness + 1,
        this._maxDeepness,
        this._major,
        this._master
      );
      this._children.push(mjb);
    }

    let w = this._major ? 1 : 0.8;
    while (rand() < w && avaibleAngles.getSum() > 0.1) {
      const a = avaibleAngles.getRandom(rand);
      angles.push(a);
      avaibleAngles = avaibleAngles.intersection(
        FlwIntervalle.create(a + Math.PI / 4, a - Math.PI / 4)
      );
      w -= 0.3;
    }

    for (let i = 0; i < angles.length; i++) {
      const a = angles[i];
      if (i !== 0 && rand() > 0.85) {
        const tb = new FlwTwistedBranch();
        tb.initTwisted(
          this._B,
          { x: Math.cos(a), y: Math.sin(a) },
          this._A,
          this._C,
          this._option,
          true,
          this._deepness + 1,
          this._major ? this._option.maxDeepness : this._maxDeepness,
          false,
          false,
          0,
          Math.floor(
            this._option.maxDeepnessTwisted +
              (rand() - 0.5) * this._option.maxDeepnessTwistedVar
          )
        );
        this._children.push(tb);
      } else {
        const fork = i !== 0 || this._major;
        const nmajor = this._major && fork && rand() > 0.94;
        const deepnessMax = fork
          ? nmajor
            ? Math.floor(
                this._option.maxDeepnessMajor +
                  (rand() - 0.5) * this._option.maxDeepnessMajorVar
              )
            : Math.floor(
                this._option.maxDeepness +
                  (rand() - 0.5) * this._option.maxDeepnessVar
              )
          : this._maxDeepness;

        const mjb = new FlwBranch();
        mjb.init(
          this._B,
          { x: Math.cos(a), y: Math.sin(a) },
          this._A,
          this._C,
          this._option,
          fork,
          fork && this._major ? 0 : this._deepness + 1,
          deepnessMax,
          nmajor,
          false
        );
        this._children.push(mjb);
      }
    }

    if (rand() > 0.78) {
      let lu = FlwIntervalle.create(aToA - Math.PI / 6, aToA + Math.PI / 6);
      lu = lu.intersection(
        FlwIntervalle.create(
          this._option.globalDirection + Math.PI - Math.PI / 4,
          this._option.globalDirection + Math.PI + Math.PI / 4
        )
      );
      if (lu.getSum() > 0.1) {
        const a = lu.getRandom(rand);
        const lf = new FlwLeaf();
        lf.init(
          this._B,
          a,
          this._major ? 1 : 5 / (this._deepness + 5),
          this._option
        );
        this._children.push(lf);
      }
    }

    this._grown = true;
  }

  drawFromToCurve(context: CanvasRenderingContext2D, t1: number, t2: number) {
    if (t2 - t1 < 0.001) return;
    const l = this.getLength();
    const t2_ = t2 / l;
    const t1_ = t1 / l;

    const ws = this._widthStart();
    const we = this._widthEnd();
    const cs = this._colorStart();
    const ce = this._colorEnd();
    const tmpColor = new FlwColor();
    tmpColor.init(0, 0, 0);

    const wSegs = ws + (we - ws) * t1_;
    const wSege = ws + (we - ws) * t2_;

    cs.setTint(cs.getTint() - (cs.getTint() - ce.getTint()) * t1_);
    cs.setSat(cs.getSat() - (cs.getSat() - ce.getSat()) * t1_);
    cs.setValue(cs.getValue() - (cs.getValue() - ce.getValue()) * t1_);

    ce.setTint(cs.getTint() - (cs.getTint() - ce.getTint()) * t2_);
    ce.setSat(cs.getSat() - (cs.getSat() - ce.getSat()) * t2_);
    ce.setValue(cs.getValue() - (cs.getValue() - ce.getValue()) * t2_);

    const km = Math.floor((t2_ - t1_) * Math.abs(we - ws) * 5) + 1;
    for (let k = 0; k < km; k++) {
      const s1 = t1_ + (k / km) * (t2_ - t1_);
      const s2 = t1_ + ((k + 1) / km) * (t2_ - t1_);
      const curv = this._subCurve(s1, s2);

      tmpColor.setTint(
        cs.getTint() * (1 - (k + 0.5) / km) + ce.getTint() * ((k + 0.5) / km)
      );
      tmpColor.setValue(
        cs.getValue() * (1 - (k + 0.5) / km) +
          ce.getValue() * ((k + 0.5) / km)
      );
      tmpColor.setSat(
        cs.getSat() * (1 - (k + 0.5) / km) + ce.getSat() * ((k + 0.5) / km)
      );

      if (this._option.strokeBranchWidth > 0) {
        const curvShort = this._subCurve(s1 + 0.004, s2);
        context.beginPath();
        context.moveTo(curvShort.a.x, curvShort.a.y);
        context.quadraticCurveTo(
          curvShort.c.x,
          curvShort.c.y,
          curvShort.b.x,
          curvShort.b.y
        );
        context.strokeStyle = this._option.strokeBranchColor;
        context.lineWidth =
          wSegs * (1 - (k + 0.5) / km) +
          wSege * ((k + 0.5) / km) +
          this._option.strokeBranchWidth * 2;
        context.stroke();
      }

      context.beginPath();
      context.moveTo(curv.a.x, curv.a.y);
      context.quadraticCurveTo(curv.c.x, curv.c.y, curv.b.x, curv.b.y);
      context.lineWidth =
        wSegs * (1 - (k + 0.5) / km) + wSege * ((k + 0.5) / km);
      context.strokeStyle = tmpColor.toString();
      context.stroke();
    }
  }

  visitFromTo(
    contextDynamique: CanvasRenderingContext2D,
    contextStatique: CanvasRenderingContext2D,
    t1: number,
    t2: number
  ) {
    const l = this.getLength();
    const t1_ = Math.max(0, t1 - l);
    const t2_ = t2 - l;

    if (!this._grown) {
      this.grow();
      this._grown = true;
    }

    if (t1 <= l) {
      this.drawFromToCurve(contextStatique, Math.max(0, t1), Math.min(t2, l));
    }

    if (t2_ > 0) {
      for (let i = 0; i < this._children.length; i++) {
        this._children[i].visitFromTo(
          contextDynamique,
          contextStatique,
          t1_,
          t2_
        );
      }
    }
  }

  static createSimple(
    A: Point2D,
    d: number,
    customOption: Partial<FlwOptions> = {}
  ): FlwBranch {
    const option = buildRomanticFlowerOptions(customOption);
    const b = new FlwBranch();
    const v = { x: Math.cos(d), y: Math.sin(d) };
    const rand = option.rand;
    b.init(
      A,
      v,
      { x: A.x - v.x * option.radius, y: A.y - v.y * option.radius },
      {
        x: A.x - v.x * option.radius * 0.5 + v.y * option.radius * 0.3,
        y: A.y - v.y * option.radius * 0.5 - v.x * option.radius * 0.3,
      },
      option,
      false,
      0,
      Math.floor(
        option.maxDeepnessMaster + (rand() - 0.5) * option.maxDeepnessMasterVar
      ),
      true,
      true
    );
    return b;
  }
}

export class FlwTwistedBranch extends FlwBranch {
  private _deepnessFromTwist = 0;
  private _deepnessMaxFromTwist = 0;

  initTwisted(
    A: Point2D,
    d: Point2D,
    exA: Point2D,
    exC: Point2D,
    option: FlwOptions,
    fork: boolean,
    deepness: number,
    maxDeepness: number,
    major: boolean,
    master: boolean,
    deepnessFromTwist: number,
    deepnessMaxFromTwist: number
  ) {
    this._deepnessFromTwist = deepnessFromTwist;
    this._deepnessMaxFromTwist = deepnessMaxFromTwist;
    super.init(
      A,
      d,
      exA,
      exC,
      option,
      fork,
      deepness,
      maxDeepness,
      major,
      master
    );
  }

  override grow() {
    const rand = this._option.rand;
    if ((rand() + 0.2) * this._deepnessFromTwist > 3) return;

    const cos = -0.5;
    const sin = Math.sqrt(3) / 2;
    let nd = {
      x: this._direction.x * cos - sin * this._direction.y,
      y: this._direction.x * sin + cos * this._direction.y,
    };

    const BC = {
      x: this._C.x - this._B.x,
      y: this._C.y - this._B.y,
    };

    if (
      this._direction.x * nd.y - this._direction.y * nd.x > 0 ===
      this._direction.x * BC.y - this._direction.y * BC.x > 0
    ) {
      nd = {
        x: this._direction.x * cos + sin * this._direction.y,
        y: -this._direction.x * sin + cos * this._direction.y,
      };
    }

    const tb = new FlwTwistedBranch();
    tb.initTwisted(
      this._B,
      nd,
      this._A,
      this._C,
      this._option,
      false,
      this._deepness + 1,
      this._maxDeepness,
      this._major,
      this._master,
      this._deepnessFromTwist + 1,
      this._deepnessMaxFromTwist
    );
    this._children.push(tb);
    this._grown = true;
  }

  override pullCurve(exA: Point2D, exC: Point2D, _fork: boolean) {
    const rand = this._option.rand;
    const dirExA = {
      x: this._A.x - exA.x,
      y: this._A.y - exA.y,
    };
    let radius = Math.hypot(dirExA.x, dirExA.y) * 0.65;
    if (this._deepnessFromTwist === 0) {
      radius =
        this._option.radius + (rand() - 0.5) * this._option.radiusVar;
    }

    this._B = {
      x: this._A.x + this._direction.x * radius,
      y: this._A.y + this._direction.y * radius,
    };

    const c_radius = radius * (0.5 + rand() * 0.3);
    const dirC = {
      x: this._A.x - exC.x,
      y: this._A.y - exC.y,
    };
    const n = Math.hypot(dirC.x, dirC.y) || 1;
    this._C = {
      x: this._A.x + (dirC.x / n) * c_radius,
      y: this._A.y + (dirC.y / n) * c_radius,
    };
  }
}
