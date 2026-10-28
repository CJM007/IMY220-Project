import { useEffect, useMemo, useRef, useState } from 'react';
import SketchFrame from '../../components/Sketch/SketchFrame';
import { box, scribble } from '../../sketch/rough';
import { SKILL_GROUPS, LEVEL_WORDS } from '../../config/profile';

// A bar drawn as an empty pen outline that gets coloured in with a zigzag when it scrolls into view.
function Gauge({ level, seed, on }) {
  const art = useMemo(() => ({
    out: box(3, 3, 194, 16, seed, 2.4),
    out2: box(3, 3, 194, 16, seed + 5, 3),
    fill: scribble(6, 6, 188, 10, seed, 4.2),
  }), [seed]);
  return (
    <svg className="gauge" viewBox="0 0 200 22" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <g className="gauge__fill" style={{ '--lvl': `${level * 10}%`, clipPath: on ? `inset(0 calc(100% - ${level * 10}%) 0 0)` : 'inset(0 100% 0 0)' }}>
        <path d={art.fill} />
      </g>
      <path d={art.out2} className="gauge__line gauge__line--soft" />
      <path d={art.out} className="gauge__line" />
    </svg>
  );
}

export default function SkillsReadout() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') { setOn(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="skills" ref={ref}>
      {SKILL_GROUPS.map((g, gi) => (
        <SketchFrame data-reveal key={g.id} className="skills__group" seed={20 + gi} stroke={gi === 1 ? 'var(--pop)' : 'var(--accent)'} fill="rgba(12, 18, 46, 0.88)">
          <h3 className="skills__title">{g.title}</h3>
          <p className="skills__blurb note">{g.blurb}</p>
          <ul className="skills__list">
            {g.skills.map((s, i) => (
              <li key={s.name} className="skill">
                <div className="skill__row">
                  <span className="skill__name">{s.name}</span>
                  <span className="skill__word">{LEVEL_WORDS[s.level]}</span>
                </div>
                <Gauge level={s.level} seed={gi * 10 + i + 1} on={on} />
                <span className="sr-only">{s.level} out of 10</span>
              </li>
            ))}
          </ul>
        </SketchFrame>
      ))}
    </div>
  );
}
