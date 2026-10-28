import { useRef, useState } from 'react';
import useAlive from '../../hooks/useAlive';
import { SCREENS } from '../../config/mission';
import Starfield from '../Starfield/Starfield';
import UniverseStage from '../Universe/UniverseStage';
import FloatingAstronaut from './FloatingAstronaut';
import Arrival from '../Universe/Arrival';
import { UNIVERSES } from '../Universe/universes';
import { Bolt } from '../Icons/Icons';
import { ConsoleContext } from './ConsoleContext';
import TopBar from './TopBar';
import FlightRail from './FlightRail';
import ConsoleNav from './ConsoleNav';
import './Hud.css';

// The cockpit every screen lives inside: the universe outside, the window frame, the top bar, the flight rail and the console.
export default function HudShell({ route, children }) {
  const [open, setOpen] = useState(false);
  const screen = SCREENS.find((s) => s.id === route.id);
  const hudRef = useRef(null);
  useAlive(route, hudRef);

  return (
    <ConsoleContext.Provider value={{ open, setOpen }}>
      <div className="hud" data-universe={route.id} ref={hudRef}>
        <UniverseStage id={route.id} />
        <Starfield pulseKey={route.id} tints={UNIVERSES[route.id].tints} />

        <div className="window" aria-hidden="true">
          <Bolt className="window__bolt window__bolt--tl" />
          <Bolt className="window__bolt window__bolt--tr" />
          <Bolt className="window__bolt window__bolt--bl" />
          <Bolt className="window__bolt window__bolt--br" />
        </div>

        <FloatingAstronaut />
        <TopBar screen={screen} />
        <main className="hud__screen" key={route.id}>
          {children}
        </main>
        <FlightRail activeId={route.id} />
        <Arrival id={route.id} />
        <ConsoleNav route={route} />
      </div>
    </ConsoleContext.Provider>
  );
}
