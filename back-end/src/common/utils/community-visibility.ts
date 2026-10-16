import { AppRole } from '../../modules/rbac/role.enum';
import { CommunityRecord, UserRecord } from './in-memory-db';

/**
 * Determines whether a community is visible to a given viewer.
 *
 * Rules:
 * - Active communities are visible to everyone (including anonymous viewers).
 * - Suspended communities are hidden (returns false), unless the viewer is
 *   either a platform administrator or the owner of that specific community.
 */
export function communityVisibleTo(
  community: CommunityRecord,
  viewer?: Pick<UserRecord, 'id' | 'role'> | null,
): boolean {
  if (community.status !== 'suspended') {
    return true;
  }
  if (!viewer) {
    return false;
  }
  if (viewer.role === AppRole.ADMIN) {
    return true;
  }
  if (community.ownerId === viewer.id) {
    return true;
  }
  return false;
}
