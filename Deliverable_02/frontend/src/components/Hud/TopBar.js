import useMissionClock from '../../hooks/useMissionClock';
import { href } from '../../hooks/useRoute';
import { RocketIcon, StopwatchIcon, ConsoleIcon, PlanetIcon } from '../Icons/Icons';
import SoundToggle from '../../sound/SoundToggle';
import { useConsole } from './ConsoleContext';

export default function TopBar({ screen }) {
  const clock = useMissionClock();
  const { open, setOpen } = useConsole();

  return (
    <header className="topbar">
      <a className="topbar__mark" href={href('launch')} aria-label="Into the Unknown, back to launch">
        <RocketIcon size={30} className="topbar__rocket" />
        <span>Into the Unknown</span>
      </a>

      <p className="topbar__screen">
        <PlanetIcon id={screen.id} size={28} />
        <span>{screen.name}</span>
      </p>

      <div className="topbar__right">
        <p className="topbar__clock" aria-label="Time on mission">
          <StopwatchIcon size={17} />
          <span>{clock}</span>
        </p>
        <SoundToggle />
        <button
          type="button"
          className="topbar__menu"
          aria-expanded={open}
          aria-controls="console"
          onClick={() => setOpen(!open)}
        >
          <ConsoleIcon size={18} />
          <span>Console</span>
        </button>
      </div>
    </header>
  );
}
