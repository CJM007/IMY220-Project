// Everything the Mission Briefing says about me lives here. Edit the words here, not in the components.

export const PILOT = {
  name: 'Chitambala Sikazwe',
  callsign: 'Chita',
  rank: 'Second-year, BIS Multi-Media',
  base: 'University of Pretoria',
  studentNo: 'u25173384',
  crew: [
    { label: 'Kafue Technologies', note: 'Founder. Websites for real clients.' },
    { label: 'Habibi Events', note: 'Runs the ticketing platform.' },
    { label: 'House TAU', note: 'Vice-Chair, Internal Projects.' },
  ],
};

export const ABOUT = [
  'I build things you can click on. By day I study Multi-Media at the University of Pretoria; the rest of the time I am running Kafue Technologies, a small web studio, and keeping the Habibi Events ticketing platform alive.',
  'I like the whole stack. I will happily go from sketching a screen to wiring up payments and databases behind it, and I like small, fast, minimal-dependency builds over heavy ones. This site is one of those: plain React and CSS, no UI kit.',
  'The mission log idea is the same as everything I do: make it feel like somewhere, not just something. Pick a planet and have a look around.',
];

// level is out of 10. These are my own honest estimates, change them whenever they stop being true.
export const SKILL_GROUPS = [
  {
    id: 'build',
    title: 'Engines',
    blurb: 'Making it work',
    skills: [
      { name: 'HTML and CSS', level: 9 },
      { name: 'JavaScript', level: 8 },
      { name: 'React', level: 8 },
      { name: 'Firebase', level: 7 },
      { name: 'C++ and Assembly', level: 6 },
    ],
  },
  {
    id: 'make',
    title: 'Cockpit',
    blurb: 'Making it feel right',
    skills: [
      { name: 'Interface design', level: 7 },
      { name: 'Motion and animation', level: 7 },
      { name: 'Illustration and SVG', level: 6 },
      { name: 'Storytelling', level: 7 },
    ],
  },
  {
    id: 'ship',
    title: 'Mission control',
    blurb: 'Getting it out the door',
    skills: [
      { name: 'Client delivery', level: 8 },
      { name: 'Deploying to the web', level: 8 },
      { name: 'Payments and ticketing', level: 7 },
      { name: 'Computer vision', level: 5 },
    ],
  },
];

export const LEVEL_WORDS = ['', 'Warming up', 'Warming up', 'Learning', 'Learning', 'Steady', 'Steady', 'Cruising', 'Cruising', 'Hotshot', 'Hotshot'];

// Fill these in and they appear in the contact section. Empty ones show as "not on the radar yet" instead of linking nowhere.
export const EMAIL = 'chitambalaemail@gmail.com';
export const SOCIALS = [
  { id: 'github', label: 'GitHub', note: 'Code', url: 'https://github.com/CJM007', icon: 'code' },
  { id: 'linkedin', label: 'LinkedIn', note: 'The grown up one', url: '', icon: 'link' },
];
