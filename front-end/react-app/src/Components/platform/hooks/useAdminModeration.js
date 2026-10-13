import { useState } from 'react';
import {
  DEFAULT_COMMUNITIES,
  DEFAULT_ORGANIZER_APPS,
  DEFAULT_MODERATOR_APPS,
} from '../data/adminData';

const API_BASE = 'http://localhost:3000/api';

/**
 * Custom hook managing communities, reports queue, appeals, events, and applications.
 */
export default function useAdminModeration(adminUser, showToast, addAuditLog) {
  const [communities, setCommunities] = useState(DEFAULT_COMMUNITIES);
  const [reports, setReports] = useState([]);
  const [events, setEvents] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [organizerApps, setOrganizerApps] = useState(DEFAULT_ORGANIZER_APPS);
  const [moderatorApps, setModeratorApps] = useState(DEFAULT_MODERATOR_APPS);

  const handleModerationAction = async (item, actionType) => {
    if (actionType === 'dismiss') {
      setReports((prev) => prev.filter((r) => r.id !== item.id));
      addAuditLog(`Dismissed report #${item.id}`, 'moderation');
      showToast('Report dismissed');
    } else if (actionType === 'delete') {
      setReports((prev) => prev.filter((r) => r.id !== item.id));
      addAuditLog(`Deleted reported content #${item.id}`, 'moderation');
      showToast('Content removed');
    } else if (actionType === 'suspend_author') {
      setReports((prev) => prev.filter((r) => r.id !== item.id));
      addAuditLog(`Suspended author from report #${item.id}`, 'moderation');
      showToast('Author suspended');
    }
  };

  const handleAppeal = async (appealId, status) => {
    setAppeals((prev) => prev.filter((a) => a.id !== appealId));
    addAuditLog(`${status === 'approved' ? 'Approved' : 'Rejected'} appeal #${appealId}`, 'appeal');
    showToast(`✓ Appeal ${status}`);
    try {
      await fetch(`${API_BASE}/appeals/${appealId}/${status}`, {
        method: 'POST',
        headers: { 'x-role': adminUser.role },
      });
    } catch {}
  };

  const handleOrganizerApp = (id, newStatus) => {
    setOrganizerApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    addAuditLog(
      `${newStatus === 'approved' ? 'Approved' : 'Rejected'} organizer application #${id}`,
      'application'
    );
    showToast(newStatus === 'approved' ? '✅ Organizer approved' : '❌ Application rejected');
  };

  const handleModeratorApp = (id, newStatus) => {
    setModeratorApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    addAuditLog(
      `${newStatus === 'approved' ? 'Approved' : 'Rejected'} moderator application #${id}`,
      'application'
    );
    showToast(newStatus === 'approved' ? '✅ Moderator certified' : '❌ Application rejected');
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
