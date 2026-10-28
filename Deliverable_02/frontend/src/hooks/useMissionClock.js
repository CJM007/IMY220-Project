import { useEffect, useState } from 'react';

const pad = (n) => String(n).padStart(2, '0');

// Time since the visitor arrived, shown as hh:mm:ss.
// One shared start time, so the counter in the top bar and the time on the last screen always agree.
const START = Date.now();
const elapsed = () => Math.floor((Date.now() - START) / 1000);

export default function useMissionClock() {
  const [seconds, setSeconds] = useState(elapsed);

  useEffect(() => {
    setSeconds(elapsed());
    const id = setInterval(() => setSeconds(elapsed()), 1000);
    return () => clearInterval(id);
  }, []);

  return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;
}
