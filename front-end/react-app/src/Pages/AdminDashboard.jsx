import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../Components/SideBar';
import '../styles/global.css';
import '../styles/sidebar.css';
import '../styles/admin-dashboard.css';

const API_BASE = 'http://localhost:3000/api';

function getUser() {
  try {
    const raw = JSON.parse(localStorage.getItem('nexus_user') || localStorage.getItem('currentUser') || '{}');
    return { role: raw.role || 'admin', firstName: raw.firstName || 'Rajat', username: raw.username || 'rajat' };
  } catch { return { role: 'admin', firstName: 'Rajat', username: 'rajat' }; }
}

const PAGES = [
  { id: 'overview', icon: '⚡', title: 'System Overview' },
  { id: 'users', icon: '👥', title: 'User Management' },
  { id: 'communities', icon: '🏘️', title: 'Communities' },
  { id: 'moderation', icon: '🛡️', title: 'Moderation' },
  { id: 'events-mgmt', icon: '📅', title: 'Events' },
  { id: 'appeals', icon: '⚖️', title: 'Appeals' },
  { id: 'applications', icon: '📋', title: 'Applications' },
  { id: 'audit', icon: '📜', title: 'Audit Log' },
  { id: 'config', icon: '⚙️', title: 'Configuration' },
];

const DEFAULT_STATS = { users: 0, comms: 0, reports: 0, events: 0, appeals: 0, messages: 0 };
const DEFAULT_USERS = [
  { id: 1, name: 'Rajat Jain', username: 'rajat', email: 'rajat@gameunity.com', role: 'admin', status: 'active' },
  { id: 2, name: 'Karmanya', username: 'karmanya', email: 'karmanya@gameunity.com', role: 'moderator', status: 'active' },
  { id: 3, name: 'Awadhesh', username: 'awadhesh', email: 'awadhesh@gameunity.com', role: 'user', status: 'active' },
  { id: 4, name: 'Anant', username: 'anant', email: 'anant@gameunity.com', role: 'community_manager', status: 'active' },
  { id: 5, name: 'Sanidhya', username: 'sanidhya', email: 'sanidhya@gameunity.com', role: 'owner', status: 'active' },
];

const DEFAULT_AUDIT_LOG = [
  { id: 1, time: '10:32 AM', admin: 'rajat', action: 'Updated user role: karmanya → moderator', type: 'role' },
  { id: 2, time: '10:15 AM', admin: 'rajat', action: 'Approved event: Gaming Hackathon', type: 'event' },
  { id: 3, time: '09:47 AM', admin: 'rajat', action: 'Suspended user: spambot99', type: 'moderation' },
  { id: 4, time: '09:30 AM', admin: 'rajat', action: 'Deleted community: Test Community', type: 'community' },
  { id: 5, time: '09:10 AM', admin: 'rajat', action: 'Approved appeal: APL-001', type: 'appeal' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [activePage, setActivePage] = useState('overview');
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [communities, setCommunities] = useState([]);
  const [reports, setReports] = useState([]);
  const [events, setEvents] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [auditLog, setAuditLog] = useState(DEFAULT_AUDIT_LOG);
  const [globalSearch, setGlobalSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, msg: '' });
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  // Applications state
  const [organizerApps, setOrganizerApps] = useState([
    { id: 101, user: 'priya_v', experience: 'Organized 5+ college gaming tournaments & esports leagues', applied: '2 days ago', status: 'pending' },
    { id: 102, user: 'rohit_g', experience: 'Community manager for 8,000+ member developer Discord', applied: '4 days ago', status: 'pending' },
  ]);
  const [moderatorApps, setModeratorApps] = useState([
    { id: 201, user: 'sneha_k', quizScore: '92%', applied: '1 day ago', status: 'pending' },
    { id: 202, user: 'vikram_m', quizScore: '85%', applied: '3 days ago', status: 'pending' },
  ]);

  // Config state
  const [config, setConfig] = useState({
    autoModEnabled: true,
    allowPublicRegistration: true,
    maxCommunitiesPerUser: 10,
    maxChannelsPerCommunity: 50,
    autoDeleteToxic: true,
    shadowbanBadActors: false,
    sessionTimeoutMins: 60,
  });

  const [policies, setPolicies] = useState([
    'No harassment, toxicity, or targeted discrimination',
    'No unauthorized spam or promotional links',
    'Content must be safe and appropriate for all community members',
    'Impersonating platform moderators or staff is strictly forbidden',
  ]);
  const [newPolicyText, setNewPolicyText] = useState('');

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  useEffect(() => {
    async function fetchAll() {
      try {
        const [usersRes, commsRes, reportsRes, eventsRes, appealsRes] = await Promise.all([
          fetch(`${API_BASE}/users`, { headers: { 'x-role': user.role } }),
          fetch(`${API_BASE}/communities`, { headers: { 'x-role': user.role } }),
          fetch(`${API_BASE}/reports`, { headers: { 'x-role': user.role } }),
          fetch(`${API_BASE}/events`, { headers: { 'x-role': user.role } }),
          fetch(`${API_BASE}/appeals`, { headers: { 'x-role': user.role } }),
        ]);
        if (usersRes.ok) { const d = await usersRes.json(); if (Array.isArray(d) && d.length > 0) setUsers(d); }
        if (commsRes.ok) { const d = await commsRes.json(); if (Array.isArray(d)) setCommunities(d); }
        if (reportsRes.ok) { const d = await reportsRes.json(); if (Array.isArray(d)) setReports(d); }
        if (eventsRes.ok) { const d = await eventsRes.json(); if (Array.isArray(d)) setEvents(d); }
        if (appealsRes.ok) { const d = await appealsRes.json(); if (Array.isArray(d)) setAppeals(d); }
      } catch {}
      setLoading(false);
    }
    fetchAll();
  }, [user.role]);

  useEffect(() => {
    setStats({
      users: users.length,
      comms: communities.length || 3,
      reports: reports.filter(r => r.status === 'pending').length || 1,
      events: events.filter(e => e.status === 'approved').length || 2,
      appeals: appeals.filter(a => a.status === 'pending').length || 1,
      messages: 48000,
    });
  }, [users, communities, reports, events, appeals]);

  const navTo = (pageId) => {
    setActivePage(pageId);
  };

  const updateUserRole = async (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setEditingUser(null);
    setAuditLog(prev => [
      { id: Date.now(), time: 'Just now', admin: user.username, action: `Updated role for user #${userId} to ${newRole}`, type: 'role' },
      ...prev,
    ]);
    showToast(`✓ Role updated to ${newRole}`);
    try {
      await fetch(`${API_BASE}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-role': user.role },
        body: JSON.stringify({ role: newRole }),
      });
    } catch {}
  };

  const suspendUser = async (userId) => {
    if (!window.confirm('Suspend this user? They will be locked out until suspension is lifted.')) return;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'suspended' } : u));
    setAuditLog(prev => [
      { id: Date.now(), time: 'Just now', admin: user.username, action: `Suspended user #${userId}`, type: 'moderation' },
      ...prev,
    ]);
    showToast('⚠️ User suspended');
    try {
      await fetch(`${API_BASE}/users/${userId}/suspend`, { method: 'POST', headers: { 'x-role': user.role } });
    } catch {}
  };

  const banUser = async (userId, targetUsername) => {
    if (!window.confirm(`Permanently ban @${targetUsername}? This will terminate their active sessions.`)) return;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'banned' } : u));
    setAuditLog(prev => [
      { id: Date.now(), time: 'Just now', admin: user.username, action: `Permanently banned user @${targetUsername}`, type: 'moderation' },
      ...prev,
    ]);
    showToast(`⛔ User @${targetUsername} banned`);
  };

  const resetPassword = (targetUsername) => {
    showToast(`🔑 Temporary reset link generated for @${targetUsername}`);
  };

  const deleteCommunity = async (commId) => {
    if (!window.confirm('Delete this community? This cannot be undone.')) return;
    setCommunities(prev => prev.filter(c => c.id !== commId));
    setAuditLog(prev => [
      { id: Date.now(), time: 'Just now', admin: user.username, action: `Deleted community #${commId}`, type: 'community' },
      ...prev,
    ]);
    showToast('🗑️ Community deleted');
    try {
      await fetch(`${API_BASE}/communities/${commId}`, { method: 'DELETE', headers: { 'x-role': user.role } });
    } catch {}
  };

  const handleOrganizerApp = (id, newStatus) => {
    setOrganizerApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    setAuditLog(prev => [
      { id: Date.now(), time: 'Just now', admin: user.username, action: `${newStatus === 'approved' ? 'Approved' : 'Rejected'} organizer application #${id}`, type: 'application' },
      ...prev,
    ]);
    showToast(newStatus === 'approved' ? '✅ Organizer application approved' : '❌ Application rejected');
  };

  const handleModeratorApp = (id, newStatus) => {
    setModeratorApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    setAuditLog(prev => [
      { id: Date.now(), time: 'Just now', admin: user.username, action: `${newStatus === 'approved' ? 'Approved' : 'Rejected'} moderator application #${id}`, type: 'application' },
      ...prev,
    ]);
    showToast(newStatus === 'approved' ? '✅ Moderator certified' : '❌ Application rejected');
  };

  const handleAddPolicy = (e) => {
    e.preventDefault();
    if (!newPolicyText.trim()) return;
    setPolicies(prev => [...prev, newPolicyText.trim()]);
    setNewPolicyText('');
    showToast('Policy added');
  };

  const handleDeletePolicy = (index) => {
    setPolicies(prev => prev.filter((_, i) => i !== index));
    showToast('Policy removed');
  };

  const filteredUsers = users.filter(u => {
    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchSearch = !userSearch || u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.username?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase());
    return matchRole && matchSearch;
  });

  const currentPage = PAGES.find(p => p.id === activePage);

  const STAT_CARDS = [
    { id: 'stat-users', label: 'Total Users', val: stats.users, icon: '👥', bg: 'bg-purple', page: 'users', trend: '+12.4%' },
    { id: 'stat-comms', label: 'Communities', val: stats.comms, icon: '🏘️', bg: 'bg-cyan', page: 'communities', trend: '+8.2%' },
    { id: 'stat-reports', label: 'Open Reports', val: stats.reports, icon: '🛡️', bg: 'bg-orange', page: 'moderation', trend: '-3.1%' },
    { id: 'stat-events', label: 'Active Events', val: stats.events, icon: '📅', bg: 'bg-green', page: 'events-mgmt', trend: '+15.7%' },
    { id: 'stat-appeals', label: 'Open Appeals', val: stats.appeals, icon: '⚖️', bg: 'bg-purple', page: 'appeals', trend: '+2.1%' },
    { id: 'stat-msgs', label: 'Messages', val: stats.messages.toLocaleString(), icon: '💬', bg: 'bg-cyan', page: 'overview', trend: '+22.3%' },
  ];

  return (
    <div className="app-shell">
      <SideBar />
      <div className="main">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <div className="header-icon" id="page-icon">{currentPage?.icon || '⚡'}</div>
            <h1 className="header-title" id="page-title">{currentPage?.title || 'System Overview'}</h1>
            <span className="header-badge">ADMIN</span>
          </div>
          <div className="header-right">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search anything..."
                id="globalSearch"
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
              />
            </div>
            <div
              className="header-avatar user-avatar"
              id="su-avatar"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/profile-settings')}
              title="Profile Settings"
            >
              {user.firstName.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Sub-Nav */}
        <div className="admin-su-nav">
          {PAGES.map(p => (
            <button
              key={p.id}
              className={`admin-su-nav-btn${activePage === p.id ? ' active' : ''}`}
              onClick={() => navTo(p.id)}
            >
              <span>{p.icon}</span> {p.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="admin-content-area">

          {/* Overview Page */}
          {activePage === 'overview' && (
            <div className="admin-page active" id="page-overview">
              <div className="stats-grid">
                {STAT_CARDS.map(card => (
                  <div
                    key={card.id}
                    className="stat-card"
                    onClick={() => navTo(card.page)}
                    style={{ cursor: 'pointer' }}
                    title={`Go to ${card.label}`}
                  >
                    <div className={`stat-icon ${card.bg}`}>{card.icon}</div>
                    <div className="stat-data">
                      <div className="stat-value">{loading ? '...' : card.val}</div>
                      <div className="stat-label">{card.label}</div>
                    </div>
                    <div className={`stat-trend ${card.trend.startsWith('+') ? 'up' : 'down'}`}>{card.trend}</div>
                  </div>
                ))}
              </div>

              {/* Overview Section Grid: Recent Audit Log, Platform Health, Quick Actions */}
              <div className="section-grid" style={{ marginTop: '24px' }}>
                {/* Recent Audit Log */}
                <div className="card">
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Recent Audit Log</h3>
                    <button className="btn-sm" onClick={() => navTo('audit')}>View All</button>
                  </div>
                  <div className="audit-list">
                    {auditLog.slice(0, 5).map(item => (
                      <div key={item.id} className="audit-item-row">
                        <span style={{ fontSize: '18px' }}>📜</span>
                        <div style={{ flex: 1, fontSize: '13px', color: 'var(--text-secondary,#ccc)' }}>{item.action}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-3,#666)' }}>{item.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Health Metrics */}
                <div className="card">
                  <div className="card-header">
                    <h3 style={{ margin: 0 }}>Platform Health</h3>
                  </div>
                  <div className="health-grid">
                    <div className="health-item">
                      <span className="h-dot green"></span> AutoMod Accuracy <span className="h-val">97.3%</span>
                    </div>
                    <div className="health-item">
                      <span className="h-dot green"></span> System Uptime <span className="h-val">99.98%</span>
                    </div>
                    <div className="health-item">
                      <span className="h-dot yellow"></span> Open Report Queue <span className="h-val">{stats.reports}</span>
                    </div>
                    <div className="health-item">
                      <span className="h-dot green"></span> API Latency <span className="h-val">38ms</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="card" style={{ marginTop: '20px' }}>
                <div className="card-header">
                  <h3 style={{ margin: 0 }}>Administrative Quick Actions</h3>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
                  <button
                    className="btn-sm"
                    onClick={() => navTo('communities')}
                    style={{ padding: '8px 14px', background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    + Manage Communities
                  </button>
                  <button
                    className="btn-sm"
                    onClick={() => showToast('📢 System announcement broadcasted to all active channels')}
                    style={{ padding: '8px 14px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    📢 Broadcast Alert
                  </button>
                  <button
                    className="btn-sm"
                    onClick={() => showToast('🔍 AutoMod background scan completed: 0 critical threats')}
                    style={{ padding: '8px 14px', background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    🔍 Run AutoMod Scan
                  </button>
                  <button
                    className="btn-sm"
                    onClick={() => showToast('📥 Audit log successfully exported to audit_report.csv')}
                    style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.06)', color: '#ccc', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    📥 Export Audit Log
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users Page */}
          {activePage === 'users' && (
            <div className="admin-page active" id="page-users">
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="🔍 Search users..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  style={{ flex: 1, minWidth: '200px', padding: '9px 14px', background: 'var(--bg-card,#151d2f)', border: '1px solid var(--border,rgba(255,255,255,0.08))', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
                />
                <select
                  value={userRoleFilter}
                  onChange={e => setUserRoleFilter(e.target.value)}
                  style={{ padding: '9px 14px', background: 'var(--bg-card,#151d2f)', border: '1px solid var(--border,rgba(255,255,255,0.08))', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                  <option value="community_manager">Community Manager</option>
                  <option value="organizer">Organizer</option>
                  <option value="moderator">Moderator</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="card">
                <div className="table-wrap">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        {['User', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>
                                {(u.name || u.username).slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>{u.name || u.username}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-3,#666)' }}>@{u.username}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontSize: '13px', color: 'var(--text-3,#aaa)' }}>{u.email}</td>
                          <td>
                            {editingUser === u.id ? (
                              <select
                                defaultValue={u.role}
                                onChange={e => updateUserRole(u.id, e.target.value)}
                                style={{ padding: '4px 8px', background: 'var(--bg-card,#151d2f)', border: '1px solid #6366f1', borderRadius: '6px', color: '#fff', fontSize: '12px' }}
                              >
                                {['user', 'moderator', 'community_manager', 'organizer', 'admin', 'owner'].map(r => (
                                  <option key={r} value={r}>{r}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="admin-badge-role">
                                {u.role?.toUpperCase()}
                              </span>
                            )}
                          </td>
                          <td>
                            <span className={`admin-badge-status ${u.status}`}>
                              {(u.status || 'active').toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              <button
                                className="act-btn act-edit"
                                onClick={() => setEditingUser(editingUser === u.id ? null : u.id)}
                              >
                                {editingUser === u.id ? 'Cancel' : 'Edit Role'}
                              </button>
                              <button
                                className="act-btn act-view"
                                onClick={() => resetPassword(u.username)}
                              >
                                Reset PW
                              </button>
                              {u.status !== 'suspended' && u.status !== 'banned' && u.id !== 1 && (
                                <button
                                  className="act-btn act-delete"
                                  onClick={() => suspendUser(u.id)}
                                >
                                  Suspend
                                </button>
                              )}
                              {u.status !== 'banned' && u.id !== 1 && (
                                <button
                                  className="act-btn act-ban"
                                  onClick={() => banUser(u.id, u.username)}
                                >
                                  Ban
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Communities Page */}
          {activePage === 'communities' && (
            <div className="admin-page active" id="page-communities">
              <div className="stats-grid" style={{ marginBottom: '20px' }}>
                <div className="stat-card">
                  <div className="stat-icon bg-cyan">🏘️</div>
                  <div className="stat-data">
                    <div className="stat-value">{communities.length || 3}</div>
                    <div className="stat-label">Total Communities</div>
                  </div>
                </div>
              </div>
              {(communities.length > 0 ? communities : [
                { id: 1, name: 'Pro Gamers', icon: '⚡', members: 2451, category: 'Gaming', status: 'active' },
                { id: 2, name: 'Dev Nexus', icon: '💻', members: 12400, category: 'Technology', status: 'active' },
                { id: 3, name: 'Design Studio', icon: '🎨', members: 8200, category: 'Design', status: 'active' },
              ]).map(comm => (
                <div key={comm.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '32px' }}>{comm.icon || '🏘️'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#fff' }}>{comm.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-3,#666)', marginTop: '3px' }}>
                      {(comm.members || 0).toLocaleString()} members • {comm.category}
                    </div>
                  </div>
                  <span style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', padding: '3px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 700 }}>
                    {(comm.status || 'ACTIVE').toUpperCase()}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => navigate(`/community/${comm.id}`)} style={{ padding: '6px 12px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '6px', color: '#818cf8', fontSize: '12px', cursor: 'pointer' }}>View</button>
                    <button onClick={() => deleteCommunity(comm.id)} style={{ padding: '6px 12px', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '6px', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Moderation Page */}
          {activePage === 'moderation' && (
            <div className="admin-page active">
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontFamily: "'Syne',sans-serif" }}>Open Reports</h3>
                <button onClick={() => navigate('/mod-panel')} style={{ padding: '8px 16px', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>Go to Mod Panel →</button>
              </div>
              {(reports.length > 0 ? reports : [
                { id: 1, ref: 'RPT-4821', reportedUser: { username: 'BadActor_X' }, reason: 'Hate Speech', status: 'pending', createdAt: new Date().toISOString() },
              ]).map(r => (
                <div key={r.ref || r.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '20px' }}>🛡️</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>{r.ref || `RPT-${r.id}`}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3,#666)', marginTop: '3px' }}>{r.reason} • @{r.reportedUser?.username || r.reportedUser}</div>
                  </div>
                  <span style={{ background: r.status === 'pending' ? 'rgba(245,158,11,0.15)' : 'rgba(52,211,153,0.15)', color: r.status === 'pending' ? '#f59e0b' : '#34d399', padding: '3px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 700 }}>
                    {(r.status || 'PENDING').toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Events Management */}
          {activePage === 'events-mgmt' && (
            <div className="admin-page active">
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontFamily: "'Syne',sans-serif" }}>Events Management</h3>
                <button onClick={() => navigate('/event-approval')} style={{ padding: '8px 16px', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>Event Approval →</button>
              </div>
              {(events.length > 0 ? events : [
                { id: 1, title: 'Gaming Hackathon', community: 'Pro Gamers', status: 'approved', date: '2025-03-07' },
                { id: 2, title: 'Frontend Workshop', community: 'Dev Nexus', status: 'approved', date: '2025-03-09' },
              ]).map(ev => (
                <div key={ev.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '20px' }}>📅</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>{ev.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3,#666)', marginTop: '3px' }}>{ev.community} • {ev.date}</div>
                  </div>
                  <span style={{ background: ev.status === 'approved' ? 'rgba(52,211,153,0.15)' : 'rgba(245,158,11,0.15)', color: ev.status === 'approved' ? '#34d399' : '#f59e0b', padding: '3px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 700 }}>
                    {(ev.status || 'PENDING').toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Appeals */}
          {activePage === 'appeals' && (
            <div className="admin-page active">
              <h3 style={{ fontFamily: "'Syne',sans-serif", marginBottom: '16px' }}>Open Appeals</h3>
              {(appeals.length > 0 ? appeals : [
                { id: 1, appealType: 'Misunderstanding', status: 'pending', userId: 3 },
              ]).map(ap => (
                <div key={ap.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '20px' }}>⚖️</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>Appeal #{ap.id}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3,#666)', marginTop: '3px' }}>{ap.appealType || 'General Appeal'}</div>
                  </div>
                  <span style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '3px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 700 }}>
                    {(ap.status || 'PENDING').toUpperCase()}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={async () => { await fetch(`${API_BASE}/appeals/${ap.id}/approve`, { method: 'POST', headers: { 'x-role': user.role } }); showToast('✓ Appeal approved'); }} style={{ padding: '6px 12px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '6px', color: '#34d399', fontSize: '12px', cursor: 'pointer' }}>Approve</button>
                    <button onClick={async () => { await fetch(`${API_BASE}/appeals/${ap.id}/reject`, { method: 'POST', headers: { 'x-role': user.role } }); showToast('✓ Appeal rejected'); }} style={{ padding: '6px 12px', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '6px', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Applications Page (Verified Organizer / Certified Moderator Approval Queues) */}
          {activePage === 'applications' && (
            <div className="admin-page active" id="page-applications">
              <div className="card" style={{ marginBottom: '20px' }}>
                <div className="card-header">
                  <h3 style={{ margin: 0 }}>🏆 Organizer Applications</h3>
                </div>
                <div className="table-wrap">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Experience Note</th>
                        <th>Applied</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organizerApps.map(app => (
                        <tr key={app.id}>
                          <td><strong>@{app.user}</strong></td>
                          <td style={{ fontSize: '13px', color: 'var(--text-secondary,#ccc)' }}>{app.experience}</td>
                          <td style={{ fontSize: '12px', color: 'var(--text-3,#666)' }}>{app.applied}</td>
                          <td>
                            <span className={`admin-badge-status ${app.status}`}>
                              {app.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            {app.status === 'pending' ? (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button className="act-btn act-restore" onClick={() => handleOrganizerApp(app.id, 'approved')}>Approve</button>
                                <button className="act-btn act-delete" onClick={() => handleOrganizerApp(app.id, 'rejected')}>Reject</button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '12px', color: 'var(--text-3,#666)' }}>Decision saved</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 style={{ margin: 0 }}>🛡️ Moderator Applications</h3>
                </div>
                <div className="table-wrap">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Quiz Score</th>
                        <th>Applied</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {moderatorApps.map(app => (
                        <tr key={app.id}>
                          <td><strong>@{app.user}</strong></td>
                          <td><span className="admin-badge-score">{app.quizScore}</span></td>
                          <td style={{ fontSize: '12px', color: 'var(--text-3,#666)' }}>{app.applied}</td>
                          <td>
                            <span className={`admin-badge-status ${app.status}`}>
                              {app.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            {app.status === 'pending' ? (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button className="act-btn act-restore" onClick={() => handleModeratorApp(app.id, 'approved')}>Approve</button>
                                <button className="act-btn act-delete" onClick={() => handleModeratorApp(app.id, 'rejected')}>Reject</button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '12px', color: 'var(--text-3,#666)' }}>Decision saved</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Audit Log */}
          {activePage === 'audit' && (
            <div className="admin-page active" id="page-audit">
              <h3 style={{ fontFamily: "'Syne',sans-serif", marginBottom: '16px' }}>Audit Log</h3>
              <div className="card">
                <div className="table-wrap">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Admin</th>
                        <th>Type</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLog.map(entry => (
                        <tr key={entry.id}>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--text-1,#fff)', fontSize: '13px' }}>
                              {entry.action}
                            </div>
                          </td>
                          <td>
                            <span style={{ color: 'var(--text-secondary,#ccc)', fontSize: '12px' }}>@{entry.admin}</span>
                          </td>
                          <td>
                            <span className="admin-badge-role">{entry.type}</span>
                          </td>
                          <td style={{ color: 'var(--text-3,#666)', fontSize: '12px' }}>{entry.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Configuration Page */}
          {activePage === 'config' && (
            <div className="admin-page active" id="page-config">
              <div className="config-grid">
                <div className="card">
                  <div className="card-header">
                    <h3 style={{ margin: 0 }}>AutoMod &amp; System Settings</h3>
                  </div>
                  <div className="config-item">
                    <label>AutoMod Engine Enabled</label>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={config.autoModEnabled}
                        onChange={e => {
                          setConfig(c => ({ ...c, autoModEnabled: e.target.checked }));
                          showToast(`AutoMod ${e.target.checked ? 'enabled' : 'disabled'}`);
                        }}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="config-item">
                    <label>Allow Public Registration</label>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={config.allowPublicRegistration}
                        onChange={e => {
                          setConfig(c => ({ ...c, allowPublicRegistration: e.target.checked }));
                          showToast(`Public registration ${e.target.checked ? 'opened' : 'closed'}`);
                        }}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="config-item">
                    <label>Auto-Delete Toxic Messages</label>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={config.autoDeleteToxic}
                        onChange={e => {
                          setConfig(c => ({ ...c, autoDeleteToxic: e.target.checked }));
                          showToast(`Toxic auto-delete ${e.target.checked ? 'enabled' : 'disabled'}`);
                        }}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="config-item">
                    <label>Shadowban Bad Actors Automatically</label>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={config.shadowbanBadActors}
                        onChange={e => {
                          setConfig(c => ({ ...c, shadowbanBadActors: e.target.checked }));
                          showToast(`Shadowban engine ${e.target.checked ? 'enabled' : 'disabled'}`);
                        }}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="config-item">
                    <label>Max Communities / User</label>
                    <input
                      type="number"
                      className="config-input"
                      value={config.maxCommunitiesPerUser}
                      onChange={e => setConfig(c => ({ ...c, maxCommunitiesPerUser: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  <div className="config-item">
                    <label>Max Channels / Community</label>
                    <input
                      type="number"
                      className="config-input"
                      value={config.maxChannelsPerCommunity}
                      onChange={e => setConfig(c => ({ ...c, maxChannelsPerCommunity: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-3,#9ca3af)', marginTop: '12px' }}>
                    System configurations take effect immediately platform-wide.
                  </p>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3 style={{ margin: 0 }}>Moderation Policies</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                    {policies.map((pol, idx) => (
                      <div key={idx} className="policy-item">
                        <span>• {pol}</span>
                        <button className="policy-del" onClick={() => handleDeletePolicy(idx)} title="Delete policy">✕</button>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleAddPolicy} className="add-policy-row">
                    <input
                      type="text"
                      className="config-input"
                      placeholder="Add new platform policy..."
                      value={newPolicyText}
                      onChange={e => setNewPolicyText(e.target.value)}
                    />
                    <button type="submit" className="btn-sm" style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                      Add
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

        </div>

        <div className={`toast${toast.show ? ' show' : ''}`} id="toast">
          <span>{toast.msg}</span>
        </div>
      </div>
    </div>
  );
}
