import { useEffect, useRef, useState } from 'react';
import SketchFrame from '../../components/Sketch/SketchFrame';
import ExternalLink from '../../components/ExternalLink/ExternalLink';
import { EXTERNAL_LINKS } from '../../config/mission';
import useReducedMotion from '../../hooks/useReducedMotion';
import { SignalIcon } from '../../components/Icons/Icons';
import { sting } from '../../sound/engine';
import './Signal.css';

const MESSAGE = [
  'Is anyone out there?',
  'We picked this up three sectors back. It is not a voice. It is a story, and it only runs one way: down.',
  'The place it comes from is called the Kingdom of Rot. Nothing there is quite what it looks like.',
  'Scroll slowly. Do not look away from the storm.',
];
const GLYPHS = '#%&?/\\|<>~*+=';

// Turns a line of text into static and back again, a few letters at a time.
function useDecode(active, reduce) {
  const [text, setText] = useState(() => MESSAGE.map((l) => l.replace(/[^\s]/g, '·')));
  const frame = useRef(0);
  useEffect(() => {
    if (!active) return undefined;
    if (reduce) { setText(MESSAGE); return undefined; }
    let n = 0;
    const total = 38;
    frame.current = setInterval(() => {
      n += 1;
      const solved = n / total;
      setText(MESSAGE.map((line) => [...line].map((ch, i) => {
        if (ch === ' ') return ' ';
        const when = (i / line.length) * 0.8;
        return solved > when + 0.15 ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }).join('')));
      if (n >= total) { clearInterval(frame.current); setText(MESSAGE); }
    }, 55);
    return () => clearInterval(frame.current);
  }, [active, reduce]);
  return text;
}

export default function Signal() {
  const reduce = useReducedMotion();
  const [tuned, setTuned] = useState(false);
  const lines = useDecode(tuned, reduce);

  return (
    <section className={`sig${tuned ? ' is-tuned' : ''}`} aria-labelledby="sig-title">
      <header className="sig__head">
        <p className="sig__kicker"><span className="sig__dot" aria-hidden="true" /> Incoming transmission</p>
        <h1 id="sig-title" className="glitch" data-text="Signal detected">Signal detected</h1>
        <p className="sig__bars" aria-hidden="true">{[1, 2, 3, 4, 5].map((n) => <i key={n} style={{ '--n': n }} />)}</p>
      </header>

      <SketchFrame className="sig__screen" seed={44} fill="rgba(10, 6, 4, 0.92)" stroke="var(--accent)" shadow="var(--deep)" data-reveal>
        <div className="sig__body">
          <p className="sig__meta"><SignalIcon size={18} /> Source: unknown &nbsp;·&nbsp; Strength: {tuned ? 'clear' : 'weak'}</p>
          <div className="sig__text" aria-live="polite">
            {lines.map((l, i) => <p key={i} className={i === 0 ? 'sig__first' : ''}>{l}</p>)}
          </div>
          {!tuned ? (
            <button type="button" className="btn btn--go sig__tune" onClick={() => { setTuned(true); sting(); }}>
              <SignalIcon size={20} /> <span>Tune the receiver</span>
            </button>
          ) : (
            <div className="sig__reveal">
              <p className="note sig__origin">Signal traced. Follow it down:</p>
              <ExternalLink link={EXTERNAL_LINKS.comic} kind="comic" />
            </div>
          )}
        </div>
      </SketchFrame>
    </section>
  );
}
