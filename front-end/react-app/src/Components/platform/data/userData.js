/** Static data constants for the User Management page. */

export const DEFAULT_USERS = [
  { id: 1, username: 'rajat',    email: 'rajat@gameunity.com',    role: 'admin' },
  { id: 2, username: 'karmanya', email: 'karmanya@gameunity.com', role: 'moderator' },
  { id: 3, username: 'awadhesh', email: 'awadhesh@gameunity.com', role: 'user' },
  { id: 4, username: 'anant',    email: 'anant@gameunity.com',    role: 'community_manager' },
  { id: 5, username: 'sanidhya', email: 'sanidhya@gameunity.com', role: 'owner' },
  { id: 6, username: 'sofia_p',  email: 'sofia@gameunity.com',    role: 'organizer' },
  { id: 7, username: 'maya_k',   email: 'maya@gameunity.com',     role: 'moderator' },
];

/** Maps role strings to their CSS badge class names. */
export const ROLE_BADGE_CLASS = {
  admin:             'badge-admin',
  moderator:         'badge-moderator',
  owner:             'badge-warned',
  organizer:         'badge-review',
};

export const ROLE_OPTIONS = [
  { value: 'all',               label: 'All Roles' },
  { value: 'admin',             label: 'Admin' },
  { value: 'moderator',         label: 'Moderator' },
  { value: 'community_manager', label: 'Community Manager' },
  { value: 'organizer',         label: 'Organizer' },
  { value: 'user',              label: 'User' },
  { value: 'owner',             label: 'Owner' },
];
