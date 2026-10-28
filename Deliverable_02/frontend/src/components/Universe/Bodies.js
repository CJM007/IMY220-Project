import { useId, useMemo } from 'react';
import { noiseURI, seeded } from './textures';
import { blob, loop, line, poly, hatchCircle, arc } from '../../sketch/rough';

const clean = (s) => s.replace(/:/g, '');

// A ring seen at an angle. The back half is drawn behind the planet and the front half in front of it.
function Ring({ ring, half }) {
  const id = clean(useId());
  const { span, squash, tilt, hue } = ring;
  const bands = [
    { r: 62, w: 5, c: hue[0], o: 0.55 },
    { r: 69, w: 9, c: hue[1], o: 0.8 },
    { r: 77, w: 4, c: hue[2], o: 0.6 },
    { r: 83, w: 8, c: hue[0], o: 0.7 },
    { r: 92, w: 3, c: hue[1], o: 0.45 },
  ];
  const front = half === 'front';
  return (
    <svg
      className={`ring ring--${half}`}
      viewBox="-100 -100 200 200"
      style={{ width: `calc(var(--size) * ${span})`, transform: `translate(-50%, -50%) rotate(${tilt}deg)` }}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={`${id}${half}`}>
          <rect x="-100" y={front ? 0 : -100} width="200" height="100" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}${half})`} fill="none">
        {bands.map((b) => (
          <ellipse key={b.r} rx={b.r} ry={b.r * squash} stroke={b.c} strokeWidth={b.w * squash * 1.6} opacity={b.o} />
        ))}
        <ellipse rx="95" ry={95 * squash} stroke="var(--ink)" strokeWidth="1.2" opacity="0.4" />
        <ellipse rx="60" ry={60 * squash} stroke="var(--ink)" strokeWidth="1" opacity="0.35" />
      </g>
    </svg>
  );
}

// The pen work on top of a planet: a double outline that does not quite meet, pencil hatching on the shadow side,
// a couple of highlight dashes, and a few doodled marks so no two planets read the same.
function Ink({ seed }) {
  const art = useMemo(() => {
    const rnd = seeded(seed * 11 + 5);
    const marks = Array.from({ length: 4 }, (_, i) => {
      const a = rnd() * Math.PI * 2;
      const d = 18 + rnd() * 48;
      const x = Math.cos(a) * d;
      const y = Math.sin(a) * d;
      return { d: loop(x, y, 4 + rnd() * 7, seed * 7 + i, 0.08), o: 0.3 + rnd() * 0.25 };
    });
    return {
      shadowEdge: arc(0, 0, 98, 5 + (seed % 20), 175 + (seed % 25), seed, 0.008),
      shadowEdge2: arc(0, 0, 96.5, 30 + (seed % 15), 150, seed + 40, 0.012),
      lightEdge: arc(0, 0, 98, 205 + (seed % 20), 250 + (seed % 15), seed + 7, 0.008),
      hatch: hatchCircle(94, seed, 38, 6.5),
      hatch2: hatchCircle(94, seed + 3, -52, 11, 0.45),
      hi: [line(-66, -52, -48, -70, seed + 1, 0.12), line(-58, -40, -52, -47, seed + 2, 0.1)],
      marks,
      dots: Array.from({ length: 70 }, () => {
        // little ink dots, packed thicker towards the dark edge
        const a = (0.1 + rnd() * 0.95) * Math.PI * 0.95;
        const d = 30 + Math.sqrt(rnd()) * 66;
        return { x: Math.cos(a) * d * 0.92 + 8, y: Math.sin(a) * d * 0.92 + 8, r: 0.5 + rnd() * 1.4, o: 0.2 + rnd() * 0.35 };
      }).filter((d) => Math.hypot(d.x, d.y) < 94),
    };
  }, [seed]);
  return (
    <svg className="planet__ink" viewBox="-100 -100 200 200" aria-hidden="true">
      <path d={art.hatch} fill="none" stroke="var(--ink)" strokeWidth="1.3" strokeLinecap="round" opacity="0.34" />
      <path d={art.hatch2} fill="none" stroke="var(--ink)" strokeWidth="1.1" strokeLinecap="round" opacity="0.24" />
      {art.dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="var(--ink)" opacity={d.o} />)}
      {art.marks.map((m, i) => (
        <path key={i} d={m.d} fill="none" stroke="var(--ink)" strokeWidth="1.1" strokeLinecap="round" opacity={m.o * 0.55} />
      ))}
      {art.hi.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" opacity="0.5" />
      ))}
      <path d={art.shadowEdge} fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <path d={art.shadowEdge2} fill="none" stroke="var(--ink)" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <path d={art.lightEdge} fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

const hashOf = (str) => [...str].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % 997;

export function Planet({ look, ring }) {
  const layers = useMemo(() => look.tex.map((t) => noiseURI({ ...t, steps: 4 })), [look]);
  const images = [...layers, look.base].join(', ');
  const seed = useMemo(() => hashOf(look.base + look.atmo), [look]);
  const grain = useMemo(() => noiseURI({ fx: 0.7, fy: 0.7, oct: 2, seed: seed + 1, rgb: [10, 12, 28], gain: 7, bias: -3.9, size: 256, steps: 2 }), [seed]);
  const chalk = useMemo(() => noiseURI({ fx: 0.45, fy: 0.9, oct: 2, seed: seed + 9, rgb: [255, 246, 220], gain: 7, bias: -4.2, size: 256, steps: 2 }), [seed]);
  return (
    <div className="planet" style={{ '--atmo': look.atmo, '--spin': `${look.spin}s` }}>
      {ring && <Ring ring={ring} half="back" />}
      <div className="planet__halo" />
      <div className="planet__sphere">
        <div className="planet__surface" style={{ backgroundImage: images }} />
        <div className="planet__shade" />
        <div className="planet__grain" style={{ backgroundImage: grain }} />
        <div className="planet__chalk" style={{ backgroundImage: chalk }} />
      </div>
      <Ink seed={seed} />
      {ring && <Ring ring={ring} half="front" />}
    </div>
  );
}

const rays = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  const long = i % 2 === 0;
  const r0 = 52;
  const r1 = long ? 98 : 78;
  const w = 0.1;
  return poly([
    [Math.cos(a - w) * r0, Math.sin(a - w) * r0],
    [Math.cos(a) * r1, Math.sin(a) * r1],
    [Math.cos(a + w) * r0, Math.sin(a + w) * r0],
  ], 20 + i, 3);
});

export function Sun({ c, c2 }) {
  return (
    <div className="sun" style={{ '--c': c, '--c2': c2 }}>
      <div className="sun__glow" />
      <svg className="sun__rays" viewBox="-100 -100 200 200" aria-hidden="true">
        {rays.map((d, i) => (
          <path key={i} d={d} fill={i % 2 ? 'none' : 'var(--c)'} fillOpacity="0.55" stroke="var(--c2)" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" opacity={i % 2 ? 0.45 : 0.85} />
        ))}
      </svg>
      <div className="sun__core" />
      <div className="sun__grain" style={{ backgroundImage: noiseURI({ fx: 0.6, fy: 0.6, oct: 2, seed: 5, rgb: [120, 40, 0], gain: 7, bias: -3.8, size: 256, steps: 2 }) }} />
      <svg className="sun__ink" viewBox="-100 -100 200 200" aria-hidden="true">
        <path d={arc(0, 0, 97, 20, 170, 8, 0.01)} fill="none" stroke="var(--c2)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M-52 -28Q-30 -58 8 -52M-38 -10Q-22 -34 -2 -34" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" opacity="0.8" />
        <path d="M26 52q16-8 22-24M12 66q26-6 40-34" fill="none" stroke="var(--c2)" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      </svg>
    </div>
  );
}

// A black hole with a bright ring of light bent over the top, and rings of signal spreading out from it.
export function BlackHole() {
  const id = clean(useId());
  return (
    <div className="bh">
      <svg viewBox="-200 -200 400 400" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}d`} x1="0" x2="1">
            <stop offset="0" stopColor="#ff5a1f" />
            <stop offset="0.35" stopColor="#ffb067" />
            <stop offset="0.5" stopColor="#fff6dc" />
            <stop offset="0.65" stopColor="#ffb067" />
            <stop offset="1" stopColor="#ff5a1f" />
          </linearGradient>
          <radialGradient id={`${id}g`}>
            <stop offset="0.3" stopColor="#ff7a2f" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ff7a2f" stopOpacity="0" />
          </radialGradient>
          <filter id={`${id}b`} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
          <clipPath id={`${id}bk`}><rect x="-200" y="-200" width="400" height="200" /></clipPath>
          <clipPath id={`${id}fr`}><rect x="-200" y="0" width="400" height="200" /></clipPath>
        </defs>
        <circle r="200" fill={`url(#${id}g)`} />
        <g className="bh__signal" fill="none" stroke="#ffb067">
          <circle r="90" /><circle r="90" /><circle r="90" />
        </g>
        <g transform="rotate(-12)">
          <ellipse clipPath={`url(#${id}bk)`} rx="178" ry="34" fill="none" stroke={`url(#${id}d)`} strokeWidth="16" filter={`url(#${id}b)`} />
          <circle r="76" fill="none" stroke="#ffd7a0" strokeWidth="7" filter={`url(#${id}b)`} opacity="0.95" />
          <circle r="66" fill="#000" />
          <path d={loop(0, 0, 67, 5, 0.02)} fill="none" stroke="#fff3d6" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
          <ellipse clipPath={`url(#${id}fr)`} rx="178" ry="34" fill="none" stroke={`url(#${id}d)`} strokeWidth="18" filter={`url(#${id}b)`} />
          <path d={line(-176, 8, 176, 8, 9, 0.02)} fill="none" stroke="var(--ink)" strokeWidth="2" opacity="0.55" />
          <ellipse className="bh__disc" clipPath={`url(#${id}fr)`} rx="178" ry="34" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="18 30" />
        </g>
      </svg>
    </div>
  );
}

export function Belt() {
  const rocks = useMemo(() => {
    const rnd = seeded(41);
    const tones = ['#8a7a6a', '#a89584', '#6d6258', '#c2ad96', '#5b544e'];
    return Array.from({ length: 360 }, () => {
      const a = rnd() * Math.PI * 2;
      const spread = (rnd() - 0.5) * 2;
      const cx = 500 + Math.cos(a) * (455 + spread * 20);
      const cy = 150 + Math.sin(a) * (66 + spread * 7);
      const s = 0.9 + rnd() * rnd() * 5.5;
      const pts = Array.from({ length: 6 }, (_, i) => {
        const t = (i / 6) * Math.PI * 2;
        const r = s * (0.7 + rnd() * 0.5);
        return `${(cx + Math.cos(t) * r).toFixed(1)},${(cy + Math.sin(t) * r).toFixed(1)}`;
      }).join(' ');
      return { pts, c: tones[Math.floor(rnd() * tones.length)], o: 0.55 + rnd() * 0.4 };
    });
  }, []);
  return (
    <svg className="belt" viewBox="0 0 1000 300" aria-hidden="true">
      {rocks.map((r, i) => (
        <polygon key={i} points={r.pts} fill={r.c} opacity={r.o} stroke="#0a0d1c" strokeWidth="0.45" strokeOpacity="0.6" strokeLinejoin="round" />
      ))}
    </svg>
  );
}

// A lonely old station, tumbling slowly.
export function Station() {
  return (
    <svg className="station" viewBox="-100 -100 200 200" aria-hidden="true">
      <g stroke="#0a0d1c" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" filter="url(#scribble-big)">
        <path d={poly([[-92, -14], [-40, -14], [-40, 14], [-92, 14]], 3, 3)} fill="#39507a" />
        <path d={poly([[40, -14], [92, -14], [92, 14], [40, 14]], 4, 3)} fill="#39507a" />
        <path d="M-92 0h52M40 0h52M-66-14v28M66-14v28" stroke="#8fb3ff" strokeWidth="1.5" fill="none" />
        <path d={poly([[-40, -4], [-20, -4], [-20, 4], [-40, 4]], 5, 2)} fill="#8C97B8" />
        <path d={poly([[20, -4], [40, -4], [40, 4], [20, 4]], 6, 2)} fill="#8C97B8" />
        <path d={blob(0, 0, 22, 4, 0.04)} fill="#d8ddea" />
        <path d={blob(0, 0, 10, 5, 0.06)} fill="#0b1330" />
        <circle r="6" fill="#b7f04a" />
        <path d="M0-22V-46" strokeLinecap="round" />
        <circle cy="-50" r="4" fill="#ff6f91" />
      </g>
    </svg>
  );
}

export function Debris() {
  const bits = useMemo(() => {
    const rnd = seeded(77);
    return Array.from({ length: 9 }, (_, i) => ({
      x: rnd() * 80 + 10,
      y: rnd() * 70 + 15,
      s: 4 + rnd() * 9,
      rot: rnd() * 360,
      dur: 18 + rnd() * 22,
      c: ['#a7b590', '#6f7d5a', '#c9d3b3'][i % 3],
      pts: Array.from({ length: 5 }, (_, k) => {
        const t = (k / 5) * Math.PI * 2;
        const r = 0.6 + rnd() * 0.6;
        return `${(Math.cos(t) * r).toFixed(2)},${(Math.sin(t) * r).toFixed(2)}`;
      }).join(' '),
    }));
  }, []);
  return (
    <div className="debris">
      {bits.map((b, i) => (
        <svg key={i} viewBox="-1.5 -1.5 3 3" style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.s}%`, animationDuration: `${b.dur}s`, transform: `rotate(${b.rot}deg)` }} aria-hidden="true">
          <polygon points={b.pts} fill={b.c} stroke="#0a0d1c" strokeWidth="0.18" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}

export function renderBody(b) {
  switch (b.kind) {
    case 'planet': return <Planet look={b.look} ring={b.ring} />;
    case 'sun': return <Sun c={b.c} c2={b.c2} />;
    case 'blackhole': return <BlackHole />;
    case 'belt': return <Belt />;
    case 'station': return <Station />;
    case 'debris': return <Debris />;
    default: return null;
  }
}
