import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUEUE_TABS, MOD_ACTIONS } from '../../../Components/platform/data/modPanelData';
import { moderationService } from '../../../services/moderationService';
import { authService } from '../../../services/authService';

function getUser() {
  const u = authService.getCurrentUser();
  return {
    role: u?.role || 'moderator',
    firstName: u?.firstName || u?.username || 'Moderator',
    username: u?.username || 'moderator',
  };
}

/**
 * Custom hook managing all state, data fetching, filtering, and moderation actions for ModPanel.
 */
export default function useModPanel() {
  const navigate = useNavigate();
  const user = getUser();

  const [reports, setReports] = useState([]);
  const [activeQTab, setActiveQTab] = useState('pending');
  const [selectedReport, setSelectedReport] = useState(null);
  const [queueSearch, setQueueSearch] = useState('');
  const [actionNote, setActionNote] = useState('');
  const [toast, setToast] = useState({ show: false, msg: '' });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  // Fetch reports from backend on mount
  useEffect(() => {
    async function fetchReports() {
      try {
        const data = await moderationService.getReports();
        if (Array.isArray(data)) {
          const mapped = data.map((r) => ({
            id: r.id,
            ref: r.ref || `RPT-${r.id}`,
            type: r.targetType || 'message',
            reportedUser: r.reportedUser?.username || r.targetId || 'Unknown',
            channel: r.channel || '#general',
            reason: r.reason || 'Violation',
            status: r.status || 'pending',
            date: r.createdAt ? new Date(r.createdAt).toLocaleString() : '',
            context: r.context || '',
            severity: r.severity || 'medium',
            action: r.action,
          }));
          setReports(mapped);
          setSelectedReport((prev) => {
            if (prev) {
              const stillExists = mapped.find((m) => m.id === prev.id);
              if (stillExists) return stillExists;
            }
            return mapped.length > 0 ? mapped[0] : null;
          });
        } else {
          setReports([]);
          setSelectedReport(null);
        }
      } catch {
        setReports([]);
        setSelectedReport(null);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [user.role]);

  const filteredReports = reports.filter(
    (r) =>
      r.status === activeQTab &&
      (!queueSearch ||
        r.reportedUser?.toLowerCase().includes(queueSearch.toLowerCase()) ||
        r.ref?.toLowerCase().includes(queueSearch.toLowerCase()) ||
        r.reason?.toLowerCase().includes(queueSearch.toLowerCase()))
  );

  const takeAction = async (label, reportId) => {
    setProcessing(true);
    try {
      await moderationService.updateReportStatus(reportId, 'resolved');
    } catch {
      // Proceed with local update even if network error
    }

    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: 'resolved', action: `${label}${actionNote ? ` — ${actionNote}` : ''}` }
          : r
      )
    );
    setSelectedReport((prev) => (prev ? { ...prev, status: 'resolved', action: label } : prev));
    setActionNote('');
    showToast(`✅ Action taken: ${label}`);
    setProcessing(false);
  };

  const moveToReview = async (reportId) => {
    try {
      await moderationService.updateReportStatus(reportId, 'reviewed');
    } catch {
      // Proceed with local state update
    }
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status: 'reviewed' } : r)));
    showToast('📋 Moved to In Review');
  };

  const queueCounts = QUEUE_TABS.reduce((acc, tab) => {
    acc[tab] = reports.filter((r) => r.status === tab).length;
    return acc;
  }, {});

  const recentActions = reports.filter((r) => r.status === 'resolved' && r.action).slice(0, 3);

  return {
    navigate,
    user,
    // Reports
    reports,
    loading,
    filteredReports,
    selectedReport,
    setSelectedReport,
    // Queue
    activeQTab,
    setActiveQTab,
    queueSearch,
    setQueueSearch,
    queueCounts,
    // Actions
    actionNote,
    setActionNote,
    takeAction,
    moveToReview,
    processing,
    // Toast
    toast,
    // Derived
    recentActions,
    MOD_ACTIONS,
    QUEUE_TABS,
  };
}
