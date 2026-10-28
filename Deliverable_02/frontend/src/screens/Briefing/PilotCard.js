import { useState } from 'react';
import SketchFrame from '../../components/Sketch/SketchFrame';
import { PilotDoodle } from '../../components/Sketch/Doodles';
import { FlipIcon } from '../../components/Icons/Icons';
import { PILOT } from '../../config/profile';

// An ID card you can turn over. The back lists the crews I fly with.
export default function PilotCard() {
  const [back, setBack] = useState(false);
  return (
    <div className="pilot" data-reveal>
      <div className={`pilot__card${back ? ' is-back' : ''}`}>
        <SketchFrame className="pilot__face pilot__face--front" seed={4} fill="#f3ecd8" stroke="#0a0d1c" shadow="var(--deep)" aria-hidden={back}>
          <div className="pilot__inner">
            <p className="pilot__head"><span>Pilot ID</span><span>Class: explorer</span></p>
            <PilotDoodle className="pilot__pic" />
            <p className="pilot__name">{PILOT.name}</p>
            <p className="pilot__call">&ldquo;{PILOT.callsign}&rdquo;</p>
            <dl className="pilot__facts">
              <div><dt>Rank</dt><dd>{PILOT.rank}</dd></div>
              <div><dt>Base</dt><dd>{PILOT.base}</dd></div>
              <div><dt>ID</dt><dd>{PILOT.studentNo}</dd></div>
            </dl>
          </div>
        </SketchFrame>
        <SketchFrame className="pilot__face pilot__face--back" seed={9} fill="#f3ecd8" stroke="#0a0d1c" shadow="var(--deep)" aria-hidden={!back}>
          <div className="pilot__inner">
            <p className="pilot__head"><span>Flight crews</span><span>Back of card</span></p>
            <ul className="pilot__crew">
              {PILOT.crew.map((c) => (
                <li key={c.label}>
                  <strong>{c.label}</strong>
                  <span>{c.note}</span>
                </li>
              ))}
            </ul>
            <p className="pilot__stamp">Cleared for launch</p>
          </div>
        </SketchFrame>
      </div>
      <button type="button" className="pilot__flip" aria-pressed={back} onClick={() => setBack((b) => !b)}>
        <FlipIcon size={18} />
        <span>{back ? 'Show the front' : 'Flip the card'}</span>
      </button>
    </div>
  );
}
