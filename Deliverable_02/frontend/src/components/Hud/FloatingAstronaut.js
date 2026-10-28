import { AstronautFull } from '../Sketch/Doodles';

// The pilot, out on a spacewalk. Drifts slowly across every screen, behind the content so it never covers anything you need.
export default function FloatingAstronaut() {
  return (
    <div className="floater" aria-hidden="true">
      <div className="floater__path">
        <div className="floater__spin">
          <AstronautFull className="floater__svg" />
        </div>
      </div>
    </div>
  );
}
