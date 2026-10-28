import { useState } from 'react';
import SketchFrame from '../../components/Sketch/SketchFrame';
import ExternalLink from '../../components/ExternalLink/ExternalLink';
import { EXTERNAL_LINKS } from '../../config/mission';
import { FileIcon } from '../../components/Icons/Icons';
import { ding } from '../../sound/engine';
import './File.css';

const ROWS = [
  ['Subject', 'Appleboy'],
  ['File type', 'Character infographic'],
  ['Recovered from', 'Moss Sector'],
  ['Condition', 'Slightly chewed'],
];

// A recovered dossier. The notes are blacked out until you declassify the file.
export default function File() {
  const [open, setOpen] = useState(false);
  return (
    <section className="doss" aria-labelledby="doss-title">
      <header className="doss__head">
        <p className="doss__kicker">Recovered file 05</p>
        <h1 id="doss-title" className="glitch" data-text="Recovered file">Recovered file</h1>
      </header>

      <div className="doss__wrap" data-reveal>
        <span className="doss__tab" aria-hidden="true">Case 05</span>
        <SketchFrame className="dossier" seed={55} fill="#e9d9a6" stroke="#0a0d1c" shadow="var(--deep)" wob={2.6}>
          <div className="dossier__body">
            <p className={`dossier__stamp${open ? ' is-off' : ''}`} aria-hidden="true">Classified</p>
            <p className="dossier__head"><FileIcon size={22} /> Field dossier</p>
            <dl className="dossier__rows">
              {ROWS.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
              <div className="dossier__notes">
                <dt>Notes</dt>
                <dd>
                  {open ? (
                    <span className="dossier__open">Everything you need to know about him is on one page. Go and read it.</span>
                  ) : (
                    <>
                      <span className="bar" style={{ width: '92%' }} /><span className="bar" style={{ width: '70%' }} /><span className="bar" style={{ width: '84%' }} />
                      <span className="sr-only">Redacted until the file is declassified.</span>
                    </>
                  )}
                </dd>
              </div>
            </dl>
            {!open ? (
              <button type="button" className="btn btn--go" onClick={() => { setOpen(true); ding(); }}>
                <span>Declassify</span>
              </button>
            ) : (
              <div className="dossier__link"><ExternalLink link={EXTERNAL_LINKS.infographic} kind="infographic" /></div>
            )}
          </div>
        </SketchFrame>
      </div>
    </section>
  );
}
