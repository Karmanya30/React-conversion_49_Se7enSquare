/** Static data constants for the Appeal page. */

export const APPEAL_TYPES = [
  { id: 'false_report',      label: 'False Report',       desc: 'The moderation action was based on a false or malicious report.' },
  { id: 'misunderstanding',  label: 'Misunderstanding',   desc: 'My content or behavior was misunderstood or taken out of context.' },
  { id: 'changed_behavior',  label: 'Changed Behavior',   desc: 'I understand why I was actioned and have committed to improving.' },
  { id: 'technical_error',   label: 'Technical Error',    desc: 'The action was applied due to a bug or system error, not my behavior.' },
  { id: 'other',             label: 'Other Reason',       desc: 'My appeal reason is not covered by the options above.' },
];

export const ACTION_DETAILS = [];
export const TIMELINE_EVENTS = [];

export const NEXT_STEPS = [
  { icon: '📥', label: 'Appeal received',    desc: 'Your appeal is logged and queued for review.' },
  { icon: '🔍', label: 'Senior mod review',  desc: 'A senior moderator reviews your case and the original action.' },
  { icon: '⚖️', label: 'Decision made',      desc: 'A decision is made within 48–72 hours.' },
  { icon: '📧', label: 'You are notified',   desc: 'You receive the outcome via email and platform notification.' },
];
