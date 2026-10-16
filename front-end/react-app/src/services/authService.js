/**
 * Authentication Service Module
 * Handles login, registration, session persistence, and logout.
 */
import { apiRequest, getStoredUser } from './api';

export const authService = {
  /**
   * Log in with username/email and password.
   */
  async login({ login, password, role }) {
    const payload = {
      login: login.trim(),
      password,
      role: role || undefined,
    };
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Register a new user account.
   */
  async register({ username, email, password, role, firstName, lastName }) {
    const payload = {
      username: username.trim(),
      email: email.trim(),
      password,
      role: role || 'user',
      firstName: firstName?.trim() || undefined,
      lastName: lastName?.trim() || undefined,
    };
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Authenticate with verified Google credential or access token.
   */
  async loginWithGoogle({ credential, accessToken }) {
    const payload = {};
    if (credential) payload.credential = credential;
    if (accessToken) payload.accessToken = accessToken;

    const user = await apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    this.saveSession(user);
    return user;
  },

  /**
   * Persists authenticated user in localStorage.
   */
  saveSession(user) {
    if (!user) return;
    localStorage.setItem('nexus_user', JSON.stringify(user));
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('role', user.role || 'user');
  },

  /**
   * Clears authenticated session from localStorage.
   */
  clearSession() {
    localStorage.removeItem('nexus_user');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('role');
  },

  /**
   * Retrieves active user or fallback.
   */
  getCurrentUser() {
    return getStoredUser();
  },

  /**
   * Check if user is logged in.
   */
  isAuthenticated() {
    const user = getStoredUser();
    return Boolean(user && user.username);
  },
};
