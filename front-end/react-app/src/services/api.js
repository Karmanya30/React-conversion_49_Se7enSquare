/**
 * Se7enSquare - Central API Client Module
 * Provides unified request configuration, headers, identity injection, and account status handling.
 */

export const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Retrieves the currently stored user session safely without sensitive fields.
 */
export function getStoredUser() {
  try {
    const raw = localStorage.getItem('nexus_user') || localStorage.getItem('currentUser');
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (user) {
      delete user.password;
      delete user.passwordHash;
    }
    return user;
  } catch {
    return null;
  }
}

/**
 * Clears authenticated session from localStorage.
 */
export function clearUserSession() {
  localStorage.removeItem('user');
  localStorage.removeItem('nexus_user');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('role');
}

/**
 * Persists an authenticated user session into localStorage with whitelisted fields only.
 */
export function storeUserSession(user) {
  if (!user) {
    clearUserSession();
    return;
  }

  const safeSession = {
    id: user.id,
    username: user.username,
    role: user.role || 'user',
    name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    avatar: user.avatar || null,
    status: user.status || 'active',
  };

  localStorage.removeItem('user');
  localStorage.setItem('nexus_user', JSON.stringify(safeSession));
  localStorage.setItem('currentUser', JSON.stringify(safeSession));
  localStorage.setItem('role', safeSession.role);
  window.dispatchEvent(new Event('session-updated'));
}

/**
 * Standardized HTTP request handler with automatic JSON serialization and role/identity headers.
 */
export async function apiRequest(endpoint, options = {}) {
  const user = getStoredUser();
  const role = user?.role || localStorage.getItem('role') || 'user';

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    'x-role': role,
    ...(user?.id ? { 'x-user-id': String(user.id) } : {}),
    ...(options.headers || {}),
  };

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (netErr) {
    if (netErr instanceof TypeError && (netErr.message.includes('fetch') || netErr.message.includes('Network'))) {
      const connErr = new Error(
        'Unable to connect to Se7enSquare server. Please ensure the backend is running.'
      );
      connErr.status = 0;
      connErr.isNetworkError = true;
      throw connErr;
    }
    throw netErr;
  }

  const contentType = response.headers.get('content-type') || '';
  const data = (contentType && contentType.includes('application/json'))
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const rawMessage = (data && typeof data === 'object' && data.message)
      ? data.message
      : `Request failed with status ${response.status}`;
    const message = Array.isArray(rawMessage) ? rawMessage.join(', ') : rawMessage;

    const error = new Error(message);
    error.status = response.status;
    error.code = data?.code || null;
    error.reason = data?.reason || null;
    error.until = data?.until || null;
    error.data = data;

    // Handle suspended and banned accounts
    if (data?.code === 'ACCOUNT_BANNED' || data?.code === 'ACCOUNT_SUSPENDED') {
      const isAppeal = typeof window !== 'undefined' && window.location.pathname.startsWith('/appeal');
      if (data.code === 'ACCOUNT_BANNED' || !isAppeal) {
        clearUserSession();
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams();
          params.set('accountStatus', data.code);
          if (data.reason) params.set('reason', data.reason);
          if (data.until) params.set('until', data.until);
          window.location.href = `/login?${params.toString()}`;
        }
      }
    }

    throw error;
  }

  return data;
}
