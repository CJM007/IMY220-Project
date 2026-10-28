import { useState } from 'react';
import { box, line } from '../../sketch/rough';

// A screenshot in a taped-on frame. If the picture file has not been added yet it draws a sketch of a browser
// window instead, so the page never shows a broken image.
export default function SketchShot({ shot, caption, seed = 1 }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className="shot">
      <span className="shot__tape" aria-hidden="true" />
      <div className="shot__frame">
        {failed ? (
          <svg className="shot__sketch" viewBox="0 0 320 200" role="img" aria-label={`${shot.alt}. Screenshot coming soon.`}>
            <path d={box(8, 8, 304, 184, seed, 3)} fill="#f8f3e4" stroke="var(--ink)" strokeWidth="3" />
            <path d={line(10, 38, 310, 38, seed, 0.01)} stroke="var(--ink)" strokeWidth="2.4" fill="none" />
            <g fill="var(--pop)" stroke="var(--ink)" strokeWidth="1.6"><circle cx="24" cy="23" r="5" /><circle cx="40" cy="23" r="5" fill="var(--accent)" /><circle cx="56" cy="23" r="5" fill="#fff" /></g>
            <path d={box(24, 54, 120, 70, seed + 1, 3)} fill="none" stroke="var(--ink)" strokeWidth="2.4" strokeDasharray="7 6" />
            <path d="M24 54L144 124M144 54L24 124" stroke="var(--ink)" strokeWidth="1.6" opacity="0.4" />
            <path d={line(160, 62, 290, 62, seed + 2, 0.03) + line(160, 82, 270, 82, seed + 3, 0.03) + line(160, 102, 280, 102, seed + 4, 0.03)} stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
            <path d={line(24, 148, 296, 148, seed + 5, 0.03) + line(24, 168, 220, 168, seed + 6, 0.03)} stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
            <text x="160" y="190" textAnchor="middle" className="shot__soon">screenshot on its way</text>
          </svg>
        ) : (
          <img src={shot.src} alt={shot.alt} loading="lazy" onError={() => setFailed(true)} />
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
