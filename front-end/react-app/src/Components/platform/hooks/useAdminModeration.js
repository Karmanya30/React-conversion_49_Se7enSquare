import { useState, useEffect } from 'react';
import { appealService } from '../../../services/appealService';

const API_BASE = 'http://localhost:3000/api';

/**
 * Custom hook managing communities, reports queue, appeals, events, and applications.
 */
export default function useAdminModeration(adminUser, showToast, addAuditLog) {
  const [communities, setCommunities] = useState([]);
  const [reports, setReports] = useState([]);
  const [events, setEvents] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [organizerApps, setOrganizerApps] = useState([]);
  const [moderatorApps, setModeratorApps] = useState([]);

  // Load applications from backend
  useEffect(() => {
    async function loadApps() {
      try {
        const [orgRes, modRes, usersRes] = await Promise.all([
          fetch(`${API_BASE}/organisers`, { headers: { 'x-role': adminUser.role } }),
          fetch(`${API_BASE}/moderator-certification`, { headers: { 'x-role': adminUser.role } }),
          fetch(`${API_BASE}/users`, { headers: { 'x-role': adminUser.role } }),
        ]);

        const users = usersRes.ok ? await usersRes.json() : [];
        const userMap = new Map((Array.isArray(users) ? users : []).map((u) => [u.id, u]));

        if (orgRes.ok) {
          const orgData = await orgRes.json();
          if (Array.isArray(orgData)) {
            setOrganizerApps(
              orgData.map((o) => ({
                id: o.id,
                user: userMap.get(o.userId)?.username || `User #${o.userId}`,
                experience: o.experienceNote || 'Experience note on file',
                applied: o.appliedAt ? new Date(o.appliedAt).toLocaleDateString() : 'Recently',
                status: o.status || 'pending',
              }))
            );
          }
        }

        if (modRes.ok) {
          const modData = await modRes.json();
          if (Array.isArray(modData)) {
            setModeratorApps(
              modData.map((m) => ({
                id: m.id,
                user: userMap.get(m.userId)?.username || `User #${m.userId}`,
                quizScore: `${m.quizScore ?? 0}%`,
                applied: m.appliedAt ? new Date(m.appliedAt).toLocaleDateString() : 'Recently',
                status: m.status || 'pending',
              }))
            );
          }
        }
      } catch {}
    }
    loadApps();
  }, [adminUser.role]);

  const handleModerationAction = async (item, actionType) => {
    if (actionType === 'dismiss') {
      setReports((prev) => prev.filter((r) => r.id !== item.id));
      addAuditLog(`Dismissed report #${item.id}`, 'moderation');
      showToast('Report dismissed');
      try {
        await fetch(`${API_BASE}/reports/${item.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'x-role': adminUser.role },
          body: JSON.stringify({ status: 'resolved' }),
        });
      } catch {}
    } else if (actionType === 'delete') {
      setReports((prev) => prev.filter((r) => r.id !== item.id));
      addAuditLog(`Deleted reported content #${item.id}`, 'moderation');
      showToast('Content removed');
      try {
        await fetch(`${API_BASE}/reports/${item.id}`, {
          method: 'DELETE',
          headers: { 'x-role': adminUser.role },
        });
      } catch {}
    } else if (actionType === 'suspend_author') {
      setReports((prev) => prev.filter((r) => r.id !== item.id));
      addAuditLog(`Suspended author from report #${item.id}`, 'moderation');
      showToast('Author suspended');
      try {
        const targetUserId = item.reportedUser?.id || item.targetId;
        if (targetUserId) {
          await fetch(`${API_BASE}/users/${targetUserId}/suspend`, {
            method: 'POST',
            headers: { 'x-role': adminUser.role },
          });
        }
      } catch {}
    }
  };

  const handleAppeal = async (appealId, status) => {
    setAppeals((prev) => prev.filter((a) => a.id !== appealId));
    addAuditLog(`${status === 'approved' ? 'Approved' : 'Rejected'} appeal #${appealId}`, 'appeal');
    showToast(`✓ Appeal ${status}`);
    try {
      await appealService.reviewAppeal(appealId, status);
    } catch {}
  };

  const handleOrganizerApp = async (id, newStatus) => {
    const verifiedStatus = newStatus === 'approved' ? 'verified' : 'rejected';
    setOrganizerApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: verifiedStatus } : a)));
    addAuditLog(
      `${newStatus === 'approved' ? 'Approved' : 'Rejected'} organizer application #${id}`,
      'application'
    );
    showToast(newStatus === 'approved' ? '✅ Organizer approved' : '❌ Application rejected');
    try {
      await fetch(`${API_BASE}/organisers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-role': adminUser.role },
        body: JSON.stringify({ status: verifiedStatus }),
      });
    } catch {}
  };

  const handleModeratorApp = async (id, newStatus) => {
    const certifiedStatus = newStatus === 'approved' ? 'certified' : 'rejected';
    setModeratorApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: certifiedStatus } : a)));
    addAuditLog(
      `${newStatus === 'approved' ? 'Approved' : 'Rejected'} moderator application #${id}`,
      'application'
    );
    showToast(newStatus === 'approved' ? '✅ Moderator certified' : '❌ Application rejected');
    try {
      await fetch(`${API_BASE}/moderator-certification/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-role': adminUser.role },
        body: JSON.stringify({ status: certifiedStatus }),
      });
    } catch {}
  };

  return {
    communities,
    setCommunities,
    reports,
    setReports,
    events,
    setEvents,
    appeals,
    setAppeals,
    organizerApps,
    setOrganizerApps,
    moderatorApps,
    setModeratorApps,
    handleModerationAction,
    handleAppeal,
    handleOrganizerApp,
    handleModeratorApp,
  };
}
