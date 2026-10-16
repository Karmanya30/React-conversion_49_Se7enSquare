import { getStoredUser } from '../../../services/api';

/**
 * Safe local storage reader for current session user.
 */
export function getPlatformUser() {
  const user = getStoredUser();
  if (!user) return null;
  return {
    id: user.id,
    firstName: user.firstName || user.username || '',
    lastName: user.lastName || '',
    username: user.username || '',
    role: user.role || 'user',
  };
}

