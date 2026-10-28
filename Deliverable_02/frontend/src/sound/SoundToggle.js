import { useEffect, useState } from 'react';
import { enable, disable, isOn, subscribe } from './engine';
import { SoundIcon } from '../components/Icons/Icons';

export default function SoundToggle() {
  const [on, setOn] = useState(isOn());
  useEffect(() => subscribe(setOn), []);
  return (
    <button
      type="button"
      className={`topbar__sound${on ? ' is-on' : ''}`}
      aria-pressed={on}
      aria-label={on ? 'Turn the sound off' : 'Turn the sound on'}
      onClick={() => (on ? disable() : enable())}
    >
      <SoundIcon size={20} off={!on} />
      <span className="topbar__soundtext">{on ? 'Sound on' : 'Sound off'}</span>
    </button>
  );
}
