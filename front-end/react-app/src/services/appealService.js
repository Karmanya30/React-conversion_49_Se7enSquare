/**
 * Appeal Service Module
 * Handles loading, creating, reviewing, and submitting evidence for appeals.
 */
import { apiRequest } from './api';

export const appealService = {
  async getAppeals(userId) {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return await apiRequest(`/appeals${qs}`);
  },

  async createAppeal(payload) {
    return await apiRequest('/appeals', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async reviewAppeal(appealId, status) {
    return await apiRequest(`/appeals/${appealId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async addEvidence(appealId, evidencePayload) {
    return await apiRequest(`/appeals/${appealId}/evidence`, {
      method: 'POST',
      body: JSON.stringify(evidencePayload),
    });
  },
};
