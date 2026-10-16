/** Static data constants for the Appeal page. */

export const APPEAL_TYPES = [
  { id: 'false_report',      label: 'False Report',       desc: 'The moderation action was based on a false or malicious report.' },
  { id: 'misunderstanding',  label: 'Misunderstanding',   desc: 'My content or behavior was misunderstood or taken out of context.' },
  { id: 'changed_behavior',  label: 'Changed Behavior',   desc: 'I understand why I was actioned and have committed to improving.' },
  { id: 'technical_error',   label: 'Technical Error',    desc: 'The action was applied due to a bug or system error, not my behavior.' },
  { id: 'other',             label: 'Other Reason',       desc: 'My appeal reason is not covered by the options above.' },
];

export const ACTION_DETAILS = [
  { key: 'Action Type', val: 'Temporary Ban (7 Days)',                                                               cls: 'red' },
  { key: 'Issued By',   val: 'Rahul Kumar (Moderator)' },
  { key: 'Date Issued', val: 'March 3, 2025 · 4:17 PM IST' },
  { key: 'Expires',     val: 'March 10, 2025 · 4:17 PM IST',                                                         cls: 'gold' },
  { key: 'Reason Given',val: 'Repeated harassment and violation of community conduct rules after two prior warnings.' },
  { key: 'Action ID',   val: 'ACT-DNX-2025-003847',                                                                  cls: 'mono' },
];

export const TIMELINE_EVENTS = [
  { dot: 'tl-past',   icon: '⚠️', event: '1st Warning issued',        time: 'Feb 18, 2025 · Off-topic spam in #general' },
  { dot: 'tl-past',   icon: '🔇', event: '2nd Warning + 1h mute',     time: 'Feb 28, 2025 · Inappropriate language in #dev-talk' },
  { dot: 'tl-now',    icon: '🚫', event: 'Temporary Ban (7 days)',     time: 'March 3, 2025 · Persistent harassment' },
  { dot: 'tl-future', icon: '🔓', event: 'Ban Expiry',                 time: 'March 10, 2025 at 4:17 PM IST' },
];

export const NEXT_STEPS = [
  { icon: '📥', label: 'Appeal received',    desc: 'Your appeal is logged and queued for review.' },
  { icon: '🔍', label: 'Senior mod review',  desc: 'A senior moderator reviews your case and the original action.' },
  { icon: '⚖️', label: 'Decision made',      desc: 'A decision is made within 48–72 hours.' },
  { icon: '📧', label: 'You are notified',   desc: 'You receive the outcome via email and platform notification.' },
];
