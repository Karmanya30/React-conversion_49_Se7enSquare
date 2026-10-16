/** Static data constants for the ProfileSettings page. */

export const STATUS_OPTIONS = [
  { id: 'Online',         color: 'var(--success)' },
  { id: 'Away',           color: 'var(--gold)' },
  { id: 'Do Not Disturb', color: 'var(--error)' },
  { id: 'Invisible',      color: 'var(--text-3)' },
];

export const DEFAULT_PRIVACY = {
  profileVis:    'public',
  messages:      'everyone',
  showEmail:     false,
  showPhone:     false,
  showActivity:  true,
  searchEngine:  true,
};

export const DEFAULT_ACCESSIBILITY = {
  fontSize:     'medium',
  contrast:     false,
  reduceMotion: false,
  screenReader: false,
  keyboardNav:  false,
};

/** Moderator certification quiz questions and correct answers. */
export const MOD_QUIZ_QUESTIONS = [
  {
    key: 'q1',
    correct: 'b',
    question: '1. What should you do when hate speech is detected?',
    options: [
      { value: 'a', label: 'Ignore if it is funny' },
      { value: 'b', label: 'Delete message immediately and warn or mute the user' },
    ],
  },
  {
    key: 'q2',
    correct: 'c',
    question: '2. How should you handle conflict escalation between players?',
    options: [
      { value: 'c', label: 'Remind both parties of community rules and issue cooldown if necessary' },
      { value: 'd', label: 'Take sides with your friend' },
    ],
  },
  {
    key: 'q3',
    correct: 'a',
    question: '3. What is the procedure for ban appeals?',
    options: [
      { value: 'a', label: 'Review user statement, incident logs, and check for genuine remorse or mistaken action' },
      { value: 'b', label: 'Automatically reject all appeals' },
    ],
  },
];
