import { noiseURI } from '../Universe/textures';

// One hidden set of filters used everywhere. The wobble filter nudges small pictures (icons, buttons) so their edges
// look pen drawn. Only ever used on small, still things, because it is too heavy for the big moving planets.
export default function SketchDefs() {
  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          <filter id="scribble" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="scribble-big" x="-6%" y="-6%" width="112%" height="112%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <div
        className="paper"
        aria-hidden="true"
        style={{ backgroundImage: noiseURI({ fx: 0.9, fy: 0.9, oct: 2, seed: 4, rgb: [255, 244, 220], gain: 0.9, bias: -0.25, size: 220 }) }}
      />
    </>
  );
}
