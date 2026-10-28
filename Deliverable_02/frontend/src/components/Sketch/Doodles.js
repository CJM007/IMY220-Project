import { useMemo } from 'react';
import { loop, line, blob, poly, box, star, arrow } from '../../sketch/rough';

export function Squiggle({ seed = 1, width = 220 }) {
  const d = useMemo(() => {
    let p = 'M2 8';
    for (let x = 2; x < width; x += 14) p += `q7 ${x % 28 ? 7 : -7} 14 0`;
    return p;
  }, [width]);
  return (
    <svg className="squiggle" viewBox={`0 0 ${width} 16`} style={{ maxWidth: width }} aria-hidden="true" focusable="false">
      <path d={d} />
      <path d={line(2, 12, width - 8, 11, seed, 0.02)} style={{ strokeWidth: 2, opacity: 0.5 }} />
    </svg>
  );
}

// A helmeted pilot, drawn the way you would doodle one in a notebook. The visor shows the pilot's face.
export function PilotDoodle({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 200 220" aria-hidden="true" focusable="false" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g stroke="#0a0d1c" strokeWidth="4">
        <path d={poly([[44, 215], [48, 160], [78, 142], [122, 142], [152, 160], [156, 215]], 3, 4)} fill="#f4f6ff" />
        <path d={blob(100, 88, 62, 4, 0.03)} fill="#f4f6ff" />
        <path d={blob(100, 92, 44, 7, 0.04)} fill="#0a1a40" />
        <path d={line(70, 150, 130, 150, 5, 0.06)} />
        <path d={poly([[84, 176], [116, 176], [116, 200], [84, 200]], 8, 3)} fill="var(--pop)" />
      </g>
      <g>
        <clipPath id="pilot-visor"><path d={blob(100, 92, 42, 7, 0.04)} /></clipPath>
        <g clipPath="url(#pilot-visor)">
          <image href={`${process.env.PUBLIC_URL || '.'}/pilot-face.jpg`} x="56" y="48" width="88" height="88" preserveAspectRatio="xMidYMid slice" />
          <rect x="56" y="48" width="88" height="88" fill="#1c4f8a" opacity="0.2" />
        </g>
        <path d={line(64, 76, 70, 64, 9, 0.2)} stroke="#fff" strokeWidth="5" opacity="0.85" />
        <path d={line(134, 70, 140, 82, 10, 0.2)} stroke="#fff" strokeWidth="3" opacity="0.6" />
        <path d={blob(100, 92, 42, 7, 0.04)} stroke="#0a0d1c" strokeWidth="3" opacity="0.5" />
      </g>
      <g stroke="#0a0d1c" strokeWidth="3.4">
        <path d={line(100, 28, 100, 10, 6, 0.05)} />
        <path d={blob(100, 8, 5, 6, 0.1)} fill="var(--pop)" />
        <path d={line(50, 168, 62, 172, 3, 0.1)} />
      </g>
      <path d={star(176, 40, 12, 3)} fill="var(--pop)" stroke="#0a0d1c" strokeWidth="2" />
      <path d={star(24, 70, 8, 5)} fill="var(--accent)" stroke="#0a0d1c" strokeWidth="2" />
      <path d={arrow(30, 30, 60, 52, 8, 0.3)} stroke="var(--pop)" strokeWidth="3" />
    </svg>
  );
}

// The uncharted node: a dashed circle with a question mark.
export function Uncharted({ r = 34 }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={loop(0, 0, r, 9, 0.04)} stroke="var(--grey)" strokeWidth="3" strokeDasharray="4 9" />
      <path d="M-9 -9c0-9 18-9 18 0 0 7-9 6-9 15M0 17v1" stroke="var(--grey)" strokeWidth="4" />
    </g>
  );
}

// The whole pilot, head to boots, for floating around the site. Limbs are separate groups so they can drift.
export function AstronautFull({ className = '' }) {
  const ink = '#0a0d1c';
  const suit = '#f4f6ff';
  return (
    <svg className={className} viewBox="0 0 220 340" aria-hidden="true" focusable="false" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g stroke={ink} strokeWidth="4">
        {/* tether */}
        <path className="astro__tether" d="M70 170c-30 10-44 36-30 60s-6 40-26 36" stroke="var(--pop)" strokeWidth="3" strokeDasharray="2 7" />
        {/* backpack */}
        <path d={poly([[62, 128], [158, 128], [162, 218], [58, 218]], 21, 3)} fill="#b8c2e6" />
        {/* legs */}
        <g className="astro__legL">
          <path d={poly([[84, 214], [108, 214], [100, 274], [76, 270]], 22, 2)} fill={suit} />
          <path d={poly([[70, 268], [102, 272], [104, 292], [64, 290]], 23, 2)} fill="var(--pop)" />
        </g>
        <g className="astro__legR">
          <path d={poly([[112, 214], [138, 214], [152, 266], [128, 272]], 24, 2)} fill={suit} />
          <path d={poly([[126, 268], [156, 262], [166, 282], [130, 292]], 25, 2)} fill="var(--pop)" />
        </g>
        {/* torso */}
        <path d={poly([[70, 126], [150, 126], [156, 212], [64, 212]], 26, 3)} fill={suit} />
        <path d={box(92, 150, 36, 26, 27, 2)} fill="var(--pop)" />
        <path d={line(70, 196, 150, 196, 28, 0.05)} />
        {/* left arm: waving */}
        <g className="astro__armL">
          <path d={poly([[70, 134], [50, 120], [30, 80], [44, 72], [62, 108], [78, 122]], 29, 2)} fill={suit} />
          <path d={blob(36, 70, 13, 30, 0.1)} fill="var(--accent)" />
        </g>
        {/* right arm: drifting down */}
        <g className="astro__armR">
          <path d={poly([[150, 134], [172, 156], [178, 192], [164, 196], [156, 166], [144, 150]], 31, 2)} fill={suit} />
          <path d={blob(172, 204, 13, 32, 0.1)} fill="var(--accent)" />
        </g>
        {/* helmet */}
        <path d={blob(110, 74, 60, 33, 0.03)} fill={suit} />
        <path d={blob(110, 78, 44, 34, 0.04)} fill="#0a1a40" />
        <path d={line(80, 128, 140, 128, 35, 0.06)} />
        <path d={line(110, 16, 110, 2, 36, 0.05)} />
        <path d={blob(110, 2, 5, 37, 0.1)} fill="var(--pop)" />
      </g>
      <clipPath id="astro-visor"><path d={blob(110, 78, 42, 34, 0.04)} /></clipPath>
      <g clipPath="url(#astro-visor)">
        <image href={`${process.env.PUBLIC_URL || '.'}/pilot-face.jpg`} x="66" y="34" width="88" height="88" preserveAspectRatio="xMidYMid slice" />
        <rect x="66" y="34" width="88" height="88" fill="#1c4f8a" opacity="0.2" />
      </g>
      <path d={line(74, 62, 80, 50, 38, 0.2)} stroke="#fff" strokeWidth="5" opacity="0.8" />
      <path d={line(144, 56, 150, 68, 39, 0.2)} stroke="#fff" strokeWidth="3" opacity="0.6" />
      <path d={blob(110, 78, 42, 34, 0.04)} stroke={ink} strokeWidth="3" opacity="0.5" />
    </svg>
  );
}
