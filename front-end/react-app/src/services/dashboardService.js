/**
 * Dashboard Service Module
 * Handles loading communities, events, notifications, and overview statistics.
 */
import { apiRequest } from './api';

export const dashboardService = {
  async getCommunities() {
    return await apiRequest('/communities');
  },

  async getEvents() {
    return await apiRequest('/events');
  },

  async getNotifications(userId) {
    if (!userId) return [];
    return await apiRequest(`/notifications?userId=${encodeURIComponent(userId)}`);
  },

  async getStats() {
    return await apiRequest('/dashboard/stats');
  },
};
