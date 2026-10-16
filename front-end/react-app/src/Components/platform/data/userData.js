/** Static data constants for the User Management page. */

export const DEFAULT_USERS = [];

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
