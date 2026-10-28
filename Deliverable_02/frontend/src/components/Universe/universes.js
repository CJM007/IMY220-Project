// Each screen is its own universe: a colour mood, a star tint, a name and the bodies that float in it.
// x and y place the centre of a body as a share of the window. size is its width. depth is how far it slides with the mouse.

const HOME = {
  base: 'linear-gradient(#0b3d78, #1b74b8 50%, #0b3d78)',
  atmo: 'rgba(120, 205, 255, 0.75)',
  spin: 320,
  tex: [
    { fx: 0.007, fy: 0.007, oct: 5, seed: 4, rgb: [84, 168, 92], gain: 14, bias: -7.5 },
    { fx: 0.014, fy: 0.014, oct: 4, seed: 21, rgb: [222, 196, 130], gain: 12, bias: -6.6 },
    { fx: 0.009, fy: 0.03, oct: 5, seed: 9, rgb: [255, 255, 255], gain: 3, bias: -1.32 },
  ],
};

const rockMoon = (tone, seed = 2) => ({
  base: `linear-gradient(${tone}, ${tone})`,
  atmo: 'rgba(255,255,255,0.15)',
  spin: 500,
  tex: [
    { fx: 0.011, fy: 0.011, oct: 3, seed, rgb: [30, 34, 48], gain: 3.4, bias: -1.7 },
    { fx: 0.007, fy: 0.007, oct: 2, seed: seed + 5, rgb: [245, 246, 250], gain: 2.6, bias: -1.2 },
  ],
});

const GIANT = {
  base: 'linear-gradient(#6a3fbf 0%, #b985ff 16%, #7b4fd0 30%, #f0a6d8 45%, #8a5be0 58%, #4b2a9a 76%, #9c6bea 100%)',
  atmo: 'rgba(200, 150, 255, 0.7)',
  spin: 260,
  tex: [
    { fx: 0.002, fy: 0.07, oct: 3, seed: 5, rgb: [255, 220, 250], gain: 2.6, bias: -1.1 },
    { fx: 0.003, fy: 0.1, oct: 3, seed: 11, rgb: [30, 10, 70], gain: 2.8, bias: -1.2 },
  ],
};

const ICE = {
  base: 'linear-gradient(#1c8a86, #5fe3c9 45%, #1c8a86)',
  atmo: 'rgba(120, 255, 220, 0.7)',
  spin: 280,
  tex: [
    { fx: 0.004, fy: 0.02, oct: 5, seed: 3, rgb: [255, 255, 255], gain: 3.6, bias: -1.6 },
    { fx: 0.006, fy: 0.03, oct: 4, seed: 8, rgb: [6, 60, 70], gain: 3.2, bias: -1.4 },
  ],
};

const DESERT = {
  base: 'linear-gradient(#a8471f, #e08a48 50%, #a8471f)',
  atmo: 'rgba(255, 170, 100, 0.6)',
  spin: 200,
  tex: [
    { fx: 0.004, fy: 0.02, oct: 4, seed: 14, rgb: [255, 200, 130], gain: 3, bias: -1.35 },
    { fx: 0.014, fy: 0.014, oct: 3, seed: 6, rgb: [90, 30, 10], gain: 6.5, bias: -3.2 },
  ],
};

const MOSS = {
  base: 'linear-gradient(#3d5a12, #86a82a 50%, #3d5a12)',
  atmo: 'rgba(196, 240, 90, 0.65)',
  spin: 240,
  tex: [
    { fx: 0.012, fy: 0.012, oct: 5, seed: 12, rgb: [226, 244, 120], gain: 10, bias: -5.2 },
    { fx: 0.008, fy: 0.008, oct: 5, seed: 6, rgb: [22, 30, 6], gain: 12, bias: -6.3 },
  ],
};

export const UNIVERSES = {
  launch: {
    name: 'Home Orbit',
    tagline: 'Last stop before the unknown.',
    tints: ['244,246,255', '244,246,255', '244,246,255', '92,225,230', '255,213,74'],
    sky: {
      base: '#040711',
      glows: [
        ['16% 100%', 'rgba(60, 170, 255, 0.22)', '60%'],
        ['92% 4%', 'rgba(255, 213, 74, 0.09)', '45%'],
      ],
      nebula: { rgb: [70, 120, 255], seed: 3, opacity: 0.32 },
    },
    bodies: [
      { kind: 'planet', look: HOME, x: '82%', y: '100%', size: '104vmin', depth: 22 },
      { kind: 'planet', look: rockMoon('#9096a6', 2), x: '63%', y: '17%', size: '11vmin', depth: 46, bob: 11 },
      { kind: 'planet', look: DESERT, x: '47%', y: '80%', size: '5vmin', depth: 60, bob: 9 },
    ],
  },
  briefing: {
    name: 'Violet Reach',
    tagline: 'Cold, purple and full of moons.',
    tints: ['244,246,255', '244,246,255', '200,160,255', '255,158,210', '255,158,210'],
    sky: {
      base: '#07040f',
      glows: [
        ['10% 80%', 'rgba(160, 90, 255, 0.28)', '58%'],
        ['95% 12%', 'rgba(255, 110, 180, 0.13)', '45%'],
      ],
      nebula: { rgb: [190, 90, 255], seed: 12, opacity: 0.4 },
    },
    bodies: [
      { kind: 'planet', look: GIANT, x: '12%', y: '86%', size: '86vmin', depth: 20, ring: { tilt: -20, span: 2.3, squash: 0.26, hue: ['#ffb6e6', '#f6e1ff', '#c58cff'] } },
      { kind: 'planet', look: rockMoon('#f0c4dc', 5), x: '38%', y: '19%', size: '8vmin', depth: 44, bob: 12 },
      { kind: 'planet', look: rockMoon('#8f9bff', 9), x: '91%', y: '30%', size: '5.4vmin', depth: 58, bob: 10 },
      { kind: 'planet', look: { ...ICE, base: 'linear-gradient(#5a3fd0, #a58bff 50%, #5a3fd0)', atmo: 'rgba(180,160,255,.6)' }, x: '84%', y: '80%', size: '17vmin', depth: 34, bob: 15 },
    ],
  },
  waypoints: {
    name: 'The Waypoint Belt',
    tagline: 'Four worlds worth stopping for.',
    tints: ['244,246,255', '244,246,255', '107,242,192', '255,184,77', '255,184,77'],
    sky: {
      base: '#03090c',
      glows: [
        ['88% 24%', 'rgba(60, 230, 190, 0.2)', '55%'],
        ['6% 76%', 'rgba(255, 140, 60, 0.13)', '50%'],
      ],
      nebula: { rgb: [60, 220, 180], seed: 7, opacity: 0.3 },
    },
    bodies: [
      { kind: 'belt', x: '50%', y: '68%', size: '150vw', depth: 12, tilt: -9 },
      { kind: 'planet', look: ICE, x: '89%', y: '26%', size: '46vmin', depth: 26 },
      { kind: 'planet', look: DESERT, x: '9%', y: '74%', size: '28vmin', depth: 34, bob: 16 },
      { kind: 'planet', look: { ...GIANT, spin: 180 }, x: '74%', y: '60%', size: '9vmin', depth: 52, bob: 10 },
      { kind: 'planet', look: rockMoon('#b7f7dc', 4), x: '30%', y: '14%', size: '6vmin', depth: 60, bob: 9 },
    ],
  },
  signal: {
    name: 'The Anomaly',
    tagline: 'Something out here is talking.',
    tints: ['244,246,255', '255,190,140', '255,138,76', '255,138,76', '255,226,122'],
    sky: {
      base: '#0a0405',
      glows: [
        ['76% 44%', 'rgba(255, 110, 40, 0.24)', '56%'],
        ['6% 14%', 'rgba(255, 60, 40, 0.15)', '40%'],
      ],
      nebula: { rgb: [255, 100, 50], seed: 19, opacity: 0.32 },
    },
    bodies: [
      { kind: 'blackhole', x: '76%', y: '46%', size: '78vmin', depth: 18 },
      { kind: 'sun', x: '11%', y: '20%', size: '15vmin', depth: 40, c: '#ff6a4a', c2: '#ffb04c' },
      { kind: 'planet', look: rockMoon('#7a4634', 8), x: '27%', y: '76%', size: '8vmin', depth: 50, bob: 9 },
    ],
  },
  file: {
    name: 'Moss Sector',
    tagline: 'A file washed up out here.',
    tints: ['244,246,255', '244,246,255', '183,240,74', '226,244,120', '244,246,255'],
    sky: {
      base: '#050803',
      glows: [
        ['88% 76%', 'rgba(150, 220, 40, 0.24)', '58%'],
        ['10% 6%', 'rgba(240, 240, 120, 0.08)', '40%'],
      ],
      nebula: { rgb: [150, 220, 50], seed: 27, opacity: 0.18 },
    },
    bodies: [
      { kind: 'planet', look: MOSS, x: '86%', y: '74%', size: '66vmin', depth: 22 },
      { kind: 'planet', look: rockMoon('#a7b590', 3), x: '17%', y: '24%', size: '12vmin', depth: 42, bob: 13 },
      { kind: 'station', x: '58%', y: '20%', size: '17vmin', depth: 48 },
      { kind: 'debris', x: '30%', y: '76%', size: '30vmin', depth: 56 },
    ],
  },
  return: {
    name: 'The Long Way Home',
    tagline: 'Everything I found is behind me now.',
    tints: ['244,246,255', '255,227,160', '255,227,160', '255,143,163', '244,246,255'],
    sky: {
      base: '#030306',
      glows: [
        ['80% 28%', 'rgba(255, 190, 90, 0.26)', '55%'],
        ['10% 84%', 'rgba(255, 143, 163, 0.1)', '45%'],
      ],
      nebula: { rgb: [255, 170, 110], seed: 33, opacity: 0.22 },
    },
    bodies: [
      { kind: 'sun', x: '80%', y: '28%', size: '24vmin', depth: 24, c: '#ffe3a0', c2: '#ffa93d' },
      { kind: 'planet', look: HOME, x: '13%', y: '78%', size: '15vmin', depth: 46, bob: 14 },
    ],
  },
};
