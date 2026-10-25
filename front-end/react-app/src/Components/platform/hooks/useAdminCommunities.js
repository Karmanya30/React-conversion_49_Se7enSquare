import { useState, useCallback, useEffect, useRef } from 'react';
import { apiRequest } from '../../../services/api';

/**
 * Manages community list fetch and admin suspend/reinstate actions.
 * POST /admin/communities/:id/suspend|reinstate from AdminCommunitiesController.
 */
export default function useAdminCommunities(showToast) {
  const [communities, setCommunities] = useState([]);
  const showToastRef = useRef(showToast);
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  const refreshCommunities = useCallback(async () => {
    try {
      const data = await apiRequest('/communities');
      setCommunities(Array.isArray(data) ? data : []);
    } catch { /* leave current list */ }
  }, []);

  // Initial load once on mount
  useEffect(() => {
    refreshCommunities();
  }, [refreshCommunities]);

  const suspendCommunity = useCallback(async (communityId, reason) => {
    const community = communities.find((c) => c.id === communityId);
    const r = reason || window.prompt(`Reason for suspending "${community?.name || `community #${communityId}`}":`);
    if (!r?.trim()) return;
    try {
      await apiRequest(`/admin/communities/${communityId}/suspend`, {
        method: 'POST',
        body: JSON.stringify({ reason: r.trim() }),
      });
      showToastRef.current?.(`⚠️ Community suspended`);
      await refreshCommunities();
    } catch (err) {
      showToastRef.current?.(`❌ ${err.message}`);
    }
  }, [communities, refreshCommunities]);

  const reinstateCommunity = useCallback(async (communityId) => {
    const community = communities.find((c) => c.id === communityId);
    if (!window.confirm(`Reinstate "${community?.name || `community #${communityId}`}"?`)) return;
    try {
      await apiRequest(`/admin/communities/${communityId}/reinstate`, {
        method: 'POST',
        body: JSON.stringify({ reason: 'Reinstated by admin' }),
      });
      showToastRef.current?.('✓ Community reinstated');
      await refreshCommunities();
    } catch (err) {
      showToastRef.current?.(`❌ ${err.message}`);
    }
  }, [communities, refreshCommunities]);

  return {
    communities,
    setCommunities,
    refreshCommunities,
    suspendCommunity,
    reinstateCommunity,
  };
}
