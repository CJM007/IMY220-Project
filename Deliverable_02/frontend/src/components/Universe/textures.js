// Noise pictures made from an SVG turbulence filter. Every planet surface and nebula is built from these,
// so there are no image files to download.
const cache = new Map();

export function noiseURI(opts) {
  const key = JSON.stringify(opts);
  if (cache.has(key)) return cache.get(key);

  const {
    fx = 0.01,
    fy = 0.01,
    oct = 4,
    seed = 1,
    rgb = [255, 255, 255],
    gain = 1.5,
    bias = -0.3,
    size = 512,
    type = 'fractalNoise',
    steps = 0,
  } = opts;
  const [r, g, b] = rgb.map((v) => (v / 255).toFixed(3));
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}' preserveAspectRatio='none'>` +
    `<filter id='n' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>` +
    `<feTurbulence type='${type}' baseFrequency='${fx} ${fy}' numOctaves='${oct}' seed='${seed}' stitchTiles='stitch'/>` +
    `<feColorMatrix type='matrix' values='0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} ${gain} 0 0 0 ${bias}'/>` +
    `${steps ? `<feComponentTransfer><feFuncA type='discrete' tableValues='${Array.from({ length: steps + 1 }, (_, i) => (i / steps).toFixed(2)).join(' ')}'/></feComponentTransfer>` : ''}` +
    `</filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
  const uri = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  cache.set(key, uri);
  return uri;
}

// A small seeded random number generator, so the asteroid belt looks the same every time.
export function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
