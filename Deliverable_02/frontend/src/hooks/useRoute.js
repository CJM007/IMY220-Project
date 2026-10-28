import { useEffect, useState } from 'react';
import { SCREENS, DEFAULT_SCREEN } from '../config/mission';

function parse() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [id, sub] = raw.split('/');
  const known = SCREENS.some((s) => s.id === id);
  return { id: known ? id : DEFAULT_SCREEN, sub: known && sub ? sub : null };
}

export const href = (id, sub) => `#/${id}${sub ? `/${sub}` : ''}`;

export default function useRoute() {
  const [route, setRoute] = useState(parse);

  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}
