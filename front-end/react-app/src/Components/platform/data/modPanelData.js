/** Static data constants for the Moderator Panel page. */

export const DEFAULT_REPORTS = [];

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
