/**
 * Gameunity — Central API Client Module
 * Provides unified request configuration, headers, and authentication role injection.
 */

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Retrieves the currently stored user session.
 */
export function getStoredUser() {
  try {
    const raw = localStorage.getItem('nexus_user') || localStorage.getItem('currentUser');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Standardized HTTP request handler with automatic JSON serialization and role headers.
 */
export async function apiRequest(endpoint, options = {}) {
  const user = getStoredUser();
  const role = user?.role || localStorage.getItem('role') || 'user';

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    'x-role': role,
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  const data = (contentType && contentType.includes('application/json'))
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = (data && typeof data === 'object' && data.message)
      ? data.message
      : `Request failed with status ${response.status}`;
    const error = new Error(Array.isArray(message) ? message.join(', ') : message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
