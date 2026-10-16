// Central constants, storage keys, categories, and user helpers for Event Management.
export const API_BASE = 'http://localhost:3000/api';

export const STORAGE_KEYS = {
  EVENTS: 'events',
  DRAFT: 'nexus_event_draft',
  USER: 'nexus_user',
  CURRENT_USER: 'currentUser',
  TOKEN: 'token',
};

export const CATEGORIES = [
  'Tournament',
  'Casual Play',
  'Competitive',
  'Workshop',
  'Community Night',
];

export const EVENT_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
};

export const DEFAULT_COMMUNITIES = [
  { id: 1, name: 'Valorant India', icon: '🎯', slug: 'valorant-india' },
  { id: 2, name: 'BGMI Champions', icon: '🏆', slug: 'bgmi-champions' },
  { id: 3, name: 'CS2 Elite Club', icon: '⚡', slug: 'cs2-elite' },
  { id: 4, name: 'Apex Legends Hub', icon: '🔥', slug: 'apex-hub' },
  { id: 5, name: 'Chess Masters', icon: '♟️', slug: 'chess-masters' },
];

export function getCurrentUser() {
  try {
    const raw =
      localStorage.getItem('nexus_user') ||
      localStorage.getItem('currentUser');
    if (raw) {
      const u = JSON.parse(raw);
      if (u && (u.id || u.username || u.name)) {
        return {
          id: u.id,
          name: u.name || u.firstName || u.username || 'User',
          username: u.username || u.name || 'User',
          role: u.role || 'user',
          email: u.email || '',
        };
      }
    }
    const t = localStorage.getItem('token');
    if (t) {
      const p = JSON.parse(atob(t.split('.')[1]));
      return {
        id: p.sub || p.id,
        name: p.name || p.username || 'User',
        username: p.username || p.name || 'User',
        role: p.role || 'user',
        email: p.email || '',
      };
    }
  } catch {
    // ignore parse error and return null
  }
  return null;
}

export function getRole() {
  const user = getCurrentUser();
  return user?.role || 'user';
}
