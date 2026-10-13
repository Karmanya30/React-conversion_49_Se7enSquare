/**
 * Default fallback data and settings tab definitions for CommunitySettings.
 */
export const DEFAULT_COMMUNITY = {
  name: 'Pro Gamers',
  description: 'Competitive esports community and tournaments.',
  banner: '',
  rules: "Be respectful to other members\nStay on topic in each channel\nNo spam or self-promotion",
  members: [
    { id: 1, name: 'Sanidhya Joshi', handle: '@sanidhya', role: 'Owner', initials: 'SJ' },
    { id: 2, name: 'Awadhesh', handle: '@awadhesh', role: 'Moderator', initials: 'AW' },
    { id: 3, name: 'Karmanya', handle: '@karmanya', role: 'Member', initials: 'KM' },
  ],
  channels: [
    { id: 1, name: 'announcements', type: 'Announcement' },
    { id: 2, name: 'general', type: 'Text' },
    { id: 3, name: 'voice-lounge', type: 'Voice' },
  ],
  memberCount: 124,
  onlineCount: 42,
};

export const SETTINGS_TABS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'members', label: 'Members' },
  { id: 'channels', label: 'Channels' },
  { id: 'rules', label: '📜 Rules' },
  { id: 'insights', label: '💎 Insights' },
];
