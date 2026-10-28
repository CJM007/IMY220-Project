import { useId } from 'react';

// Every icon in the portfolio is drawn here. They use currentColor unless they are a little planet.
const base = (size) => ({ width: size, height: size, 'aria-hidden': true, focusable: false });
const useUid = () => useId().replace(/:/g, '');

export function RocketIcon({ size = 28, className = '', flame = true }) {
  return (
    <svg {...base(size)} viewBox="0 0 32 32" className={`rocket ${className}`}>
      {flame && <path className="rocket__flame" d="M13.2 23.5h5.6L16 31z" fill="#FFD54A" />}
      <path d="M11 17.5 5.5 23l1.2 3.6 5.3-3z" style={{ fill: 'var(--pop, #FF7A45)' }} />
      <path d="M21 17.5 26.5 23l-1.2 3.6-5.3-3z" style={{ fill: 'var(--pop, #FF7A45)' }} />
      <path stroke="#0a0d1c" strokeWidth="1.3" strokeLinejoin="round" d="M16 1.8c4.3 3.4 6.4 8.6 5.7 14.9l-1.5 6.3h-8.4l-1.5-6.3C9.6 10.4 11.7 5.2 16 1.8z" fill="#F4F6FF" />
      <path d="M16 1.8c1.2.9 2.2 2 3 3.2-1.5 1-4.5 1-6 0 .8-1.2 1.8-2.3 3-3.2z" style={{ fill: 'var(--pop, #FF7A45)' }} />
      <circle cx="16" cy="12" r="3" fill="#0B1330" />
      <circle cx="16" cy="12" r="1.9" fill="#4FD8EA" />
      <rect x="11.6" y="21" width="8.8" height="2.4" rx="1.2" fill="#8C97B8" />
    </svg>
  );
}

export function StopwatchIcon({ size = 18, className = '' }) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2.5h5" />
      <path d="M12 2.5v3" />
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 9.5v4l2.6 1.6" />
      <path d="M19 5.5l1.3 1.3" />
    </svg>
  );
}

export function ConsoleIcon({ size = 20, className = '' }) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M3 6h9" /><circle cx="17" cy="6" r="2.2" />
      <path d="M21 12h-9" /><circle cx="7" cy="12" r="2.2" />
      <path d="M3 18h9" /><circle cx="17" cy="18" r="2.2" />
    </svg>
  );
}

export function CloseIcon({ size = 18, className = '' }) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

export function ChevronIcon({ size = 18, className = '' }) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ExternalIcon({ size = 18, className = '' }) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4h6v6" /><path d="M20 4l-9 9" /><path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
    </svg>
  );
}

export function WrenchIcon({ size = 20, className = '' }) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a4 4 0 0 0 5 5L21 12.6a1 1 0 0 1 0 1.4l-.4.4-7-7 .4-.4a1 1 0 0 1 1.4 0z" opacity="0" />
      <path d="M15 4.5a4.5 4.5 0 0 0-4.2 6L3.6 17.7a2 2 0 0 0 2.8 2.8l7.2-7.2a4.5 4.5 0 0 0 6-4.2l-2.8 2.8-2.6-.6-.6-2.6z" />
    </svg>
  );
}

export function SignalIcon({ size = 22, className = '' }) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="12" cy="13" r="2" fill="currentColor" />
      <path d="M12 15v6" />
      <path d="M7.8 8.8a6 6 0 0 0 0 8.4" /><path d="M16.2 8.8a6 6 0 0 1 0 8.4" />
      <path d="M4.9 5.9a10 10 0 0 0 0 14.2" /><path d="M19.1 5.9a10 10 0 0 1 0 14.2" />
    </svg>
  );
}

export function FileIcon({ size = 22, className = '' }) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 7.5V6a2 2 0 0 1 2-2h4.2l2 2.5h6.8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
      <path d="M8 13h8M8 16.2h5" />
    </svg>
  );
}

export function MoonDot({ size = 14, className = '' }) {
  return (
    <svg {...base(size)} viewBox="0 0 16 16" className={className}>
      <circle cx="8" cy="8" r="6.5" fill="currentColor" opacity="0.85" />
      <circle cx="6" cy="6.5" r="1.4" fill="#0B1330" opacity="0.35" />
      <circle cx="10.2" cy="10" r="1" fill="#0B1330" opacity="0.35" />
    </svg>
  );
}

export function Bolt({ size = 16, className = '' }) {
  return (
    <svg {...base(size)} viewBox="0 0 20 20" className={className}>
      <circle cx="10" cy="10" r="8.5" fill="#1B2557" stroke="#8C97B8" strokeWidth="1.5" />
      <path d="M5.5 10h9M10 5.5v9" stroke="#8C97B8" strokeWidth="1.8" strokeLinecap="round" transform="rotate(35 10 10)" />
    </svg>
  );
}

export function Sparkle({ size = 14, className = '', style }) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className} style={style}>
      <path d="M12 1.5c.7 5.6 4.9 9.8 10.5 10.5-5.6.7-9.8 4.9-10.5 10.5C11.3 16.9 7.1 12.7 1.5 12 7.1 11.3 11.3 7.1 12 1.5z" fill="currentColor" />
    </svg>
  );
}

// Small planet for each screen. Used on the flight rail, the top bar and in the console.
export function PlanetIcon({ id, size = 34, className = '' }) {
  const u = useUid();
  const sphere = (c1, c2, cx, cy, r) => (
    <>
      <defs>
        <radialGradient id={`${u}g`} cx="0.32" cy="0.28" r="0.85">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </radialGradient>
        <clipPath id={`${u}c`}><circle cx={cx} cy={cy} r={r} /></clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${u}g)`} />
    </>
  );

  let art = null;
  if (id === 'launch') {
    art = (
      <>
        {sphere('#8fdcff', '#0c4488', 22, 26, 15)}
        <g clipPath={`url(#${u}c)`} fill="#5cc26a">
          <path d="M10 22c3-4 8-3 9 0s-2 5-1 8-6 3-8 0-3-5 0-8z" />
          <path d="M26 30c3-2 8 0 8 4-2 3-7 3-8 0z" />
          <path d="M27 16c2-2 6-1 6 1s-4 3-6 1z" />
        </g>
        <circle cx="39" cy="10" r="5" fill="#C9CEDB" />
        <circle cx="37.6" cy="9" r="1.2" fill="#8C97B8" />
        <circle cx="40.4" cy="11.4" r="0.9" fill="#8C97B8" />
      </>
    );
  } else if (id === 'briefing') {
    art = (
      <g>
        <g transform="rotate(-22 24 24)">
          <path d="M2 24a22 6.8 0 0 1 44 0" fill="none" stroke="#FF9ED2" strokeWidth="3" strokeLinecap="round" />
          <path d="M6 24a18 5.2 0 0 1 36 0" fill="none" stroke="#FFD1EA" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
        </g>
        {sphere('#e0b8ff', '#4a2494', 24, 24, 13)}
        <path d="M11.5 20c5 2 20 2 25 0M11 27c6 2.5 20 2.5 26 0" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.8" fill="none" clipPath={`url(#${u}c)`} />
        <g transform="rotate(-22 24 24)">
          <path d="M2 24a22 6.8 0 0 0 44 0" fill="none" stroke="#FF9ED2" strokeWidth="3" strokeLinecap="round" />
          <path d="M6 24a18 5.2 0 0 0 36 0" fill="none" stroke="#FFD1EA" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
        </g>
      </g>
    );
  } else if (id === 'waypoints') {
    art = (
      <>
        {sphere('#b9ffe6', '#0f8d7b', 20, 27, 13)}
        <path d="M9 24c4 2 12 2 16 0" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" fill="none" clipPath={`url(#${u}c)`} />
        <circle cx="38" cy="11" r="6" fill="#FFB84D" />
        <circle cx="36.5" cy="9.5" r="1.4" fill="#C2701A" />
        <circle cx="40" cy="13" r="1" fill="#C2701A" />
        <g fill="#8C97B8">
          <circle cx="6" cy="10" r="1.6" /><circle cx="11" cy="6" r="1.1" /><circle cx="17" cy="4.5" r="1.4" />
          <circle cx="24" cy="4" r="1" /><circle cx="30" cy="4.2" r="1.3" />
        </g>
      </>
    );
  } else if (id === 'signal') {
    art = (
      <g transform="rotate(-14 24 24)">
        <path d="M3 24a21 5.6 0 0 1 42 0" fill="none" stroke="#FF8A4C" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="24" cy="24" r="12.5" fill="none" stroke="#FFD27A" strokeWidth="2.4" />
        <circle cx="24" cy="24" r="10" fill="#05070D" />
        <path d="M3 24a21 5.6 0 0 0 42 0" fill="none" stroke="#FFB067" strokeWidth="3.6" strokeLinecap="round" />
      </g>
    );
  } else if (id === 'file') {
    art = (
      <>
        {sphere('#e3ff8a', '#3f5d0f', 24, 25, 15)}
        <g clipPath={`url(#${u}c)`} fill="#243308" opacity="0.75">
          <circle cx="18" cy="20" r="4" /><circle cx="29" cy="30" r="5" /><circle cx="30" cy="17" r="2.6" /><circle cx="16" cy="32" r="2.4" />
        </g>
        <path d="M36 8h7l2 2v6h-9z" fill="#F4F6FF" stroke="#0B1330" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M38 12h5M38 14h3" stroke="#0B1330" strokeWidth="1" strokeLinecap="round" />
      </>
    );
  } else {
    art = (
      <>
        <g stroke="#FFD27A" strokeWidth="2.6" strokeLinecap="round">
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d="M24 5v5" transform={`rotate(${i * 45} 24 24)`} />
          ))}
        </g>
        <circle cx="24" cy="24" r="10.5" fill="#FFE9A8" />
        <circle cx="24" cy="24" r="7" fill="#FFC857" />
        <circle cx="41" cy="40" r="4" fill="#4FA3E8" />
      </>
    );
  }

  return (
    <svg {...base(size)} viewBox="0 0 48 48" className={className}>
      {art}
    </svg>
  );
}

// Icons added in week 3
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };

export function MailIcon({ size = 22, className = '' }) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M3.4 5.8c5.8-.6 11.4-.5 17.2 0 .5 4 .5 8 0 12.2-5.8.5-11.4.5-17.2 0-.5-4.1-.4-8.1 0-12.200z" />
      <path d="M3.8 6.6c3 3.2 5.4 5.2 8.2 5.8 2.8-.6 5.2-2.6 8.2-5.8" />
    </svg>
  );
}

export function CodeIcon({ size = 22, className = '' }) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M8.2 7 3 12.1 8.3 17" />
      <path d="M15.8 7 21 12.2 15.7 17" />
      <path d="M13.7 4.6 10.3 19.5" />
    </svg>
  );
}

export function LinkIcon({ size = 22, className = '' }) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M10 14a4.2 4.2 0 0 0 6 0l3.2-3.200a4.2 4.2 0 0 0-6-6L12 5.8" />
      <path d="M14 10a4.2 4.2 0 0 0-6 0L4.8 13.200a4.2 4.2 0 0 0 6 6L12 18.2" />
    </svg>
  );
}

export function SendIcon({ size = 20, className = '' }) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M21 3 10.2 13.6" />
      <path d="M21.2 3.2 14.6 21 10.2 13.7 3 9.500z" />
    </svg>
  );
}

export function CheckIcon({ size = 20, className = '' }) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className} {...stroke} strokeWidth="3">
      <path d="M4.5 12.8 9.8 18 19.8 6.2" />
    </svg>
  );
}

export function LockIcon({ size = 20, className = '' }) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M5.5 11h13c.5 3 .5 6.2 0 9h-13c-.5-2.8-.5-6 0-9z" />
      <path d="M8.2 11V8a3.8 3.8 0 0 1 7.6 0v3" />
      <circle cx="12" cy="15.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function ArrowLeftIcon({ size = 18, className = '' }) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className} {...stroke} strokeWidth="2.6">
      <path d="M20 12H4.500M10.5 5.5 4 12l6.5 6.5" />
    </svg>
  );
}

export function FlipIcon({ size = 18, className = '' }) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M4 12a8 8 0 0 1 14-5.300L20 9" />
      <path d="M20 4v5h-5" />
      <path d="M20 12a8 8 0 0 1-14 5.300L4 15" />
      <path d="M4 20v-5h5" />
    </svg>
  );
}

export function SoundIcon({ size = 20, className = '', off = false }) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className} {...stroke}>
      <path d="M4 9.500c2.2-.3 3.6-.9 5.3-3 .3-.4 1-.2 1 .3v10.400c0 .5-.7.7-1 .3-1.7-2.1-3.1-2.7-5.3-3z" />
      {off ? <path d="M15 9.500l5 5M20 9.500l-5 5" /> : (<><path d="M14.5 9.200a4 4 0 0 1 0 5.6" /><path d="M17.5 6.500a8 8 0 0 1 0 11" /></>)}
    </svg>
  );
}
