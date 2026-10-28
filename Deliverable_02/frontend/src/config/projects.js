// The waypoints. A project with status 'charted' opens a full panel; 'uncharted' stays a mystery until its week.
// Screenshots: drop PNG or JPG files in public/projects/<id>/ using the names below. Until they exist the page
// draws a sketch of a browser window instead, so nothing looks broken.

const shot = (id, n, alt) => ({ src: `projects/${id}/shot-${n}.png`, alt });

export const PROJECTS = [
  {
    id: 'habibi',
    name: 'Habibi Events',
    kind: 'Ticketing platform',
    status: 'charted',
    look: 'habibi',
    tagline: 'Events, tickets and the door.',
    blurb:
      'A ticketing platform I run. Three React apps work together: the site people buy from, an admin app with the sales numbers, and a scanner for the door. Payments go through Paystack, tickets can be spun around in 3D, and check-in is transactional so one ticket never gets in twice.',
    stack: ['React', 'Firebase Firestore', 'Paystack', 'Three.js'],
    live: 'https://habibievents.co.za/',
    linkLabel: 'Visit the live site',
    shots: [
      shot('habibi', 1, 'The Habibi Scanner, used at the door to check tickets in'),
    ],
  },
  {
    id: 'laundrytrack',
    name: 'LaundryTrack',
    kind: 'Web app',
    status: 'charted',
    look: 'laundry',
    tagline: 'Where is my washing?',
    // EDIT: update this blurb with the features you want to highlight.
    blurb:
      'A laundry tracking app for the House TAU laundry room. Residents see the whole room in 3D and can tell at a glance which washers and dryers are free, in use, almost done or out of order.',
    stack: [],
    live: 'https://taulaundrotrack.netlify.app/',
    shots: [
      shot('laundrytrack', 1, 'The TAU laundry room in 3D, with every machine and its status'),
    ],
  },
  {
    id: 'cv-detect',
    name: 'CV Weapon Detection',
    kind: 'Computer vision',
    status: 'charted',
    look: 'cv',
    tagline: 'Teaching a camera to spot trouble.',
    blurb:
      'A computer vision safety tool for rideshare drivers. A YOLO object detection model looks through camera footage for weapons and balaclavas. The dataset is managed and labelled in Roboflow, and the model is trained and retrained while tracking how well it finds small objects, which is the hard part.',
    stack: ['YOLO', 'Python', 'Roboflow'],
    live: '', // EDIT: a demo or code link, if there is one (shows as pending until set)
    linkLabel: 'See the project',
    shots: [
      shot('cv-detect', 1, 'Labelling the dataset in Roboflow: a box drawn around the weapon in a camera frame'),
      shot('cv-detect', 2, 'Training the detector, epoch by epoch, with precision and mAP tracked'),
    ],
  },
  {
    id: 'fnf',
    name: 'FNF',
    kind: 'NGO management system',
    status: 'charted',
    look: 'fnf',
    tagline: 'Four pillars, one dashboard.',
    blurb:
      'A management system for the Food and Nutrition Foundation, an NGO working across Zambia, Malawi and South Africa. It tracks the four programme pillars on live dashboards, takes donations through PayFast, has a filterable photo gallery, and gives staff role-based admin access.',
    stack: ['React', 'Firebase', 'Recharts', 'PayFast'],
    live: 'https://foodandnutritionfoundation.com/',
    shots: [
      shot('fnf', 1, 'The FNF home page'),
      shot('fnf', 2, 'The FNF impact numbers'),
    ],
  },
];
