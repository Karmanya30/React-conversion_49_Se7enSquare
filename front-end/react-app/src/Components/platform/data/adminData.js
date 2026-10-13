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

export const DEFAULT_USERS = [
  { id: 1, name: 'Rajat Jain', username: 'rajat', email: 'rajat@gameunity.com', role: 'admin', status: 'active' },
  { id: 2, name: 'Karmanya', username: 'karmanya', email: 'karmanya@gameunity.com', role: 'moderator', status: 'active' },
  { id: 3, name: 'Awadhesh', username: 'awadhesh', email: 'awadhesh@gameunity.com', role: 'user', status: 'active' },
  { id: 4, name: 'Anant', username: 'anant', email: 'anant@gameunity.com', role: 'community_manager', status: 'active' },
  { id: 5, name: 'Sanidhya', username: 'sanidhya', email: 'sanidhya@gameunity.com', role: 'owner', status: 'active' },
];

export const DEFAULT_AUDIT_LOG = [
  { id: 1, time: '10:32 AM', admin: 'rajat', action: 'Updated user role: karmanya → moderator', type: 'role' },
  { id: 2, time: '10:15 AM', admin: 'rajat', action: 'Approved event: Gaming Hackathon', type: 'event' },
  { id: 3, time: '09:47 AM', admin: 'rajat', action: 'Suspended user: spambot99', type: 'moderation' },
  { id: 4, time: '09:30 AM', admin: 'rajat', action: 'Deleted community: Test Community', type: 'community' },
  { id: 5, time: '09:10 AM', admin: 'rajat', action: 'Approved appeal: APL-001', type: 'appeal' },
];

export const DEFAULT_COMMUNITIES = [
  { id: 1, name: 'Pro Gamers', owner: 'sanidhya', members: 124, status: 'active', desc: 'Competitive esports community and tournaments.' },
  { id: 2, name: 'Game Designers', owner: 'anant', members: 88, status: 'active', desc: 'Game mechanics, art and level design.' },
  { id: 3, name: 'Speedrunners Guild', owner: 'awadhesh', members: 62, status: 'active', desc: 'Any% and 100% routes, tips, verified runs.' },
];

export const DEFAULT_ORGANIZER_APPS = [
  { id: 101, user: 'priya_v', experience: 'Organized 5+ college gaming tournaments & esports leagues', applied: '2 days ago', status: 'pending' },
  { id: 102, user: 'rohit_g', experience: 'Community manager for 8,000+ member developer Discord', applied: '4 days ago', status: 'pending' },
];

export const DEFAULT_MODERATOR_APPS = [
  { id: 201, user: 'sneha_k', quizScore: '92%', applied: '1 day ago', status: 'pending' },
  { id: 202, user: 'vikram_m', quizScore: '85%', applied: '3 days ago', status: 'pending' },
];

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
    { id: 'stat-users', label: 'Total Users', val: stats.users, icon: '👥', bg: 'bg-purple', page: 'users', trend: '+12.4%' },
    { id: 'stat-comms', label: 'Communities', val: stats.comms, icon: '🏘️', bg: 'bg-cyan', page: 'communities', trend: '+8.2%' },
    { id: 'stat-reports', label: 'Open Reports', val: stats.reports, icon: '🛡️', bg: 'bg-orange', page: 'moderation', trend: '-3.1%' },
    { id: 'stat-events', label: 'Active Events', val: stats.events, icon: '📅', bg: 'bg-green', page: 'events-mgmt', trend: '+15.7%' },
    { id: 'stat-appeals', label: 'Open Appeals', val: stats.appeals, icon: '⚖️', bg: 'bg-purple', page: 'appeals', trend: '+2.1%' },
    { id: 'stat-msgs', label: 'Messages', val: stats.messages.toLocaleString(), icon: '💬', bg: 'bg-cyan', page: 'overview', trend: '+22.3%' },
  ];
}
