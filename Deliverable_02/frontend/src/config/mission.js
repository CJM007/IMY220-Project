// One place for the route, the menu and the outside links.
// Change a link or a screen here and the console, the flight rail and the routes all follow.

// Set this to the live address of the Appleboy infographic.
// Until it is filled in, the link shows as pending instead of pointing nowhere.
export const INFOGRAPHIC_URL = 'https://celadon-paprenjak-7795e2.netlify.app/';

export const COMIC_URL = 'https://viocomic.netlify.app/';

export const EXTERNAL_LINKS = {
  comic: {
    label: 'Kingdom of Rot',
    note: 'The vertical narrative',
    url: COMIC_URL,
  },
  infographic: {
    label: 'Appleboy dossier',
    note: 'The character infographic',
    url: INFOGRAPHIC_URL,
  },
};

export const SCREENS = [
  {
    id: 'launch',
    code: '01',
    name: 'Launch',
    blurb: 'Home, main menu and welcome.',
    week: 2,
  },
  {
    id: 'briefing',
    code: '02',
    name: 'Mission Briefing',
    blurb: 'About me, my skills and how to reach me.',
    week: 3,
    children: [
      { id: 'pilot', name: 'Pilot ID' },
      { id: 'systems', name: 'Systems readout' },
      { id: 'contact', name: 'Contact' },
    ],
  },
  {
    id: 'waypoints',
    code: '03',
    name: 'Waypoints',
    blurb: 'The project showcase, laid out as a star map.',
    week: 3,
    children: [
      { id: 'habibi', name: 'Habibi Events' },
      { id: 'laundrytrack', name: 'LaundryTrack' },
      { id: 'cv-detect', name: 'CV Weapon Detection' },
      { id: 'fnf', name: 'FNF' },
    ],
  },
  {
    id: 'signal',
    code: '04',
    name: 'Signal Detected',
    blurb: 'An incoming transmission that leads to the comic.',
    week: 5,
    theme: 'amber',
    external: 'comic',
  },
  {
    id: 'file',
    code: '05',
    name: 'Recovered File',
    blurb: 'A classified dossier that leads to the infographic.',
    week: 5,
    external: 'infographic',
  },
  {
    id: 'return',
    code: '06',
    name: 'Return Signal',
    blurb: 'Socials, contact and the close of the session.',
    week: 5,
  },
];

export const DEFAULT_SCREEN = 'launch';
