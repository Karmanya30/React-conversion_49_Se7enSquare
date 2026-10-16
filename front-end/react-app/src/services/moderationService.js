/**
 * Moderation Service Module
 * Handles loading reports, updating report status, and report management.
 */
import { apiRequest } from './api';

export const moderationService = {
  async getReports() {
    return await apiRequest('/reports');
  },

  async createReport(payload) {
    return await apiRequest('/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateReportStatus(reportId, status) {
    return await apiRequest(`/reports/${reportId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async deleteReport(reportId) {
    return await apiRequest(`/reports/${reportId}`, {
      method: 'DELETE',
    });
  },
};
