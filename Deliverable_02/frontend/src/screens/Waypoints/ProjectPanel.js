import { useEffect, useRef, useState } from 'react';
import SketchFrame from '../../components/Sketch/SketchFrame';
import { Squiggle } from '../../components/Sketch/Doodles';
import ExternalLink from '../../components/ExternalLink/ExternalLink';
import { ArrowLeftIcon, ChevronIcon, LockIcon } from '../../components/Icons/Icons';
import { href } from '../../hooks/useRoute';
import SketchShot from './SketchShot';

export default function ProjectPanel({ project }) {
  const [i, setI] = useState(0);
  const head = useRef(null);
  const shots = project.shots || [];
  const charted = project.status === 'charted';

  useEffect(() => { setI(0); head.current?.focus({ preventScroll: true }); }, [project.id]);

  return (
    <SketchFrame as="article" className="panel" seed={project.id.length * 7} stroke="var(--pop)" aria-labelledby="panel-title">
      <div className="panel__body">
        <a className="panel__back" href={href('waypoints')}><ArrowLeftIcon size={16} /> Back to the star map</a>
        <p className="panel__kind">{project.kind}</p>
        <h1 id="panel-title" className="panel__title" tabIndex={-1} ref={head}>{project.name}</h1>
        <Squiggle seed={project.id.length} width={180} />
        <p className="panel__tag note">{project.tagline}</p>
        <p className="panel__blurb">{project.blurb}</p>

        {charted ? (
          <>
            {project.stack.length > 0 && (
              <ul className="panel__stack" aria-label="Built with">
                {project.stack.map((s) => <li key={s}>{s}</li>)}
              </ul>
            )}
            {shots.length > 0 && (
              <div className="gallery">
                <SketchShot key={shots[i].src} shot={shots[i]} caption={shots[i].alt} seed={i + 3} />
                {shots.length > 1 && (
                  <div className="gallery__nav">
                    <button type="button" className="gallery__btn" aria-label="Previous screenshot" onClick={() => setI((i + shots.length - 1) % shots.length)}><ChevronIcon size={18} className="rot-l" /></button>
                    <span className="gallery__count" aria-live="polite">{i + 1} of {shots.length}</span>
                    <button type="button" className="gallery__btn" aria-label="Next screenshot" onClick={() => setI((i + 1) % shots.length)}><ChevronIcon size={18} className="rot-r" /></button>
                  </div>
                )}
              </div>
            )}
            <ExternalLink link={{ label: project.linkLabel || 'Visit the live site', note: project.name, url: project.live }} kind="live" />
          </>
        ) : (
          <p className="panel__lock"><LockIcon size={20} /><span>Not charted yet. The route there opens on the next leg of the mission.</span></p>
        )}
      </div>
    </SketchFrame>
  );
}
