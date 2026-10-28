// The sound layer. Nothing is downloaded: every sound is made live with the Web Audio API.
// Browsers only allow audio after a click, so sound starts switched off and the Sound button turns it on.
let ctx = null;
let master = null;
let hum = null;
let on = false;
const listeners = new Set();

const notify = () => listeners.forEach((fn) => fn(on));
export const isOn = () => on;
export const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  return ctx;
}

function startHum() {
  if (hum || !ctx) return;
  // A low engine drone: two slightly detuned notes through a filter that slowly breathes.
  const out = ctx.createGain();
  out.gain.value = 0.07;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 320;
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.12;
  lfoGain.gain.value = 120;
  lfo.connect(lfoGain).connect(filter.frequency);
  const notes = [55, 55.4, 82.4, 110.3].map((f, i) => {
    const o = ctx.createOscillator();
    o.type = i < 2 ? 'sawtooth' : 'sine';
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.value = i < 2 ? 0.45 : 0.25;
    o.connect(g).connect(filter);
    o.start();
    return o;
  });
  filter.connect(out).connect(master);
  lfo.start();
  hum = { notes, lfo };
}

export async function enable() {
  const c = ensure();
  if (!c) return false;
  if (c.state === 'suspended') await c.resume();
  startHum();
  master.gain.cancelScheduledValues(c.currentTime);
  master.gain.linearRampToValueAtTime(1, c.currentTime + 0.8);
  on = true;
  notify();
  blip(1.4);
  return true;
}

export function disable() {
  if (!ctx) return;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
  on = false;
  notify();
}

const ready = () => on && ctx && ctx.state === 'running';

// A short chirp for hovering over things.
let lastBlip = 0;
export function blip(pitch = 1) {
  if (!ready()) return;
  const t = ctx.currentTime;
  if (t - lastBlip < 0.07) return;
  lastBlip = t;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'triangle';
  o.frequency.setValueAtTime(700 * pitch, t);
  o.frequency.exponentialRampToValueAtTime(1250 * pitch, t + 0.07);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.07, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + 0.13);
}

function noiseBuffer(seconds) {
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

// The hyperspeed jump between screens.
export function whoosh() {
  if (!ready()) return;
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(1.2);
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.Q.value = 1.2;
  f.frequency.setValueAtTime(200, t);
  f.frequency.exponentialRampToValueAtTime(3200, t + 0.6);
  f.frequency.exponentialRampToValueAtTime(300, t + 1.15);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.16, t + 0.5);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.15);
  src.connect(f).connect(g).connect(master);
  src.start(t);
}

// The transmission sting: a falling warble under a burst of static.
export function sting() {
  if (!ready()) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(880, t);
  o.frequency.exponentialRampToValueAtTime(110, t + 0.9);
  const trem = ctx.createOscillator();
  const tg = ctx.createGain();
  trem.frequency.value = 22;
  tg.gain.value = 0.05;
  trem.connect(tg).connect(g.gain);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.1, t + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1);
  o.connect(g).connect(master);
  const n = ctx.createBufferSource();
  n.buffer = noiseBuffer(0.5);
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.12, t);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 1800;
  n.connect(hp).connect(ng).connect(master);
  o.start(t); trem.start(t); n.start(t);
  o.stop(t + 1.05); trem.stop(t + 1.05);
}

// A soft confirmation, for pressing the big buttons.
export function ding() {
  if (!ready()) return;
  const t = ctx.currentTime;
  [660, 990].forEach((fq, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = fq;
    g.gain.setValueAtTime(0.0001, t + i * 0.09);
    g.gain.exponentialRampToValueAtTime(0.09, t + i * 0.09 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 0.5);
    o.connect(g).connect(master);
    o.start(t + i * 0.09);
    o.stop(t + i * 0.09 + 0.55);
  });
}
