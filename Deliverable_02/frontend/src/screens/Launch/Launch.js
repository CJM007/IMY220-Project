import { useConsole } from '../../components/Hud/ConsoleContext';
import { RocketIcon } from '../../components/Icons/Icons';
import ZeroGTitle from './ZeroGTitle';
import MissionPatch from './MissionPatch';
import './Launch.css';

export default function Launch() {
  const { open, setOpen } = useConsole();

  return (
    <section className="launch" aria-labelledby="launch-title">
      <div className="launch__copy">
        <ZeroGTitle lines={['Into the', 'Unknown']} />

        <p className="launch__welcome">
          Hi, I&rsquo;m Chita and I build websites and apps. This is my mission log and every project
          I&rsquo;ve made is a stop along the route. Buckle up and begin the transmission.
        </p>

        <div className="launch__action">
          <button type="button" className="launch__begin" aria-expanded={open} aria-controls="console" onClick={() => setOpen(true)}>
            <RocketIcon size={28} flame={false} />
            <span>Begin transmission</span>
          </button>
        </div>
      </div>

      <div className="launch__patch">
        <MissionPatch />
      </div>
    </section>
  );
}
