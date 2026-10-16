/**
 * Se7enSquare - Central Role-Based Access Control (RBAC) Module
 * Defines canonical role home routes and permission matrix across all platform views.
 */

/**
 * Returns the canonical home route for each RBAC role.
 *
 * Mapping:
 * - admin: /admin-dashboard
 * - owner (platform owner): /owner-dashboard
 * - moderator: /mod-panel
 * - organizer: /organizer-dashboard
 * - community_manager: /event-approval
 * - user / gamer: /dashboard
 */
export function getHomeRoute(role) {
  const normalized = typeof role === 'string' ? role.trim().toLowerCase() : 'user';
  switch (normalized) {
    case 'admin':
      return '/admin-dashboard';
    case 'owner':
      return '/owner-dashboard';
    case 'moderator':
      return '/mod-panel';
    case 'organizer':
    case 'organiser':
      return '/organizer-dashboard';
    case 'community_manager':
    case 'community manager':
    case 'cm':
    case 'manager':
      return '/event-approval';
    case 'user':
    case 'gamer':
    default:
      return '/dashboard';
  }
}

/**
 * Route-to-allowed-roles permission matrix.
 * Note: 'owner' (platform owner) has specialized system statistics dashboard;
 * other roles inherit base user community/event capabilities according to permissions.
 */
export const ROLE_ROUTE_PERMISSIONS = {
  // Public routes accessible without authentication
  '/': ['*'],
  '/landing': ['*'],
  '/login': ['*'],
  '/pricing': ['*'],

  // Core authenticated user views
  '/dashboard': ['user', 'moderator', 'community_manager', 'organizer', 'admin'],
  '/chat': ['user', 'moderator', 'community_manager', 'organizer', 'admin'],
  '/discovery': ['user', 'moderator', 'community_manager', 'organizer', 'admin'],
  '/create-community': ['user', 'moderator', 'community_manager', 'organizer', 'admin'],
  '/community-page': ['user', 'moderator', 'community_manager', 'organizer', 'admin'],
  '/community-settings': ['user', 'moderator', 'community_manager', 'organizer', 'admin'],
  '/events': ['user', 'moderator', 'community_manager', 'organizer', 'admin'],
  '/event-registrants': ['user', 'moderator', 'community_manager', 'organizer', 'admin'],
  '/report': ['user', 'moderator', 'community_manager', 'organizer', 'admin'],
  '/appeal': ['*'], // Accessible to all roles including restricted accounts
  '/profile-settings': ['user', 'moderator', 'community_manager', 'organizer', 'admin', 'owner'],
  '/user': ['user', 'moderator', 'community_manager', 'organizer', 'admin'],

  // Role-specific operational dashboards
  '/admin-dashboard': ['admin'],
  '/owner-dashboard': ['owner', 'admin'],
  '/organizer-dashboard': ['organizer', 'admin'],
  '/mod-panel': ['moderator', 'admin'],
  '/event-approval': ['community_manager', 'manager', 'admin'],
};

/**
 * Checks whether a given role is authorized to access a target path.
 */
export function hasRouteAccess(role, pathname) {
  if (!pathname) return false;
  const cleanPath = pathname.split('?')[0].replace(/\.html$/, '');

  // Exact match
  if (ROLE_ROUTE_PERMISSIONS[cleanPath]) {
    const allowed = ROLE_ROUTE_PERMISSIONS[cleanPath];
    if (allowed.includes('*')) return true;
    return allowed.includes(role);
  }

  // Prefix match (for parameterized routes like /community-page/:id)
  for (const [routePattern, allowedRoles] of Object.entries(ROLE_ROUTE_PERMISSIONS)) {
    if (cleanPath.startsWith(routePattern)) {
      if (allowedRoles.includes('*')) return true;
      return allowedRoles.includes(role);
    }
  }

  // Default fallback
  return role !== 'owner';
}
