// Same URL shape the legacy wizard validated against.
export const URL_PATTERN = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([/\w-]*)*\/?$/i;

export const CATEGORIES = ['FPS', 'MOBA', 'RPG', 'Strategy', 'Sports', 'Indie', 'Speedrunning', 'Other'];

export const ICONS = ['⚡', '🚀', '🔥', '🌟', '💡', '🎯', '🏆', '🌐', '⚙'];

export const BANNERS = [
  'linear-gradient(135deg, #1e1b4b, #4338ca)',
  'linear-gradient(135deg, #064e3b, #059669)',
  'linear-gradient(135deg, #701a75, #c026d3)',
  'linear-gradient(135deg, #7c2d12, #ea580c)',
  'linear-gradient(135deg, #0f172a, #334155)',
  'linear-gradient(135deg, #134e4a, #0d9488)',
  'linear-gradient(135deg, #831843, #db2777)',
];

export const WIZARD_STEPS = [
  { step: 1, title: 'Basic Info', sub: 'Name, category, description' },
  { step: 2, title: 'Appearance', sub: 'Banner, avatar, colors' },
  { step: 3, title: 'Channels', sub: 'Set up your channels' },
  { step: 4, title: 'Settings & Rules', sub: 'Privacy, roles, guidelines' },
];

export const DEFAULT_CHANNELS = [
  { id: 1, name: 'announcements', type: 'Read-only', icon: '📢', desc: 'Official updates' },
  { id: 2, name: 'general', type: 'Text', icon: '💬', desc: 'General discussion' },
  { id: 3, name: 'help', type: 'Text', icon: '🔧', desc: 'Ask questions' },
  { id: 4, name: 'voice-lounge', type: 'Voice', icon: '🎙', desc: 'Casual voice chats' },
];

export const DEFAULT_PERMISSIONS = {
  invites: true,
  approval: false,
  autoMod: true,
  memberEvents: true,
};
