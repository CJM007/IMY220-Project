# Into the Unknown

Chitambala Sikazwe (u25173384) | VIO 202 Theme 4, Project 4 portfolio.

A portfolio framed as a deep space mission log. Six screens, and each one is its own universe.
Travelling between them sends the ship through a burst of hyperspeed, and it lands in a new sky with new planets.

## Run it

    npm install
    npm start          # http://localhost:3000
    npm run build      # production build in /build

The build uses relative paths and hash routes (#/launch, #/waypoints/habibi), so the /build folder
can be dragged straight onto Netlify or dropped in any static host.

Add `?lite=1` to the address to see the calm version (still planets, no nebula) that very weak machines get automatically.
`?lite=0` forces the full version.

## Before you show it

Open `src/config/mission.js` and set `INFOGRAPHIC_URL` to the live address of the infographic.
Until it is set, that link shows as "Link not set yet" instead of pointing nowhere.
The comic link already points at https://viocomic.netlify.app/.

## Folder structure

    src/
      config/mission.js         screens, sub menus and outside links
      hooks/                    useRoute, useReducedMotion, useMissionClock
      styles/                   tokens.css (base colours, fonts, one colour set per universe), global.css
      components/
        Icons/                  every icon, drawn as SVG (rocket, planets, console, chevrons and so on)
        Starfield/              canvas stars, three depth layers, mouse parallax, hyperspeed burst on screen change
        Universe/
          universes.js          the six universes: name, colours, star tint and which bodies float in each
          Bodies.js             planet (with optional rings), sun, black hole, asteroid belt, station, debris
          textures.js           planet surfaces and nebulae, generated from SVG noise so there are no image files
          UniverseStage.js      keeps the old universe on screen while the new one lands
          Arrival.js            the "Now entering" name plate
        Hud/                    HudShell (cockpit window), TopBar, FlightRail, ConsoleNav
        ExternalLink/           link that leaves the portfolio
      screens/
        Launch/                 screen 01, with the zero-gravity title and the mission patch
        ScreenStub/             placeholder for screens 02 to 06 until their week

## Changing a universe

Everything about a universe lives in one block of `universes.js`. Move a planet by changing its x and y,
resize it with size, or add a new body to the `bodies` list. Colours for the HUD live in `tokens.css`.

## Fonts

Unbounded for headings and Bricolage Grotesque for body text, both installed as packages so they work offline.

## Accessibility

Keyboard reachable menu with Escape to close, visible focus, sub menus as real buttons with aria-expanded,
and every animation stops when the system asks for reduced motion.

## Week 3 additions

- Hand drawn art system: `src/sketch/rough.js` (seeded wobbly lines, loops, hatching), `src/components/Sketch/` (pen-drawn panels, doodles, filters, paper grain). Fonts are now Permanent Marker (headings), Kalam (handwriting) and Bricolage Grotesque (reading text).
- Mission Briefing (`src/screens/Briefing/`): flip-over Pilot ID, captain's log, scroll-filled skills readout and a contact form. Edit the words, skill levels, email and socials in `src/config/profile.js`.
- Waypoints (`src/screens/Waypoints/`): a star map with a flight path and a panel per project. Edit projects, blurbs, live links and screenshot names in `src/config/projects.js`; drop screenshots into `public/projects/<id>/`.
- Contact form uses Netlify Forms. The hidden copy of the form in `public/index.html` is what Netlify detects, so deploy to Netlify (drag and drop works) and turn on form notifications in the Netlify dashboard. On any other host the form shows a friendly error.

## Weeks 4 to 6 additions

- All four waypoints are charted (Habibi Events, LaundryTrack, CV Weapon Detection, FNF). Set the live links and screenshot names in `src/config/projects.js`.
- Signal Detected (`src/screens/Signal`), Recovered File (`src/screens/File`) and Return Signal (`src/screens/Return`) are built. Set `INFOGRAPHIC_URL` in `src/config/mission.js` so the Recovered File button goes live.
- Sound layer (`src/sound/`): ambient hum, hover blips, a whoosh between screens and the transmission sting, all synthesised in the browser. It starts off; the Sound button in the top bar turns it on.
- Signs of life: items float in as they scroll into view, the background planets drift with scroll, and cards breathe (`src/hooks/useAlive.js`).
- Texture pass: grain and chalk speckle on planets, flat marker shading instead of smooth gradients, posterised nebula clouds, stronger paper grain.
- On phones the star map becomes a list of planets.
