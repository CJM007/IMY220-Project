import { SignalIcon, FileIcon, ExternalIcon } from '../Icons/Icons';
import './ExternalLink.css';

const ICONS = { comic: SignalIcon, infographic: FileIcon };

// A link that leaves the portfolio. If its address has not been set yet, it says so instead of going nowhere.
export default function ExternalLink({ link, kind, compact = false }) {
  const ready = Boolean(link.url);
  const Icon = ICONS[kind] || ExternalIcon;
  const body = (
    <>
      <span className="ext__icon"><Icon size={compact ? 24 : 30} /></span>
      <span className="ext__text">
        <span className="ext__label">{link.label}</span>
        <span className="ext__note">{ready ? link.note : `${link.note}. Link not set yet.`}</span>
      </span>
      {ready && <ExternalIcon size={16} className="ext__out" />}
    </>
  );

  if (!ready) {
    return (
      <span className={`ext ext--pending${compact ? ' ext--compact' : ''}`} aria-disabled="true">
        {body}
      </span>
    );
  }

  return (
    <a className={`ext${compact ? ' ext--compact' : ''}`} href={link.url} target="_blank" rel="noopener noreferrer">
      {body}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
