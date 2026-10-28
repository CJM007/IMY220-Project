import { useEffect, useRef, useState } from 'react';
import { UNIVERSES } from './universes';
import { noiseURI } from './textures';
import { renderBody } from './Bodies';
import './Universe.css';

function Sky({ id, phase }) {
  const u = UNIVERSES[id].sky;
  const glows = u.glows.map(([at, c, r]) => `radial-gradient(circle farthest-corner at ${at}, ${c}, transparent ${r})`).join(', ');
  const nebula = noiseURI({ fx: 0.0016, fy: 0.0022, oct: 5, seed: u.nebula.seed, rgb: u.nebula.rgb, gain: 2.6, bias: -1.05, size: 1024, steps: 6 });
  return (
    <div className={`layer layer--sky is-${phase}`} style={{ background: u.base }}>
      <div className="sky__nebula" style={{ backgroundImage: nebula, opacity: u.nebula.opacity }} />
      <div className="sky__glows" style={{ background: glows }} />
    </div>
  );
}

function Bodies({ id, phase }) {
  const u = UNIVERSES[id];
  return (
    <div className={`layer layer--bodies is-${phase}`}>
      {u.bodies.map((b, i) => (
        <div
          key={i}
          className={`body body--${b.kind}`}
          style={{ left: b.x, top: b.y, '--size': b.size, '--depth': b.depth ?? 10, '--tilt': `${b.tilt ?? 0}deg` }}
        >
          <div className="body__float" style={{ '--bob': `${b.bob ?? 14}s`, animationDelay: `${-i * 3.1}s` }}>
            {renderBody(b)}
          </div>
        </div>
      ))}
    </div>
  );
}

// Keeps the universe we just left on screen while the new one lands, then lets it go.
export default function UniverseStage({ id }) {
  const [stack, setStack] = useState([{ id, key: 0 }]);
  const stageRef = useRef(null);

  useEffect(() => {
    setStack((s) => {
      const top = s[s.length - 1];
      return top.id === id ? s : [top, { id, key: top.key + 1 }];
    });
  }, [id]);

  useEffect(() => {
    if (stack.length < 2) return undefined;
    const t = setTimeout(() => setStack((s) => s.slice(-1)), 1700);
    return () => clearTimeout(t);
  }, [stack]);

  // Bodies drift a little against the mouse, the nearer ones more than the far ones.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const target = { x: 0, y: 0 };
    const now = { x: 0, y: 0 };
    let raf = 0;
    const tick = () => {
      now.x += (target.x - now.x) * 0.07;
      now.y += (target.y - now.y) * 0.07;
      el.style.setProperty('--px', now.x.toFixed(4));
      el.style.setProperty('--py', now.y.toFixed(4));
      raf = Math.abs(target.x - now.x) + Math.abs(target.y - now.y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e) => {
      target.x = e.clientX / window.innerWidth - 0.5;
      target.y = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const phaseOf = (i) => (i === stack.length - 1 ? 'arriving' : 'leaving');

  return (
    <div className="stage" ref={stageRef}>
      {stack.map((s, i) => <Sky key={`sky${s.key}`} id={s.id} phase={phaseOf(i)} />)}
      {stack.map((s, i) => <Bodies key={`b${s.key}`} id={s.id} phase={phaseOf(i)} />)}
    </div>
  );
}
