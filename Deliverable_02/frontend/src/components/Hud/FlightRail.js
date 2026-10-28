import { SCREENS } from '../../config/mission';
import { href } from '../../hooks/useRoute';
import { PlanetIcon, RocketIcon } from '../Icons/Icons';

export default function FlightRail({ activeId }) {
  const n = SCREENS.length;
  const index = SCREENS.findIndex((s) => s.id === activeId);

  return (
    <nav className="rail" aria-label="Flight path">
      <ol className="rail__list">
        <span className="rail__ship" style={{ left: `${((index + 0.5) / n) * 100}%` }} aria-hidden="true">
          <RocketIcon size={30} className="rail__rocket" />
        </span>
        {SCREENS.map((s, i) => {
          const state = i < index ? 'visited' : i === index ? 'current' : 'ahead';
          return (
            <li key={s.id} className={`rail__item rail__item--${state}`}>
              <a href={href(s.id)} aria-current={state === 'current' ? 'step' : undefined}>
                <PlanetIcon id={s.id} size={38} className="rail__planet" />
                <span className="rail__label">{s.name}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
