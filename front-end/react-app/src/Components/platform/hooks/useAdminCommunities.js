import { useState } from 'react';
import { apiRequest } from '../../../services/api';

/**
 * Manages community list fetch and admin suspend/reinstate actions.
 * POST /admin/communities/:id/suspend|reinstate from AdminCommunitiesController.
 */
export default function useAdminCommunities(showToast) {
  const [communities, setCommunities] = useState([]);

  const refreshCommunities = async () => {
    try {
      const data = await apiRequest('/communities');
      setCommunities(Array.isArray(data) ? data : []);
    } catch { /* leave current list */ }
  };

  const suspendCommunity = async (communityId, reason) => {
    const community = communities.find((c) => c.id === communityId);
    const r = reason || window.prompt(`Reason for suspending "${community?.name || `community #${communityId}`}":`);
    if (!r?.trim()) return;
    try {
      await apiRequest(`/admin/communities/${communityId}/suspend`, {
        method: 'POST',
        body: JSON.stringify({ reason: r.trim() }),
      });
      showToast(`⚠️ Community suspended`);
      await refreshCommunities();
    } catch (err) {
      showToast(`❌ ${err.message}`);
    }
  };

  const reinstateCommunity = async (communityId) => {
    const community = communities.find((c) => c.id === communityId);
    if (!window.confirm(`Reinstate "${community?.name || `community #${communityId}`}"?`)) return;
    try {
      await apiRequest(`/admin/communities/${communityId}/reinstate`, {
        method: 'POST',
        body: JSON.stringify({ reason: 'Reinstated by admin' }),
      });
      showToast('✅ Community reinstated');
      await refreshCommunities();
    } catch (err) {
      showToast(`❌ ${err.message}`);
    }
  };

  return {
    communities,
    setCommunities,
    refreshCommunities,
    suspendCommunity,
    reinstateCommunity,
  };
}
