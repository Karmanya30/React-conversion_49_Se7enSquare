import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../../../services/api';
import { appealService } from '../../../services/appealService';

/**
 * Custom hook managing reports queue, appeals, events, and organizer/moderator applications.
 * All mutations call the backend first, await confirmation, show server error on failure,
 * and refetch the updated lists. No optimistic updates.
 */
export default function useAdminModeration(showToast, onUserUpdated) {
  const [reports, setReports] = useState([]);
  const [events, setEvents] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [organizerApps, setOrganizerApps] = useState([]);
  const [moderatorApps, setModeratorApps] = useState([]);

  const refreshReports = useCallback(async () => {
    try {
      const data = await apiRequest('/reports');
      setReports(Array.isArray(data) ? data : []);
    } catch { /* keep current */ }
  }, []);

  const refreshAppeals = useCallback(async () => {
    try {
      const data = await apiRequest('/appeals');
      setAppeals(Array.isArray(data) ? data : []);
    } catch { /* keep current */ }
  }, []);

  const refreshEvents = useCallback(async () => {
    try {
      const data = await apiRequest('/events');
      setEvents(Array.isArray(data) ? data : []);
    } catch { /* keep current */ }
  }, []);

  const refreshApps = useCallback(async () => {
    try {
      const [orgRes, modRes, usersRes] = await Promise.all([
        apiRequest('/organisers'),
        apiRequest('/moderator-certification'),
        apiRequest('/users'),
      ]);

      const users = Array.isArray(usersRes) ? usersRes : [];
      const userMap = new Map(users.map((u) => [u.id, u]));

      if (Array.isArray(orgRes)) {
        setOrganizerApps(
          orgRes.map((o) => ({
            id: o.id,
            user: userMap.get(o.userId)?.username || `User #${o.userId}`,
            experience: o.experienceNote || 'Experience note on file',
            applied: o.appliedAt ? new Date(o.appliedAt).toLocaleDateString() : 'Recently',
            status: o.status || 'pending',
          }))
        );
      }

      if (Array.isArray(modRes)) {
        setModeratorApps(
          modRes.map((m) => ({
            id: m.id,
            user: userMap.get(m.userId)?.username || `User #${m.userId}`,
            quizScore: `${m.quizScore ?? 0}%`,
            applied: m.appliedAt ? new Date(m.appliedAt).toLocaleDateString() : 'Recently',
            status: m.status || 'pending',
          }))
        );
      }
    } catch { /* keep current */ }
  }, []);

  useEffect(() => {
    refreshReports();
    refreshAppeals();
    refreshEvents();
    refreshApps();
  }, [refreshReports, refreshAppeals, refreshEvents, refreshApps]);

  const handleModerationAction = async (item, actionType, note) => {
    const resolutionNote = (note || '').trim();

    try {
      if (actionType === 'dismiss') {
        if (!resolutionNote) {
          showToast('⚠️ Resolution note is required to dismiss a report');
          return;
        }
        await apiRequest(`/reports/${item.id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'resolved', resolutionNote }),
        });
        showToast('✓ Report dismissed');
      } else if (actionType === 'warn') {
        const reason = resolutionNote || 'Official warning following escalated report';
        await apiRequest('/sanctions', {
          method: 'POST',
          body: JSON.stringify({
            targetUserId: item.targetId,
            communityId: item.communityId || null,
            type: 'warn',
            reason,
            reportId: item.id,
          }),
        });
        await apiRequest(`/reports/${item.id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'resolved', resolutionNote: reason }),
        });
        showToast('⚠️ Warning issued and report resolved');
      } else if (actionType === 'remove_content') {
        const reason = resolutionNote || 'Content removed following escalated report';
        await apiRequest('/sanctions', {
          method: 'POST',
          body: JSON.stringify({
            targetUserId: item.targetId,
            communityId: item.communityId || null,
            type: 'content_removed',
            reason,
            reportId: item.id,
          }),
        });
        await apiRequest(`/reports/${item.id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'resolved', resolutionNote: reason }),
        });
        showToast('🗑️ Content marked removed and author sanctioned');
      } else if (actionType === 'suspend_author') {
        const reason = resolutionNote || 'Author suspended following escalated report';
        await apiRequest(`/users/${item.targetId}/suspend`, {
          method: 'POST',
          body: JSON.stringify({ reason }),
        });
        await apiRequest(`/reports/${item.id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'resolved', resolutionNote: reason }),
        });
        showToast('⚠️ Author suspended and report resolved');
        if (onUserUpdated) onUserUpdated();
      } else if (actionType === 'ban_author') {
        const reason = resolutionNote || 'Author permanently banned following escalated report';
        await apiRequest(`/users/${item.targetId}/ban`, {
          method: 'POST',
          body: JSON.stringify({ reason }),
        });
        await apiRequest(`/reports/${item.id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'resolved', resolutionNote: reason }),
        });
        showToast('⛔ Author permanently banned');
        if (onUserUpdated) onUserUpdated();
      }

      await refreshReports();
    } catch (err) {
      showToast(`❌ ${err.message}`);
    }
  };

  const handleAppeal = async (appealId, status) => {
    try {
      await appealService.reviewAppeal(appealId, status);
      showToast(`✓ Appeal ${status}`);
      await refreshAppeals();
    } catch (err) {
      showToast(`❌ ${err.message}`);
    }
  };

  const handleOrganizerApp = async (id, newStatus) => {
    const status = newStatus === 'approved' ? 'verified' : 'rejected';
    const rejectionReason = status === 'rejected' ? window.prompt('Reason for rejecting this application (5–500 characters):') : undefined;
    if (status === 'rejected' && !rejectionReason) return;
    try {
      await apiRequest(`/organisers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, rejectionReason }),
      });
      showToast(`Application ${status}`);
      await refreshApps();
    } catch (err) {
      showToast(`❌ ${err.message}`);
    }
  };

  const handleModeratorApp = async (id, newStatus) => {
    const status = newStatus === 'approved' ? 'certified' : 'rejected';
    const rejectionReason = status === 'rejected' ? window.prompt('Reason for rejecting this application (5–500 characters):') : undefined;
    if (status === 'rejected' && !rejectionReason) return;
    try {
      await apiRequest(`/moderator-certification/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, rejectionReason }),
      });
      showToast(`Application ${status}`);
      await refreshApps();
    } catch (err) {
      showToast(`❌ ${err.message}`);
    }
  };

  return {
    reports,
    setReports,
    refreshReports,
    events,
    setEvents,
    refreshEvents,
    appeals,
    setAppeals,
    refreshAppeals,
    organizerApps,
    setOrganizerApps,
    moderatorApps,
    setModeratorApps,
    refreshApps,
    handleModerationAction,
    handleAppeal,
    handleOrganizerApp,
    handleModeratorApp,
  };
}
