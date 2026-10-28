import { useId } from 'react';

// A crew patch, like the ones sewn onto flight suits.
export default function MissionPatch() {
  const id = useId().replace(/:/g, '');
  const star = 'M0-9c.6 5 4 8.4 9 9-5 .6-8.4 4-9 9-.6-5-4-8.4-9-9 5-.6 8.4-4 9-9z';
  return (
    <svg className="patch" viewBox="0 0 200 200" role="img" aria-label="Mission patch for the multimedia crew of VIO 202">
      <defs>
        <path id={`${id}t`} d="M 100,100 m -74,0 a 74,74 0 1,1 148,0" />
        <path id={`${id}b`} d="M 20,100 a 80,80 0 0,0 160,0" />
        <clipPath id={`${id}c`}><circle cx="100" cy="100" r="56" /></clipPath>
        <radialGradient id={`${id}p`} cx="0.3" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#ffe08a" /><stop offset="1" stopColor="#e2683a" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="#ffd54a" />
      <circle cx="100" cy="100" r="96" fill="none" stroke="#10142b" strokeWidth="3" />
      <circle cx="100" cy="100" r="89" fill="none" stroke="#10142b" strokeWidth="1.6" strokeDasharray="5 4" strokeLinecap="round" />
      <circle cx="100" cy="100" r="60" fill="#10142b" />
      <g clipPath={`url(#${id}c)`}>
        <rect x="40" y="40" width="120" height="120" fill="#0b1330" />
        <circle cx="100" cy="182" r="62" fill="#1b74b8" />
        <path d="M60 150c14-9 28-6 40-1s26 3 40-3v40H60z" fill="#5cc26a" opacity="0.85" />
        <circle cx="132" cy="70" r="15" fill={`url(#${id}p)`} />
        <ellipse cx="132" cy="70" rx="26" ry="5.5" fill="none" stroke="#ffb6e6" strokeWidth="2.4" transform="rotate(-18 132 70)" />
        <g fill="#f4f6ff"><circle cx="66" cy="66" r="1.6" /><circle cx="84" cy="56" r="1.1" /><circle cx="70" cy="96" r="1.2" /><circle cx="148" cy="112" r="1.4" /><circle cx="110" cy="52" r="1" /></g>
        <g transform="translate(96 108) rotate(28)">
          <path d="M-5 14 -12 22l1 4 8-4z" fill="#ff7a45" /><path d="M5 14 12 22l-1 4-8-4z" fill="#ff7a45" />
          <path d="M0-22c6 5 8.5 12 7.6 20L6 12h-12l-1.6-14C-8.5-10-6-17 0-22z" fill="#f4f6ff" />
          <circle cy="-6" r="3.6" fill="#0b1330" /><circle cy="-6" r="2.4" fill="#4fd8ea" />
          <path d="M-4 14h8L0 26z" fill="#ffd54a" />
        </g>
      </g>
      <circle cx="100" cy="100" r="60" fill="none" stroke="#f4f6ff" strokeWidth="2" strokeDasharray="1 5" strokeLinecap="round" />
      <text fontFamily="Unbounded, sans-serif" fontWeight="800" fontSize="13.5" fill="#10142b" letterSpacing="2.2">
        <textPath href={`#${id}t`} startOffset="50%" textAnchor="middle">MULTIMEDIA CREW</textPath>
      </text>
      <text fontFamily="Unbounded, sans-serif" fontWeight="800" fontSize="13.5" fill="#10142b" letterSpacing="2.2">
        <textPath href={`#${id}b`} startOffset="50%" textAnchor="middle">VIO 202 2026</textPath>
      </text>
      <path d={star} transform="translate(17 100) scale(0.85)" fill="#10142b" />
      <path d={star} transform="translate(183 100) scale(0.85)" fill="#10142b" />
    </svg>
  );
}
