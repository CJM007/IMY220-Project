import { useEffect } from 'react';
import { SCREENS } from './config/mission';
import useRoute from './hooks/useRoute';
import HudShell from './components/Hud/HudShell';
import Launch from './screens/Launch/Launch';
import SketchDefs from './components/Sketch/SketchDefs';
import Briefing from './screens/Briefing/Briefing';
import Waypoints from './screens/Waypoints/Waypoints';
import Signal from './screens/Signal/Signal';
import File from './screens/File/File';
import Return from './screens/Return/Return';

export default function App() {
  const route = useRoute();
  const screen = SCREENS.find((s) => s.id === route.id);

  useEffect(() => {
    document.title = `${screen.name} | Into the Unknown`;
  }, [screen]);

  return (
    <>
      <SketchDefs />
      <HudShell route={route}>
        {route.id === 'launch' && <Launch />}
        {route.id === 'briefing' && <Briefing sub={route.sub} />}
        {route.id === 'waypoints' && <Waypoints sub={route.sub} />}
        {route.id === 'signal' && <Signal />}
        {route.id === 'file' && <File />}
        {route.id === 'return' && <Return />}
      </HudShell>
    </>
  );
}
