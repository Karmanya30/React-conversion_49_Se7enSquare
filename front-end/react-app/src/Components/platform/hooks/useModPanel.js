import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_REPORTS, QUEUE_TABS, MOD_ACTIONS } from '../data/modPanelData';

const API_BASE = 'http://localhost:3000/api';

function getUser() {
  try {
    const raw = JSON.parse(localStorage.getItem('nexus_user') || localStorage.getItem('currentUser') || '{}');
    return {
      role:      raw.role      || 'moderator',
      firstName: raw.firstName || 'Karmanya',
      username:  raw.username  || 'karmanya',
    };
  } catch { return { role: 'moderator', firstName: 'Karmanya', username: 'karmanya' }; }
}

/**
 * Manages all state, fetching, filtering, and moderation actions for the ModPanel page.
 */
export default function useModPanel() {
  const navigate = useNavigate();
  const user = getUser();

  const [reports,        setReports]        = useState(DEFAULT_REPORTS);
  const [activeQTab,     setActiveQTab]     = useState('pending');
  const [selectedReport, setSelectedReport] = useState(DEFAULT_REPORTS[0]);
  const [queueSearch,    setQueueSearch]    = useState('');
  const [actionNote,     setActionNote]     = useState('');
  const [toast,          setToast]          = useState({ show: false, msg: '' });
  const [loading,        setLoading]        = useState(true);
  const [processing,     setProcessing]     = useState(false);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  // Fetch reports from backend on mount
  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch(`${API_BASE}/reports`, { headers: { 'x-role': user.role } });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setReports(data.map(r => ({
              id:           r.id,
              ref:          r.ref || `RPT-${r.id}`,
              type:         r.targetType  || 'message',
              reportedUser: r.reportedUser?.username || r.targetId || 'Unknown',
              channel:      r.channel     || '#general',
              reason:       r.reason      || 'Violation',
              status:       r.status      || 'pending',
              date:         r.createdAt ? new Date(r.createdAt).toLocaleString() : '',
              context:      r.context     || '',
              severity:     r.severity    || 'medium',
              action:       r.action,
            })));
          }
        }
      } catch {}
      setLoading(false);
    }
    fetchReports();
  }, [user.role]);

  const filteredReports = reports.filter(r =>
    r.status === activeQTab &&
    (!queueSearch ||
      r.reportedUser?.toLowerCase().includes(queueSearch.toLowerCase()) ||
      r.ref?.toLowerCase().includes(queueSearch.toLowerCase()) ||
      r.reason?.toLowerCase().includes(queueSearch.toLowerCase()))
  );

  const takeAction = async (label, reportId) => {
    setProcessing(true);
    try {
      await fetch(`${API_BASE}/reports/${reportId}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-role': user.role },
        body:    JSON.stringify({ status: 'resolved' }),
      });
    } catch {}

    setReports(prev => prev.map(r =>
      r.id === reportId
        ? { ...r, status: 'resolved', action: `${label}${actionNote ? ` — ${actionNote}` : ''}` }
        : r
    ));
    setSelectedReport(prev => prev ? { ...prev, status: 'resolved', action: label } : prev);
    setActionNote('');
    showToast(`✅ Action taken: ${label}`);
    setProcessing(false);
  };

  const moveToReview = async (reportId) => {
    try {
      await fetch(`${API_BASE}/reports/${reportId}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-role': user.role },
        body:    JSON.stringify({ status: 'reviewed' }),
      });
    } catch {}
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'reviewed' } : r));
    showToast('📋 Moved to In Review');
  };

  const queueCounts = QUEUE_TABS.reduce((acc, tab) => {
    acc[tab] = reports.filter(r => r.status === tab).length;
    return acc;
  }, {});

  const recentActions = reports.filter(r => r.status === 'resolved' && r.action).slice(0, 3);

  return {
    navigate, user,
    // Reports
    reports, loading,
    filteredReports,
    selectedReport, setSelectedReport,
    // Queue
    activeQTab, setActiveQTab,
    queueSearch, setQueueSearch,
    queueCounts,
    // Actions
    actionNote, setActionNote,
    takeAction, moveToReview,
    processing,
    // Toast
    toast,
    // Derived
    recentActions,
    MOD_ACTIONS,
    QUEUE_TABS,
  };
}
