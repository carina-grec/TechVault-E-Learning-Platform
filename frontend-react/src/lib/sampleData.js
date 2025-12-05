export const learnerStats = [
  { label: 'Current Level', value: '8' },
  { label: 'Daily Streak', value: '14 days', hint: 'Keep the momentum!' },
  { label: 'Total XP', value: '12,540', trend: 12 },
];

export const badges = [
  { title: 'Python Novice', description: 'Completed your first script', icon: 'code', color: 'bg-accentRose/70' },
  { title: '10-Day Streak', description: 'Coded for 10 days in a row', icon: 'local_fire_department', color: 'bg-accentLime/70' },
  { title: 'First Function', description: 'Wrote and called a function', icon: 'function', color: 'bg-softGold/60' },
];

export const vaultCards = [
  {
    title: 'JavaScript Fundamentals',
    description: 'Master the core concepts of JavaScript.',
    status: 'New',
    cta: 'Start',
  },
  {
    title: 'Advanced CSS Grid',
    description: 'Build complex, responsive layouts with ease.',
    status: 'In Progress',
    cta: 'Continue',
  },
  {
    title: 'React State Management',
    description: 'Learn Hooks, Context, and modern patterns.',
    status: 'Unlocked',
    cta: 'Open Vault',
  },
  {
    title: 'Python for Data Science',
    description: 'Unlock the power of data with Python.',
    status: 'Unlocked',
    cta: 'Open Vault',
  },
];

export const cmsVaults = [
  {
    title: 'Introduction to Python',
    quest: 'Python Basics',
    status: 'Published',
    modified: '2023-10-26',
  },
  {
    title: 'Advanced Data Structures',
    quest: 'Algorithm Deep Dive',
    status: 'Published',
    modified: '2023-10-25',
  },
  {
    title: 'JavaScript Fundamentals',
    quest: 'Web Development 101',
    status: 'Draft',
    modified: '2023-10-24',
  },
  {
    title: 'Cybersecurity Essentials',
    quest: 'Security Principles',
    status: 'Archived',
    modified: '2023-09-15',
  },
];

export const masteryTopics = [
  { topic: 'Variables', progress: 85 },
  { topic: 'Loops', progress: 70 },
  { topic: 'Functions', progress: 95 },
  { topic: 'Arrays', progress: 60 },
  { topic: 'Objects', progress: 40 },
];

export const childProfiles = [
  {
    name: 'Alex',
    course: 'Python Basics',
    lastActive: '2 hours ago',
    progress: 75,
  },
  {
    name: 'Jamie',
    course: 'Intro to JavaScript',
    lastActive: '1 day ago',
    progress: 40,
  },
  {
    name: 'Sam',
    course: 'HTML & CSS Fun',
    lastActive: '5 hours ago',
    progress: 90,
  },
];

export const dojoChallenge = {
  title: 'Two Sum',
  difficulty: 'Easy',
  description:
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  examples: [
    { title: 'Example 1', input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
    { title: 'Example 2', input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
  ],
  constraints: [
    '2 <= nums.length <= 10^4',
    '-10^9 <= nums[i] <= 10^9',
    '-10^9 <= target <= 10^9',
    'Only one valid answer exists.',
  ],
};

export const reviewFeedback = [
  { title: 'Summary', body: 'Great job! All automated checks passed.', tone: 'success' },
  { title: 'Syntax', body: 'No syntax errors found. The code is valid.', tone: 'success' },
  { title: 'Logic', body: 'Positive integer case returns correct sums.', tone: 'info' },
  { title: 'Style', body: 'Consider more descriptive variable names for clarity.', tone: 'warning' },
];
