import { useEffect, useRef } from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';
import './Starfield.css';

// Three depth layers. Far stars are small, dim and slow. Near stars are larger and quicker.
const LAYERS = [
  { density: 0.00012, min: 40, speed: 6, size: [0.4, 0.9], alpha: [0.25, 0.6], parallax: 6 },
  { density: 0.00005, min: 24, speed: 14, size: [0.7, 1.3], alpha: [0.4, 0.8], parallax: 14 },
  { density: 0.000018, min: 10, speed: 32, size: [1.1, 2.0], alpha: [0.6, 1], parallax: 30 },
];


const rand = (a, b) => a + Math.random() * (b - a);

function makeStars(w, h) {
  return LAYERS.map((layer) => {
    const count = Math.max(layer.min, Math.round(w * h * layer.density));
    return Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: rand(...layer.size),
      a: rand(...layer.alpha),
      ti: Math.floor(Math.random() * 5),
      phase: Math.random() * Math.PI * 2,
      rate: rand(0.4, 1.4),
    }));
  });
}

// pulseKey: change it to send the ship through a short burst of speed, used on every screen change.
export default function Starfield({ pulseKey, tints }) {
  const canvasRef = useRef(null);
  const tintsRef = useRef(tints);
  tintsRef.current = tints;
  const boostRef = useRef(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!reduced) boostRef.current = 1;
  }, [pulseKey, reduced]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let stars = [];
    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = makeStars(w, h);
      draw(0);
    };

    const onPointer = (e) => {
      pointer.x = e.clientX / w - 0.5;
      pointer.y = e.clientY / h - 0.5;
    };

    function draw(dt) {
      ctx.clearRect(0, 0, w, h);
      const boost = boostRef.current;
      const speedUp = 1 + boost * 38;

      pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 3);
      pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 3);

      LAYERS.forEach((layer, i) => {
        const ox = -pointer.sx * layer.parallax;
        const oy = -pointer.sy * layer.parallax;
        const streak = layer.speed * boost * 1.6;

        for (const s of stars[i]) {
          if (!reduced) {
            s.x -= layer.speed * speedUp * dt;
            s.y += layer.speed * 0.12 * dt;
            if (s.x < -60) s.x = w + 10;
            if (s.y > h + 10) s.y = -10;
          }

          const twinkle = reduced ? 1 : 0.75 + 0.25 * Math.sin(elapsed * s.rate + s.phase);
          const px = s.x + ox;
          const py = s.y + oy;
          const color = `rgba(${tintsRef.current[s.ti % tintsRef.current.length]},${(s.a * twinkle).toFixed(3)})`;

          if (streak > 2) {
            ctx.strokeStyle = color;
            ctx.lineWidth = s.r;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + streak, py - streak * 0.12);
            ctx.stroke();
          } else {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(px, py, s.r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
    }

    const frame = (now) => {
      const real = (now - last) / 1000;
      const dt = Math.min(0.05, real);
      last = now;
      elapsed += dt;
      // The burst of speed is timed on the clock, so it ends on time even when frames are slow.
      boostRef.current = Math.max(0, boostRef.current - real * 1.3);
      draw(dt);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reduced || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    start();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced]);

  return (
    <canvas ref={canvasRef} className="starfield" aria-hidden="true" />
  );
}
