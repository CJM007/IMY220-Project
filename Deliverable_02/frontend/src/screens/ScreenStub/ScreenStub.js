import { EXTERNAL_LINKS } from '../../config/mission';
import ExternalLink from '../../components/ExternalLink/ExternalLink';
import { UNIVERSES } from '../../components/Universe/universes';
import { WrenchIcon } from '../../components/Icons/Icons';
import './ScreenStub.css';

// Holds the place of a screen that is scheduled for a later week.
export default function ScreenStub({ screen, sub }) {
  const child = screen.children?.find((c) => c.id === sub);
  const link = screen.external ? EXTERNAL_LINKS[screen.external] : null;

  return (
    <section className="stub" aria-labelledby="stub-title">
      <p className="stub__world">{UNIVERSES[screen.id].name}</p>
      <h1 id="stub-title" className="stub__title">
        {child ? child.name : screen.name}
      </h1>
      <p className="stub__blurb">{child ? `Part of ${screen.name}.` : screen.blurb}</p>

      <p className="stub__sticker">
        <WrenchIcon size={20} />
        <span>Still in the workshop. Lands in week {screen.week}.</span>
      </p>

      {link && (
        <div className="stub__link">
          <p className="stub__linkhead">Can&rsquo;t wait? Go straight there.</p>
          <ExternalLink link={link} kind={screen.external} />
        </div>
      )}
    </section>
  );
}
