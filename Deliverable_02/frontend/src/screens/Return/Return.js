import SketchFrame from '../../components/Sketch/SketchFrame';
import { MailIcon, CodeIcon, LinkIcon, ExternalIcon, RocketIcon } from '../../components/Icons/Icons';
import { EMAIL, SOCIALS } from '../../config/profile';
import useMissionClock from '../../hooks/useMissionClock';
import { href } from '../../hooks/useRoute';
import './Return.css';

const ICONS = { code: CodeIcon, link: LinkIcon };

// The last screen: a thank you, a way to reach me, and a way to fly it all again.
export default function Return() {
  const clock = useMissionClock();
  return (
    <section className="ret" aria-labelledby="ret-title">
      <p className="ret__kicker">Return signal</p>
      <h1 id="ret-title" className="ret__title">Thanks for flying with me.</h1>
      <p className="ret__lead">
        You covered the whole route: the briefing, the waypoints, the signal and the file. Time on mission: <strong>{clock}</strong>. If something out there caught your eye, I would love to hear about it.
      </p>

      <div className="ret__grid">
        <SketchFrame className="ret__card" seed={66} stroke="var(--accent)" data-reveal>
          <div className="ret__cardbody">
            <h2>Say hello</h2>
            <p>Questions, projects, a website that needs building. The channel is open.</p>
            <a className="btn btn--go" href={href('briefing', 'contact')}><MailIcon size={18} /> <span>Open a channel</span></a>
            {EMAIL && <a className="ret__mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>}
          </div>
        </SketchFrame>

        <div className="ret__social" data-reveal>
          <p className="note">Find me out here:</p>
          <ul className="socials">
            {SOCIALS.map((s) => {
              const Icon = ICONS[s.icon] || LinkIcon;
              const body = (
                <>
                  <Icon size={24} />
                  <span><strong>{s.label}</strong><em>{s.url ? s.note : 'Not on the radar yet'}</em></span>
                  {s.url && <ExternalIcon size={16} className="social__out" />}
                </>
              );
              return (
                <li key={s.id}>
                  {s.url
                    ? <a className="social" href={s.url} target="_blank" rel="noopener noreferrer">{body}<span className="sr-only"> (opens in a new tab)</span></a>
                    : <span className="social social--pending" aria-disabled="true">{body}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="ret__foot">
        <a className="btn" href={href('launch')}><RocketIcon size={22} /> <span>Fly it again</span></a>
        <p className="note">Chitambala Sikazwe &middot; VIO 202 &middot; 2026</p>
      </div>
    </section>
  );
}
