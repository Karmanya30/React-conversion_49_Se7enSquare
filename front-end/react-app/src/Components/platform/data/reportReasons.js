/**
 * Report reasons and steps copied directly from Report.jsx / commit 0cc099a.
 */
export const REASONS = [
  {
    id: 'harass',
    label: 'Harassment or Bullying',
    icon: '👤',
    desc: 'Targeted attacks, repeated unwanted messages, threats, or intimidation of any member.',
  },
  {
    id: 'hate',
    label: 'Hate Speech or Discrimination',
    icon: '🚫',
    desc: 'Content that promotes hatred based on race, religion, gender, sexual orientation, disability, or nationality.',
  },
  {
    id: 'spam',
    label: 'Spam or Unsolicited Promotion',
    icon: '📢',
    desc: 'Repetitive messages, advertisement spam, or irrelevant self-promotion.',
  },
  {
    id: 'nsfw',
    label: 'NSFW or Explicit Content',
    icon: '🔞',
    desc: 'Sexually explicit material, graphic violence, or content not appropriate for general audiences.',
  },
  {
    id: 'misinfo',
    label: 'Misinformation or False Claims',
    icon: '❌',
    desc: 'Deliberately false or misleading technical, medical, or factual information.',
  },
  {
    id: 'other',
    label: 'Other Rule Violation',
    icon: '⚠️',
    desc: 'The content violates community guidelines in a way not listed above.',
  },
];

export const STEPS = [
  { num: 1, label: 'Select Content' },
  { num: 2, label: 'Choose Reason' },
  { num: 3, label: 'Review & Submit' },
];
