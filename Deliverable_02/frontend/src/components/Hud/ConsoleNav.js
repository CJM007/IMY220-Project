import { useEffect, useRef, useState } from 'react';
import { SCREENS, EXTERNAL_LINKS } from '../../config/mission';
import { href } from '../../hooks/useRoute';
import ExternalLink from '../ExternalLink/ExternalLink';
import { PlanetIcon, ChevronIcon, CloseIcon, MoonDot, Sparkle } from '../Icons/Icons';
import { useConsole } from './ConsoleContext';

export default function ConsoleNav({ route }) {
  const { open, setOpen } = useConsole();
  const panelRef = useRef(null);
  const returnFocus = useRef(null);
  const [expanded, setExpanded] = useState({});

  // Move focus in when the console opens and back to where it was when it closes.
  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement;
      panelRef.current?.querySelector('a[href], button')?.focus();
    } else if (returnFocus.current) {
      returnFocus.current.focus?.();
      returnFocus.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  const isOpen = (s) => (s.id in expanded ? expanded[s.id] : route.id === s.id);
  const toggle = (s) => setExpanded((prev) => ({ ...prev, [s.id]: !isOpen(s) }));
  const close = () => setOpen(false);

  return (
    <>
      <div className={`scrim${open ? ' is-open' : ''}`} onClick={close} aria-hidden="true" />
      <aside id="console" ref={panelRef} className={`console${open ? ' is-open' : ''}`} aria-label="Ship console">
        <div className="console__head">
          <h2 className="console__title">
            <Sparkle size={16} /> Ship console
          </h2>
          <button type="button" className="console__close" onClick={close}>
            <CloseIcon size={16} />
            <span>Close</span>
          </button>
        </div>

        <nav aria-label="Main menu">
          <ul className="console__list">
            {SCREENS.map((s) => {
              const active = route.id === s.id;
              const kids = s.children;
              const kidsOpen = Boolean(kids) && isOpen(s);
              return (
                <li key={s.id} className={`console__item${active ? ' is-active' : ''}`}>
                  <div className="console__row">
                    <a className="console__link" href={href(s.id)} aria-current={active && !route.sub ? 'page' : undefined} onClick={close}>
                      <PlanetIcon id={s.id} size={42} />
                      <span className="console__text">
                        <span className="console__name">{s.name}</span>
                        <span className="console__blurb">{s.blurb}</span>
                      </span>
                    </a>
                    {kids && (
                      <button
                        type="button"
                        className={`console__toggle${kidsOpen ? ' is-open' : ''}`}
                        aria-expanded={kidsOpen}
                        aria-label={`${s.name} sub menu`}
                        onClick={() => toggle(s)}
                      >
                        <ChevronIcon size={18} />
                      </button>
                    )}
                  </div>

                  {kidsOpen && (
                    <ul className="console__sub">
                      {kids.map((c) => (
                        <li key={c.id}>
                          <a href={href(s.id, c.id)} aria-current={active && route.sub === c.id ? 'page' : undefined} onClick={close}>
                            <MoonDot size={14} />
                            {c.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="console__links">
          <h3 className="console__subtitle">Outside links</h3>
          <ul className="console__list">
            {Object.entries(EXTERNAL_LINKS).map(([key, l]) => (
              <li key={key}>
                <ExternalLink link={l} kind={key} compact />
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
