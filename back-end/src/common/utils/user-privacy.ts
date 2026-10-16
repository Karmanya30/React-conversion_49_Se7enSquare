import { db, UserRecord } from './in-memory-db';
import { sanitizeUser } from './sanitize-user';

export const DEFAULT_PRIVACY = {
  profileVisibility: 'public' as 'public' | 'members' | 'private',
  whoCanMessage: 'nobody' as 'everyone' | 'members' | 'nobody',
  showEmail: false, showPhone: false, showActivity: true, appearInSearch: true,
};

export function privacyOf(user: UserRecord): typeof DEFAULT_PRIVACY {
  const merged = { ...DEFAULT_PRIVACY, ...user.privacy };
  return Object.fromEntries(Object.keys(DEFAULT_PRIVACY).map(key => [key, merged[key]])) as typeof DEFAULT_PRIVACY;
}

export function sharesCommunity(a: number, b: number) {
  const communities = new Set(db.memberships.filter(m => m.userId === a).map(m => m.communityId));
  return db.memberships.some(m => m.userId === b && communities.has(m.communityId));
}

export function canInspectUser(user: UserRecord, viewer?: UserRecord, reportId?: number) {
  if (viewer?.id === user.id || viewer?.role === 'admin') return true;
  // Moderator disclosure is limited to the subject/reporter of an actual report.
  return viewer?.role === 'moderator' && db.reports.some(r => r.id === reportId &&
    (r.reporterId === user.id || (r.targetType === 'user' && r.targetId === user.id)));
}

export function userForViewer(user: UserRecord, viewer?: UserRecord, reportId?: number) {
  const privacy = privacyOf(user);
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username;
  if (canInspectUser(user, viewer, reportId)) return { ...sanitizeUser(user), fullName, privacy, hasPassword: Boolean(user.passwordHash) };
  const identity = { id: user.id, username: user.username, role: user.role };
  const visible = privacy.profileVisibility === 'public' ||
    (privacy.profileVisibility === 'members' && viewer && sharesCommunity(user.id, viewer.id));
  if (!visible) return { ...identity, profileRestricted: true };
  return {
    ...identity, firstName: user.firstName, lastName: user.lastName,
    fullName,
    avatar: user.avatar, bio: user.bio,
    ...(privacy.showEmail ? { email: user.email } : {}),
    ...(privacy.showPhone ? { phone: user.phone } : {}),
    ...(privacy.showActivity ? { activity: db.posts.filter(p => p.authorId === user.id && (db.communities.find(c => c.id === p.communityId)?.visibility !== 'private' || (viewer && db.memberships.some(m => m.userId === viewer.id && m.communityId === p.communityId)))).map(p => ({ id: p.id, title: p.title, createdAt: p.createdAt })) } : {}),
  };
}
