/**
 * Content generation mode definitions
 */

export const MODES = [
  {
    id: 'horror',
    label: 'Horror Story',
    shortLabel: 'Horror',
    icon: '👁️',
    color: 'var(--horror)',
    dimColor: 'var(--horror-dim)',
    description: 'Atmospheric, tension-driven horror scripts with cinematic pacing',
    placeholder: 'e.g. A cursed mirror that shows your death, an abandoned hospital...',
    toneOptions: ['Psychological', 'Supernatural', 'Gore', 'Mystery', 'Cosmic Horror', 'Found Footage'],
    lengthOptions: ['Short (5 min)', 'Medium (10 min)', 'Long (15-20 min)'],
  },
  {
    id: 'educational',
    label: 'Educational Script',
    shortLabel: 'Educational',
    icon: '🎓',
    color: 'var(--educational)',
    dimColor: 'var(--educational-dim)',
    description: 'Clear, structured scripts with learning objectives and CTAs',
    placeholder: 'e.g. How quantum computing works, The history of the internet...',
    toneOptions: ['Beginner Friendly', 'Academic', 'Conversational', 'Documentary', 'Expert Deep-Dive'],
    lengthOptions: ['Quick (3-5 min)', 'Standard (8-12 min)', 'Deep Dive (20+ min)'],
  },
  {
    id: 'shorts',
    label: 'Shorts Script',
    shortLabel: 'Shorts',
    icon: '⚡',
    color: 'var(--shorts)',
    dimColor: 'var(--shorts-dim)',
    description: 'Hook-driven scripts optimized for 15-60 second short-form videos',
    placeholder: 'e.g. One productivity hack, a mind-blowing fact about space...',
    toneOptions: ['Viral/Punchy', 'Educational', 'Funny', 'Motivational', 'Story-driven', 'Shocking Fact'],
    lengthOptions: ['15 seconds', '30 seconds', '60 seconds'],
  },
  {
    id: 'hooks',
    label: 'Hooks & Titles',
    shortLabel: 'Hooks',
    icon: '🎣',
    color: 'var(--hooks)',
    dimColor: 'var(--hooks-dim)',
    description: 'Click-optimized titles and opening hooks that maximize CTR',
    placeholder: 'e.g. Video about learning guitar, reviewing the new iPhone...',
    toneOptions: ['Curiosity Gap', 'Shock/Surprise', 'Promise/Benefit', 'Story', 'Question', 'Controversy'],
    lengthOptions: ['5 variations', '10 variations', '15 variations'],
  },
  {
    id: 'seo',
    label: 'SEO Description',
    shortLabel: 'SEO',
    icon: '🔍',
    color: 'var(--seo)',
    dimColor: 'var(--seo-dim)',
    description: 'Algorithm-optimized descriptions with keywords, timestamps, and metadata',
    placeholder: 'e.g. Tutorial on making pasta carbonara, React hooks explained...',
    toneOptions: ['Professional', 'Casual', 'Technical', 'Lifestyle', 'Entertainment'],
    lengthOptions: ['Short (~200 words)', 'Standard (~350 words)', 'Full (~500 words)'],
  },
];

export const getModeById = (id) => MODES.find(m => m.id === id) || MODES[0];
