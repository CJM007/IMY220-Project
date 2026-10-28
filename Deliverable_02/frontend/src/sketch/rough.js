// Tiny helpers for drawing things that look like a person drew them: lines that wander a little,
// circles that never quite close, and a second pass over the top. Everything is seeded, so a drawing
// looks identical on every visit (and in every screenshot).
import { seeded } from '../components/Universe/textures';

export const f = (n) => Math.round(n * 10) / 10;

// A closed, slightly lumpy circle. Two passes with different seeds give the "drew it twice" look.
export function blob(cx, cy, r, seed = 1, wob = 0.035, n = 24) {
  const rnd = seeded(seed * 97 + 13);
  const start = rnd() * Math.PI * 2;
  const pts = Array.from({ length: n }, (_, i) => {
    const t = start + (i / n) * Math.PI * 2;
    const k = r * (1 + (rnd() - 0.5) * 2 * wob);
    return [cx + Math.cos(t) * k, cy + Math.sin(t) * k];
  });
  return smooth(pts, true);
}

// Part of a circle between two angles (degrees), drawn as one loose pen stroke. Used for edges that fade in and out
// instead of closing into an obvious outline.
export function arc(cx, cy, r, a0, a1, seed = 1, wob = 0.02) {
  const rnd = seeded(seed * 61 + 29);
  const n = Math.max(4, Math.round((a1 - a0) / 14));
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    const k = r * (1 + (rnd() - 0.5) * 2 * wob);
    return [cx + Math.cos(t) * k, cy + Math.sin(t) * k];
  });
  return smooth(pts, false);
}

// A circle that is drawn in one stroke and overshoots where it started, like a real pen would.
export function loop(cx, cy, r, seed = 1, wob = 0.03) {
  const rnd = seeded(seed * 53 + 7);
  const start = rnd() * Math.PI * 2;
  const n = 28;
  const over = 1.12;
  const pts = Array.from({ length: n + 3 }, (_, i) => {
    const t = start + (i / n) * Math.PI * 2 * over;
    const k = r * (1 + (rnd() - 0.5) * 2 * wob) * (1 - i * 0.0012);
    return [cx + Math.cos(t) * k, cy + Math.sin(t) * k];
  });
  return smooth(pts, false);
}

// A wandering line between two points.
export function line(x1, y1, x2, y2, seed = 1, bow = 0.04) {
  const rnd = seeded(seed * 31 + 5);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const pts = [0, 0.33, 0.66, 1].map((t, i) => {
    const off = i === 0 || i === 3 ? (rnd() - 0.5) * 1.2 : (rnd() - 0.5) * len * bow * 2;
    return [x1 + dx * t + nx * off, y1 + dy * t + ny * off];
  });
  return smooth(pts, false);
}

// A polygon with every corner nudged and every edge a touch curved.
export function poly(points, seed = 1, wob = 1.2) {
  const rnd = seeded(seed * 71 + 3);
  const pts = points.map(([x, y]) => [x + (rnd() - 0.5) * wob, y + (rnd() - 0.5) * wob]);
  return smooth(pts, true, 0.07);
}

// A rectangle with rounded, uneven corners.
export function box(x, y, w, h, seed = 1, wob = 2) {
  const rnd = seeded(seed * 19 + 11);
  const j = () => (rnd() - 0.5) * wob;
  const pts = [
    [x + j(), y + j()], [x + w * 0.5 + j(), y + j() * 0.6], [x + w + j(), y + j()],
    [x + w + j() * 0.6, y + h * 0.5 + j()], [x + w + j(), y + h + j()], [x + w * 0.5 + j(), y + h + j() * 0.6],
    [x + j(), y + h + j()], [x + j() * 0.6, y + h * 0.5 + j()],
  ];
  return smooth(pts, true, 0.07);
}

// A 4 point star, the way you would draw one in the margin.
export function star(cx, cy, r, seed = 1) {
  const rnd = seeded(seed * 13 + 1);
  const j = () => (rnd() - 0.5) * r * 0.18;
  return `M${f(cx + j())} ${f(cy - r)}L${f(cx + r * 0.2 + j())} ${f(cy - r * 0.2)}L${f(cx + r)} ${f(cy + j())}L${f(cx + r * 0.2)} ${f(cy + r * 0.2 + j())}L${f(cx + j())} ${f(cy + r)}L${f(cx - r * 0.2 + j())} ${f(cy + r * 0.2)}L${f(cx - r)} ${f(cy + j())}L${f(cx - r * 0.2)} ${f(cy - r * 0.2 + j())}Z`;
}

// A zigzag scribble across a box, used to colour things in like a marker would.
export function scribble(x, y, w, h, seed = 1, gap = 5) {
  const rnd = seeded(seed * 41 + 9);
  let d = `M${f(x)} ${f(y + h * 0.5)}`;
  let up = true;
  for (let px = x; px < x + w + gap; px += gap) {
    d += `L${f(px + (rnd() - 0.5) * 1.5)} ${f(up ? y + rnd() * 1.5 : y + h - rnd() * 1.5)}`;
    up = !up;
  }
  return d;
}

// A little arrow with a curve in it, for margin notes.
export function arrow(x1, y1, x2, y2, seed = 1, curve = 0.25) {
  const rnd = seeded(seed * 29 + 17);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const k = (rnd() > 0.5 ? 1 : -1) * curve;
  const cx = mx - dy * k;
  const cy = my + dx * k;
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const h = 9;
  const a1 = ang + 2.6;
  const a2 = ang - 2.6;
  return (
    `M${f(x1)} ${f(y1)}Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}` +
    `M${f(x2 + Math.cos(a1) * h)} ${f(y2 + Math.sin(a1) * h)}L${f(x2)} ${f(y2)}L${f(x2 + Math.cos(a2) * h)} ${f(y2 + Math.sin(a2) * h)}`
  );
}

// Parallel pencil lines clipped to a circle, for shading the dark side of a planet.
export function hatchCircle(r, seed = 1, angle = 40, step = 7, shadowFrom = -0.05) {
  const rnd = seeded(seed * 37 + 23);
  const a = (angle * Math.PI) / 180;
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const px = -uy;
  const py = ux;
  let d = '';
  // the light comes from the top left, so offsets along (1, 1) are in shadow
  const lx = Math.SQRT1_2;
  const ly = Math.SQRT1_2;
  for (let o = -r; o <= r; o += step) {
    const half = Math.sqrt(Math.max(0, r * r - o * o)) * 0.96;
    const cx = px * o;
    const cy = py * o;
    const shade = (cx * lx + cy * ly) / r;
    if (shade < shadowFrom) continue;
    const cut = 1 - Math.min(1, shade * 0.9);
    const from = -half + half * 2 * (cut * 0.55 + rnd() * 0.08);
    const to = half - rnd() * 4;
    d += `M${f(cx + ux * from)} ${f(cy + uy * from)}L${f(cx + ux * to)} ${f(cy + uy * to)}`;
  }
  return d;
}

// Catmull-Rom style smoothing into a path string.
function smooth(pts, closed, tension = 0.105) {
  const n = pts.length;
  const at = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) * tension * 1.6;
    const c1y = p1[1] + (p2[1] - p0[1]) * tension * 1.6;
    const c2x = p2[0] - (p3[0] - p1[0]) * tension * 1.6;
    const c2y = p2[1] - (p3[1] - p1[1]) * tension * 1.6;
    d += `C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? `${d}Z` : d;
}
