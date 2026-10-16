// Utility to look up community name by ID or slug with a fallback display.
export function getCommunityName(id, communities = []) {
  if (!id && id !== 0) return 'General';
  const c = communities.find(
    (item) => String(item.id) === String(id) || item.slug === id
  );
  return c ? c.name : `Community #${id}`;
}

export function getCommunityObject(id, communities = []) {
  const c = communities.find(
    (item) => String(item.id) === String(id) || item.slug === id
  );
  return c || { id, name: `Community #${id}`, icon: '🎮' };
}
