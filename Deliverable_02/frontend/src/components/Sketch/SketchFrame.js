import { useEffect, useRef, useState } from 'react';
import { box } from '../../sketch/rough';
import './Sketch.css';

// A panel whose border is drawn with a pen. It measures itself and draws two overlapping passes round the edge,
// plus a flat offset shadow, so the outline wanders like a real one. Children sit on top.
export default function SketchFrame({
  as: Tag = 'div',
  seed = 1,
  fill = 'rgba(12, 18, 46, 0.9)',
  stroke = 'var(--accent)',
  shadow = 'var(--deep)',
  wob = 3,
  width = 3,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const read = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    read();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  const p1 = w ? box(4, 4, w - 8, h - 8, seed, wob) : '';
  const p2 = w ? box(4, 4, w - 8, h - 8, seed + 17, wob * 1.2) : '';
  return (
    <Tag ref={ref} className={`sketchframe ${className}`} {...rest}>
      {w > 0 && (
        <svg className="sketchframe__art" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
          {shadow !== 'none' && <path d={p1} transform="translate(6 7)" fill={shadow} />}
          <path d={p1} fill={fill} />
          <path d={p2} fill="none" stroke={stroke} strokeWidth={width * 0.55} opacity="0.55" strokeLinecap="round" />
          <path d={p1} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <div className="sketchframe__body">{children}</div>
    </Tag>
  );
}
