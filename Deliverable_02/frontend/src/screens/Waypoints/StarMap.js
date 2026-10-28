import { useMemo } from 'react';
import { PROJECTS } from '../../config/projects';
import { href } from '../../hooks/useRoute';
import useReducedMotion from '../../hooks/useReducedMotion';
import { loop, line, star, arrow } from '../../sketch/rough';
import { seeded } from '../../components/Universe/textures';
import { Uncharted } from '../../components/Sketch/Doodles';
import MapPlanet from './MapPlanet';

// Where each project sits on the chart. The route curves through them in the order they were charted.
const SPOTS = {
  start: { x: 90, y: 470 },
  habibi: { x: 290, y: 330 },
  laundrytrack: { x: 520, y: 430 },
  'cv-detect': { x: 700, y: 245 },
  fnf: { x: 890, y: 130 },
};
const ORDER = ['start', 'habibi', 'laundrytrack', 'cv-detect', 'fnf'];

function curve(ids) {
  const pts = ids.map((id) => SPOTS[id]);
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const mx = (a.x + b.x) / 2;
    const bend = i % 2 ? -70 : 70;
    d += `Q${mx} ${(a.y + b.y) / 2 + bend} ${b.x} ${b.y}`;
  }
  return d;
}

export default function StarMap({ activeId }) {
  const reduce = useReducedMotion();
  const route = useMemo(() => curve(ORDER), []);
  const charted = useMemo(() => curve(ORDER), []);
  const stars = useMemo(() => {
    const rnd = seeded(12);
    return Array.from({ length: 26 }, (_, i) => ({ x: rnd() * 1000, y: rnd() * 560, r: 3 + rnd() * 6, big: i % 6 === 0 }));
  }, []);
  const consts = useMemo(() => [
    line(40, 70, 120, 40, 1, 0.02) + line(120, 40, 190, 90, 2, 0.02) + line(190, 90, 250, 60, 3, 0.02),
    line(560, 70, 620, 120, 4, 0.02) + line(620, 120, 690, 90, 5, 0.02) + line(690, 90, 760, 130, 6, 0.02),
    line(840, 380, 900, 430, 7, 0.02) + line(900, 430, 960, 400, 8, 0.02) + line(900, 430, 930, 500, 9, 0.02),
  ], []);

  return (
    <svg className="starmap" viewBox="0 0 1000 560" role="group" aria-label="Star map of my projects" focusable="false">
      <g className="starmap__bg" fill="none" stroke="var(--grey)" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" strokeDasharray="2 8">
        {consts.map((d, i) => <path key={i} d={d} />)}
      </g>
      <g aria-hidden="true">
        {stars.map((s, i) => <path key={i} d={star(s.x, s.y, s.r, i + 1)} fill={s.big ? 'var(--pop)' : 'var(--white)'} opacity={s.big ? 0.8 : 0.45} />)}
      </g>

      {/* The flight path: dotted where I have not been, solid-ish where I have */}
      <path d={route} className="starmap__route" fill="none" />
      <path d={charted} className="starmap__done" fill="none" />

      {/* Launch pad */}
      <g transform={`translate(${SPOTS.start.x} ${SPOTS.start.y})`} aria-hidden="true">
        <path d={loop(0, 0, 18, 4, 0.05)} fill="var(--pop)" stroke="var(--ink)" strokeWidth="3" />
        <path d="M-7 3l7-12 7 12" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="0" y="46" textAnchor="middle" className="starmap__note">launch pad</text>
      </g>

      {/* Margin notes, because every good map has them */}
      <g aria-hidden="true" fill="none" stroke="var(--pop)" strokeWidth="2.6" strokeLinecap="round">
        <path d={arrow(150, 150, 238, 268, 3, 0.3)} />
        <text x="40" y="136" className="starmap__note">start with this one!</text>
        <path d={arrow(740, 400, 716, 310, 5, 0.25)} />
        <text x="640" y="428" className="starmap__note starmap__note--dim">teaching computers to see</text>
      </g>

      {ORDER.slice(1).map((id, i) => {
        const p = PROJECTS.find((x) => x.id === id);
        const { x, y } = SPOTS[id];
        const open = p.status === 'charted';
        const rad = 46;
        const on = activeId === id;
        return (
          <a key={id} href={href('waypoints', id)} className={`node${on ? ' is-on' : ''}${open ? '' : ' is-dark'}`} aria-current={on ? 'page' : undefined} transform={`translate(${x} ${y})`}>
            <title>{open ? p.name : `${p.name} (not charted yet)`}</title>
            <circle r="74" className="node__hit" />
            <circle r="58" className="node__pulse" fill="none" />
            <circle r="58" className="node__pulse node__pulse--2" fill="none" />
            <path className="node__focus" d={loop(0, 0, 70, i + 3, 0.02)} fill="none" />
            <g className="node__body">
              {open ? <MapPlanet look={p.look} seed={i + 2} r={rad} gid={`mp${id}`} /> : <Uncharted r={36} />}
            </g>
            <text className="node__name" y={open ? 84 : 66} textAnchor="middle">{p.name}</text>
            <text className="node__kind" y={open ? 106 : 88} textAnchor="middle">{open ? p.kind : 'uncharted'}</text>
          </a>
        );
      })}

      {/* The ship, flying the charted part of the route */}
      <g className="starmap__ship" aria-hidden="true">
        <g transform="rotate(90)">
          <path d="M0 -17c8 6 12 17 11 29l-3 7h-16l-3-7c-1-12 3-23 11-29z" fill="#f4f6ff" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
          <path d="M-13 8l-9 11 5 3 9-6zM13 8l9 11-5 3-9-6z" fill="var(--pop)" stroke="var(--ink)" strokeWidth="2.4" strokeLinejoin="round" />
          <circle cx="0" cy="-2" r="4.5" fill="var(--accent)" stroke="var(--ink)" strokeWidth="2.4" />
          <path d="M-5 20l5 14 5-14" fill="#ffd54a" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
        </g>
        {!reduce && (
          <animateMotion dur="16s" repeatCount="indefinite" rotate="auto" path={charted} keyPoints="0;1;1" keyTimes="0;0.85;1" calcMode="linear" />
        )}
      </g>
    </svg>
  );
}
