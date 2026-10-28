import { useEffect, useRef } from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';

// The title floats like it has no weight. Each letter drifts on its own and gets pushed away when the cursor comes close.
export default function ZeroGTitle({ lines }) {
  const rootRef = useRef(null);
  const reduced = useReducedMotion();
  let n = 0;

  useEffect(() => {
    if (reduced) return undefined;
    const els = [...rootRef.current.querySelectorAll('[data-g]')];
    const st = els.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, cx: 0, cy: 0 }));
    let ptr = null;
    let raf = 0;

    const measure = () =>
      els.forEach((el, i) => {
        const b = el.getBoundingClientRect();
        st[i].cx = b.left + b.width / 2 - st[i].x;
        st[i].cy = b.top + b.height / 2 - st[i].y;
      });

    const tick = () => {
      let energy = 0;
      els.forEach((el, i) => {
        const s = st[i];
        let tx = 0;
        let ty = 0;
        if (ptr) {
          const dx = s.cx - ptr.x;
          const dy = s.cy - ptr.y;
          const d = Math.hypot(dx, dy) || 1;
          const R = 190;
          if (d < R) {
            const f = ((R - d) / R) ** 1.4;
            tx = (dx / d) * f * 90;
            ty = (dy / d) * f * 90;
          }
        }
        s.vx += (tx - s.x) * 0.055;
        s.vy += (ty - s.y) * 0.055;
        s.vx *= 0.88;
        s.vy *= 0.88;
        s.x += s.vx;
        s.y += s.vy;
        el.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) rotate(${(s.x * 0.22).toFixed(2)}deg)`;
        energy += Math.abs(s.vx) + Math.abs(s.vy) + Math.abs(tx - s.x) + Math.abs(ty - s.y);
      });
      raf = energy > 0.08 || ptr ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e) => {
      ptr = { x: e.clientX, y: e.clientY };
      if (!raf) {
        measure();
        raf = requestAnimationFrame(tick);
      }
    };
    const onLeave = () => { ptr = null; };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const text = lines.join(' ');
  return (
    <h1 id="launch-title" className="zg" ref={rootRef} aria-label={text}>
      {lines.map((line) => (
        <span className="zg__line" key={line} aria-hidden="true">
          {line.split(' ').map((word, wi, words) => (
            <span className="zg__word" key={wi}>
              {word.split('').map((ch) => {
                const i = n++;
                const r = (k) => ((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1;
                return (
                  <span className="zg__slot" data-g key={i}>
                    <span
                      className="zg__letter"
                      style={{
                        '--i': i,
                        '--dx': `${(r(1) - 0.5) * 0.16}em`,
                        '--dy': `${(r(2) - 0.5) * 0.2}em`,
                        '--dr': `${(r(3) - 0.5) * 9}deg`,
                        '--dur': `${5 + r(4) * 5}s`,
                      }}
                    >
                      {ch}
                    </span>
                  </span>
                );
              })}
              {wi < words.length - 1 && <span className="zg__space" />}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
