import { PROJECTS } from '../../config/projects';
import { Squiggle } from '../../components/Sketch/Doodles';
import { href } from '../../hooks/useRoute';
import MapPlanet from './MapPlanet';
import StarMap from './StarMap';
import ProjectPanel from './ProjectPanel';
import './Waypoints.css';

// The project showcase. A star map on the left; pick a planet and its panel opens on the right.
export default function Waypoints({ sub }) {
  const project = PROJECTS.find((p) => p.id === sub) || null;
  return (
    <div className={`way${project ? ' has-panel' : ''}`}>
      <section className="way__map" aria-labelledby="way-title">
        <header className="way__head">
          <p className="way__kicker">Star map</p>
          <h1 id="way-title">Waypoints</h1>
          <Squiggle seed={6} width={200} />
          <p className="way__hint note">Pick a planet to land on it.</p>
        </header>
        <StarMap activeId={project?.id} />
        <ul className="way__list" aria-label="Projects">
          {PROJECTS.map((p, i) => (
            <li key={p.id}>
              <a href={href('waypoints', p.id)} className="way__item">
                <svg viewBox="-60 -60 120 120" width="56" height="56" aria-hidden="true" focusable="false"><MapPlanet look={p.look} seed={i + 2} r={44} gid={`ml${p.id}`} /></svg>
                <span><strong>{p.name}</strong><em>{p.kind}</em></span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      {project && <ProjectPanel project={project} />}
    </div>
  );
}
