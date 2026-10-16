export const PAGES = [
  { id: 'overview', icon: '⚡', title: 'System Overview' },
  { id: 'users', icon: '👥', title: 'User Management' },
  { id: 'communities', icon: '🏘️', title: 'Communities' },
  { id: 'moderation', icon: '🛡️', title: 'Moderation' },
  { id: 'events-mgmt', icon: '📅', title: 'Events' },
  { id: 'appeals', icon: '⚖️', title: 'Appeals' },
  { id: 'applications', icon: '📋', title: 'Applications' },
  { id: 'audit', icon: '📜', title: 'Audit Log' },
  { id: 'config', icon: '⚙️', title: 'Configuration' },
];

export const DEFAULT_STATS = {
  users: 0,
  comms: 0,
  reports: 0,
  events: 0,
  appeals: 0,
  messages: 0,
};

export const DEFAULT_USERS = [];
export const DEFAULT_AUDIT_LOG = [];
export const DEFAULT_COMMUNITIES = [];
export const DEFAULT_ORGANIZER_APPS = [];
export const DEFAULT_MODERATOR_APPS = [];

export const DEFAULT_CONFIG = {
  autoModEnabled: true,
  allowPublicRegistration: true,
  maxCommunitiesPerUser: 10,
  maxChannelsPerCommunity: 50,
  autoDeleteToxic: true,
  shadowbanBadActors: false,
  sessionTimeoutMins: 60,
};

export const DEFAULT_POLICIES = [
  'No harassment, toxicity, or targeted discrimination',
  'No unauthorized spam or promotional links',
  'Content must be safe and appropriate for all community members',
  'Impersonating platform moderators or staff is strictly forbidden',
];

export function getStatCards(stats) {
  return [
    { id: 'stat-users', label: 'Total Users', val: stats.users || 0, icon: '👥', bg: 'bg-purple', page: 'users' },
    { id: 'stat-comms', label: 'Communities', val: stats.comms || 0, icon: '🏘️', bg: 'bg-cyan', page: 'communities' },
    { id: 'stat-reports', label: 'Open Reports', val: stats.reports || 0, icon: '🛡️', bg: 'bg-orange', page: 'moderation' },
    { id: 'stat-events', label: 'Active Events', val: stats.events || 0, icon: '📅', bg: 'bg-green', page: 'events-mgmt' },
    { id: 'stat-appeals', label: 'Open Appeals', val: stats.appeals || 0, icon: '⚖️', bg: 'bg-purple', page: 'appeals' },
    { id: 'stat-msgs', label: 'Messages', val: (stats.messages || 0).toLocaleString(), icon: '💬', bg: 'bg-cyan', page: 'overview' },
  ];
}
