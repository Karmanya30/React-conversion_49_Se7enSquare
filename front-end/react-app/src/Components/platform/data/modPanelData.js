/** Static data constants for the Moderator Panel page. */

export const DEFAULT_REPORTS = [
  {
    id: 1,
    ref: 'RPT-4821',
    type: 'message',
    reportedUser: 'BadActor_X',
    channel: '#general',
    reason: 'Hate Speech or Discrimination',
    status: 'pending',
    date: 'March 11, 2026 · 10:32 AM',
    context: "This user has been going after new members all morning. This isn't the first time.",
    severity: 'high',
  },
  {
    id: 2,
    ref: 'RPT-4820',
    type: 'user',
    reportedUser: 'SpammerBot',
    channel: '#announcements',
    reason: 'Spam or Unsolicited Promotion',
    status: 'review',
    date: 'March 11, 2026 · 09:14 AM',
    context: 'Repeated self-promotion of external links.',
    severity: 'medium',
  },
  {
    id: 3,
    ref: 'RPT-4819',
    type: 'message',
    reportedUser: 'ToxicPlayer99',
    channel: '#gaming',
    reason: 'Harassment or Bullying',
    status: 'resolved',
    date: 'March 10, 2026 · 06:51 PM',
    context: 'Targeted harassment towards new members.',
    severity: 'high',
    action: 'Temp ban (3 days)',
  },
];

export const QUEUE_TABS = ['pending', 'review', 'resolved'];

export const MOD_ACTIONS = [
  { label: '⚠️ Warn User',         action: 'warn' },
  { label: '🔇 Mute (24h)',         action: 'mute_24h' },
  { label: '🔇 Mute (7d)',          action: 'mute_7d' },
  { label: '🚫 Temp Ban (3d)',      action: 'ban_3d' },
  { label: '🚫 Temp Ban (7d)',      action: 'ban_7d' },
  { label: '⛔ Permanent Ban',      action: 'ban_perm' },
  { label: '🗑️ Delete Message',    action: 'delete_msg' },
  { label: '✅ Dismiss',            action: 'dismiss' },
];
