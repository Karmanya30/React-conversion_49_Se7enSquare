/**
 * Default fallback data and settings tab definitions for CommunitySettings.
 */
export const DEFAULT_COMMUNITY = {
  name: 'Pro Gamers',
  description: 'Competitive esports community and tournaments.',
  banner: '',
  rules: "Be respectful to other members\nStay on topic in each channel\nNo spam or self-promotion",
  members: [],
  channels: [
    { id: 1, name: 'announcements', type: 'Announcement' },
    { id: 2, name: 'general', type: 'Text' },
    { id: 3, name: 'voice-lounge', type: 'Voice' },
  ],
  memberCount: 0,
  onlineCount: 0,
};

export const SETTINGS_TABS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'members', label: 'Members' },
  { id: 'channels', label: 'Channels' },
  { id: 'rules', label: '📜 Rules' },
  { id: 'insights', label: '💎 Insights' },
];
