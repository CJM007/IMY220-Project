import { useEffect, useRef } from 'react';
import { Squiggle } from '../../components/Sketch/Doodles';
import SketchFrame from '../../components/Sketch/SketchFrame';
import { ABOUT } from '../../config/profile';
import useReducedMotion from '../../hooks/useReducedMotion';
import PilotCard from './PilotCard';
import SkillsReadout from './SkillsReadout';
import ContactForm from './ContactForm';
import './Briefing.css';

const SECTIONS = ['pilot', 'systems', 'contact'];

// Three parts on one long page. The console links (#/briefing/systems and so on) scroll to the part you asked for.
export default function Briefing({ sub }) {
  const reduce = useReducedMotion();
  const first = useRef(true);

  useEffect(() => {
    const target = SECTIONS.includes(sub) ? document.getElementById(`brief-${sub}`) : null;
    const delay = first.current ? 1100 : 0;
    first.current = false;
    const t = setTimeout(() => {
      if (target) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      else document.querySelector('.hud__screen')?.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    }, delay);
    return () => clearTimeout(t);
  }, [sub, reduce]);

  return (
    <div className="brief">
      <section id="brief-pilot" className="brief__part" aria-labelledby="brief-pilot-h">
        <header className="brief__head" data-reveal>
          <p className="brief__kicker">Mission briefing, part one</p>
          <h1 id="brief-pilot-h">Meet the pilot</h1>
          <Squiggle seed={2} />
        </header>
        <div className="brief__pilot">
          <PilotCard />
          <SketchFrame data-reveal className="logbook" seed={14} fill="#f3ecd8" stroke="#0a0d1c" shadow="var(--deep)" wob={2.4}>
            <div className="logbook__body">
              <p className="logbook__tape" aria-hidden="true" />
              <h2 className="logbook__title">Captain&rsquo;s log</h2>
              {ABOUT.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
              <p className="logbook__sign">&mdash; Chita</p>
            </div>
          </SketchFrame>
        </div>
      </section>

      <section id="brief-systems" className="brief__part" aria-labelledby="brief-systems-h">
        <header className="brief__head" data-reveal>
          <p className="brief__kicker">Mission briefing, part two</p>
          <h2 id="brief-systems-h" className="brief__h">Systems readout</h2>
          <Squiggle seed={5} />
        </header>
        <SkillsReadout />
      </section>

      <section id="brief-contact" className="brief__part" aria-labelledby="brief-contact-h">
        <header className="brief__head" data-reveal>
          <p className="brief__kicker">Mission briefing, part three</p>
          <h2 id="brief-contact-h" className="brief__h">Open a channel</h2>
          <Squiggle seed={8} />
        </header>
        <ContactForm />
      </section>
    </div>
  );
}
