import { useMemo } from 'react';
import { loop, blob, hatchCircle, line, star } from '../../sketch/rough';

const LOOKS = {
  habibi: { c1: '#ff9bc4', c2: '#c43c7e', mark: '#ffe27a' },
  laundry: { c1: '#9ff3ff', c2: '#1f8fb8', mark: '#ffffff' },
  cv: { c1: '#ffb59a', c2: '#c4442b', mark: '#ffffff' },
  fnf: { c1: '#c9f56a', c2: '#3f8a22', mark: '#fff3b0' },
};

// A small hand-inked planet for the star map. Each one gets a doodle that says what the project is about:
// a party ring for events, soap bubbles for laundry, a crosshair for the detector, a leaf for the foundation.
export default function MapPlanet({ look, r = 46, seed = 1, gid }) {
  const L = LOOKS[look] || LOOKS.habibi;
  const art = useMemo(() => ({
    o1: loop(0, 0, r, seed, 0.02),
    o2: loop(0, 0, r - 1.5, seed + 9, 0.03),
    hatch: hatchCircle(r - 3, seed, 40, 5.5),
    hi: line(-r * 0.55, -r * 0.42, -r * 0.3, -r * 0.66, seed + 2, 0.12),
  }), [r, seed]);
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <radialGradient id={gid} cx="0.32" cy="0.28" r="0.9">
          <stop offset="0" stopColor={L.c1} />
          <stop offset="1" stopColor={L.c2} />
        </radialGradient>
        <clipPath id={`${gid}c`}><circle r={r} /></clipPath>
      </defs>
      {look === 'habibi' && <path d={`M${-r * 1.55} ${r * 0.1}A${r * 1.55} ${r * 0.4} -18 0 1 ${r * 1.55} ${-r * 0.1}`} fill="none" stroke="var(--ink)" strokeWidth="9" opacity="0.9" transform="rotate(-18)" />}
      {look === 'habibi' && <path d={`M${-r * 1.55} ${r * 0.1}A${r * 1.55} ${r * 0.4} -18 0 1 ${r * 1.55} ${-r * 0.1}`} fill="none" stroke="#ffe27a" strokeWidth="5" transform="rotate(-18)" />}
      <circle r={r} fill={`url(#${gid})`} />
      <g clipPath={`url(#${gid}c)`}>
        <path d={art.hatch} fill="none" stroke="var(--ink)" strokeWidth="1.6" opacity="0.5" />
        {look === 'habibi' && (
          <g fill={L.mark}>
            <path d={star(-12, 6, 10, seed)} /><path d={star(14, -12, 7, seed + 2)} /><path d={star(16, 20, 6, seed + 4)} />
          </g>
        )}
        {look === 'laundry' && (
          <g fill="rgba(255,255,255,0.18)" stroke="#fff" strokeWidth="2">
            <path d={blob(-10, 6, 13, seed, 0.05)} /><path d={blob(16, -10, 8, seed + 1, 0.06)} /><path d={blob(14, 18, 6, seed + 2, 0.08)} />
          </g>
        )}
        {look === 'cv' && (
          <g fill="none" stroke="#fff" strokeWidth="3">
            <path d={loop(0, 0, 19, seed, 0.04)} /><path d="M-30 0H-10M10 0H30M0 -30V-10M0 10V30" />
          </g>
        )}
        {look === 'fnf' && (
          <g fill="none" stroke="#fff3b0" strokeWidth="3.4">
            <path d="M-14 16C-14-8 6-20 20-16 22-2 8 16-14 16zM-14 16L8-6" />
          </g>
        )}
      </g>
      <path d={art.hi} stroke="#fff" strokeWidth="4.5" opacity="0.8" fill="none" />
      <path d={art.o1} fill="none" stroke="var(--ink)" strokeWidth="2.2" opacity="0.7" />
      <path d={art.o2} fill="none" stroke="var(--ink)" strokeWidth="1" opacity="0.3" />
    </g>
  );
}
