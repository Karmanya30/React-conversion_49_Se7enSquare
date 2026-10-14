/**
 * Safe local storage reader for current session user.
 */
export function getPlatformUser() {
  try {
    const raw = JSON.parse(
      localStorage.getItem('currentUser') || localStorage.getItem('nexus_user') || '{}'
    );
    return {
      id: raw.id || 1,
      firstName: raw.firstName || raw.username || 'Gamer',
      username: raw.username || 'gamer',
      role: raw.role || 'user',
    };
  } catch {
    return { id: 1, firstName: 'Gamer', username: 'gamer', role: 'user' };
  }
}
