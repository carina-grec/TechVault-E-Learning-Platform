export const seedUsers = [
  {
    id: 'learner-1',
    name: 'Maya Sparks',
    email: 'maya@techvaultkids.io',
    password: 'learn',
    role: 'LEARNER',
  },
  {
    id: 'admin-1',
    name: 'Coach Nolan',
    email: 'coach@techvaultkids.io',
    password: 'admin',
    role: 'ADMIN',
  },
  {
    id: 'guardian-1',
    name: 'Mentor Ivy',
    email: 'ivy@techvaultkids.io',
    password: 'guardian',
    role: 'GUARDIAN',
  },
]

export const mascotRoster = {
  featured: {
    id: 'pixel-fox',
    name: 'Pixel the Coding Fox',
    description:
      'Pixel is a cuddly fox composed of glowing pixels. She zooms around with a trail of stars, cheering on junior coders.',
    states: {
      idle: 'Ready for your next quest!',
      thinking: 'Calculating hints...',
      success: 'Great debugging! XP unlocked.',
      pending: 'Sending code to the grading clouds...',
    },
  },
  companions: [
    {
      id: 'byte-robot',
      name: 'Byte the Robo-Buddy',
      moodColor: '#4a90e2',
    },
    {
      id: 'loop-owl',
      name: 'Loop the Wizard Owl',
      moodColor: '#8c6ff0',
    },
    {
      id: 'echo-cube',
      name: 'Echo the Mini AI Cube',
      moodColor: '#3cc9b0',
    },
  ],
}

export const vaultsData = [
  {
    id: 'vault-pixel-forest',
    title: 'Pixel Forest Pathways',
    slug: 'pixel-forest-pathways',
    description:
      'Guide friendly sprites through the Pixel Forest while practicing JavaScript basics, loops, and friendly functions.',
    category: 'Pixel Forest',
    difficulty: 'Beginner',
    totalQuests: 12,
    completedQuests: 7,
    featured: true,
    status: 'published',
    heroHighlight: 'A cozy starting grove packed with colorful console logs.',
    mascot: 'Pixel the Coding Fox',
  },
  {
    id: 'vault-algorithm-ocean',
    title: 'Algorithm Ocean Lab',
    slug: 'algorithm-ocean-lab',
    description:
      'Dive into Algorithm Ocean, match coral patterns, and learn APIs + async magic with magical sea drones.',
    category: 'Algorithm Ocean',
    difficulty: 'Intermediate',
    totalQuests: 10,
    completedQuests: 4,
    featured: true,
    status: 'published',
    heroHighlight: 'Ride the current of API calls and keep the tide on schedule.',
    mascot: 'Byte the Robo-Buddy',
  },
  {
    id: 'vault-matrix-mountain',
    title: 'Matrix Mountain Trials',
    slug: 'matrix-mountain-trials',
    description:
      'Scale Matrix Mountain by solving graph routes, portals, and teleporting algorithms one puzzle at a time.',
    category: 'Matrix Mountain',
    difficulty: 'Advanced',
    totalQuests: 14,
    completedQuests: 3,
    featured: false,
    status: 'published',
    heroHighlight: 'Earn gems for each clever path you chart through the peaks.',
    mascot: 'Loop the Wizard Owl',
  },
  {
    id: 'vault-cloud-carousel',
    title: 'Cloud Carousel Ops',
    slug: 'cloud-carousel-ops',
    description:
      'Automate cozy cloud contraptions with pipelines and IaC scripts to keep the floating carousel spinning.',
    category: 'Sky Loom',
    difficulty: 'Intermediate',
    totalQuests: 8,
    completedQuests: 5,
    featured: false,
    status: 'draft',
    heroHighlight: 'Keep the gears glowing and observability fireflies happy.',
    mascot: 'Echo the Mini AI Cube',
  },
]

export const questsData = [
  {
    id: 'quest-light-orbs',
    vaultId: 'vault-pixel-forest',
    title: 'Light Orb Sorters',
    type: 'CodeChallenge',
    difficulty: 'Beginner',
    estimatedTime: '25 min',
    language: 'JavaScript',
    gradingStrategy: 'UNIT_TEST',
    description:
      'Gather scattered light orbs, remove duplicates, and line them up from dimmest to brightest using pure functions.',
    examples: [
      {
        input: '[3,2,2,1]',
        output: '[1,2,3]',
      },
    ],
    starterCode: `export function sortOrbs(orbs = []) {
  // Pixel says: keep it chill and pure
  return [...new Set(orbs)].sort((a, b) => a - b)
}
`,
  },
  {
    id: 'quest-bubble-bots',
    vaultId: 'vault-algorithm-ocean',
    title: 'Bubble Courier Bots',
    type: 'CodeChallenge',
    difficulty: 'Intermediate',
    estimatedTime: '40 min',
    language: 'JavaScript',
    gradingStrategy: 'UNIT_TEST',
    description:
      'Coordinate bubble courier bots that fetch weather spells from multiple coral cities using async/await.',
    examples: [
      { input: 'requestForecast(["Coral City","Star Bay"])', output: '{ city:"Coral City", temp:72 }' },
    ],
    starterCode: `export async function requestForecast(destinations = []) {
  // TODO: parallelize requests & handle fizzled bubbles
  return Promise.all(destinations)
}
`,
  },
  {
    id: 'quest-schema-shield',
    vaultId: 'vault-algorithm-ocean',
    title: 'Schema Shield Quiz',
    type: 'Quiz',
    difficulty: 'Intermediate',
    estimatedTime: '20 min',
    language: 'N/A',
    gradingStrategy: 'QUIZ_AUTOGRADE',
    description:
      'Choose the best guardian shield (validation strategy) for each microservice gateway challenge.',
    options: ['Gateway validation', 'Service validation', 'Skip validation'],
    starterCode: '',
  },
  {
    id: 'quest-portal-paths',
    vaultId: 'vault-matrix-mountain',
    title: 'Portal Path Mapper',
    type: 'CodeChallenge',
    difficulty: 'Advanced',
    estimatedTime: '60 min',
    language: 'Python',
    gradingStrategy: 'UNIT_TEST',
    description:
      'Plan a cost-friendly portal route through Matrix Mountain and return the travel path with notes.',
    examples: [
      { input: 'start=A, end=F', output: 'Cost: 24, Path: A->B->E->F' },
    ],
    starterCode: `def map_portals(graph, start, end):
    # Owl Loop says: maybe Dijkstra?
    return []`,
  },
]

export const badgeCatalog = [
  {
    id: 'badge-1',
    name: 'Star Seeker',
    requirement: 'Complete 5 quests without putting the console in panic.',
    unlocked: true,
  },
  {
    id: 'badge-2',
    name: 'Loop Guardian',
    requirement: 'Finish three loops quests with no retries.',
    unlocked: true,
  },
  {
    id: 'badge-3',
    name: 'Bug Squasher',
    requirement: 'Recover from two failed submissions in a row.',
    unlocked: false,
  },
  {
    id: 'badge-4',
    name: 'Guardian Ally',
    requirement: 'Invite a guardian or mentor to cheer your progress.',
    unlocked: false,
  },
]

export const initialSubmissions = [
  {
    id: 'sub-101',
    questId: 'quest-light-orbs',
    questTitle: 'Light Orb Sorters',
    status: 'COMPLETED',
    result: 'PASSED',
    score: 98,
    submittedAt: '2025-11-10T10:00:00Z',
    feedback: 'Pixel tails-wag approved: clean sorting spell!',
  },
  {
    id: 'sub-102',
    questId: 'quest-bubble-bots',
    questTitle: 'Bubble Courier Bots',
    status: 'PENDING',
    result: null,
    score: null,
    submittedAt: '2025-11-15T07:45:00Z',
    feedback: 'Waiting for coral judges...',
  },
]

export const progressOverview = {
  questsCompleted: 18,
  activeVaults: 3,
  totalBadges: 4,
  streakDays: 6,
  xpPercent: 65,
  weeklyData: [
    { label: 'Mon', value: 2 },
    { label: 'Tue', value: 3 },
    { label: 'Wed', value: 4 },
    { label: 'Thu', value: 3 },
    { label: 'Fri', value: 5 },
  ],
  timeline: [
    {
      id: 'timeline-1',
      title: 'Unlocked Algorithm Ocean Lab',
      detail: 'Pixel Fox carried your key to the coral gate.',
      date: 'Oct 24',
    },
    {
      id: 'timeline-2',
      title: 'Badge earned: Star Seeker',
      detail: '5 quests without a bug storm.',
      date: 'Nov 01',
    },
    {
      id: 'timeline-3',
      title: 'Guardian linked',
      detail: 'Mentor Ivy now receives badge beacons.',
      date: 'Nov 12',
    },
  ],
}

export const guardianLearners = [
  {
    id: 'learner-1',
    name: 'Maya Sparks',
    focus: 'Pixel Forest',
    badgesUnlocked: 3,
    vaultProgress: [
      {
        vaultId: 'vault-pixel-forest',
        title: 'Pixel Forest Pathways',
        completed: 7,
        total: 12,
      },
      {
        vaultId: 'vault-algorithm-ocean',
        title: 'Algorithm Ocean Lab',
        completed: 4,
        total: 10,
      },
    ],
    submissions: initialSubmissions,
    nextBadge: 'Bug Squasher',
  },
  {
    id: 'learner-2',
    name: 'Leo Blaze',
    focus: 'Matrix Mountain',
    badgesUnlocked: 1,
    vaultProgress: [
      {
        vaultId: 'vault-matrix-mountain',
        title: 'Matrix Mountain Trials',
        completed: 3,
        total: 14,
      },
    ],
    submissions: [],
    nextBadge: 'Loop Guardian',
  },
]

export const landingSections = {
  steps: [
    {
      id: 'step-choose',
      title: 'Pick a magical vault',
      detail: 'Pixel Forest, Algorithm Ocean, and Matrix Mountain await brave coders.',
    },
    {
      id: 'step-complete',
      title: 'Complete coding quests',
      detail: 'Solve puzzles with playful editors, hints, and mascot cheer squads.',
    },
    {
      id: 'step-grade',
      title: 'Earn XP + badges',
      detail: 'Async grading turns into story moments with sparkles and confetti.',
    },
  ],
  adminCTA: {
    title: 'Built-in control room for admins',
    detail:
      'Craft immersive quests, configure grading spells, and monitor young adventurers.',
  },
}

export const adminStats = {
  vaults: 12,
  quests: 48,
  submissionsToday: 256,
  activeLearners: 982,
}
