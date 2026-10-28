import { useEffect, useRef, useState } from 'react';
import { UNIVERSES } from './universes';
import { PlanetIcon } from '../Icons/Icons';

// A short name plate that shows up as each universe lands.
export default function Arrival({ id }) {
  const first = useRef(true);
  const [shown, setShown] = useState(null);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return undefined;
    }
    setShown({ id, key: Date.now() });
    const t = setTimeout(() => setShown(null), 4600);
    return () => clearTimeout(t);
  }, [id]);

  if (!shown) return null;
  const u = UNIVERSES[shown.id];
  return (
    <div className="arrival" key={shown.key} role="status">
      <PlanetIcon id={shown.id} size={44} />
      <div>
        <p className="arrival__kicker">Now entering</p>
        <p className="arrival__name">{u.name}</p>
        <p className="arrival__tag">{u.tagline}</p>
      </div>
    </div>
  );
}
