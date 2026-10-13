import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../Components/SideBar';
import '../styles/global.css';
import '../styles/sidebar.css';
import '../styles/admin-dashboard.css';
import '../styles/owner-dashboard.css';

const API_BASE = 'http://localhost:3000/api';

function getCurrentUser() {
  try {
    const raw = JSON.parse(localStorage.getItem('nexus_user') || localStorage.getItem('currentUser') || '{}');
    return {
      id: raw.id,
      username: raw.username || 'owner',
      firstName: raw.firstName || 'Owner',
      lastName: raw.lastName || '',
      role: raw.role || 'owner',
    };
  } catch {
    return { username: 'owner', firstName: 'Owner', lastName: '', role: 'owner' };
  }
}

// Extracts the human-readable error message a NestJS response carries.
async function apiErrorMessage(res) {
  try {
    const body = await res.json();
    const msg = body?.message;
    return Array.isArray(msg) ? msg.join(', ') : (msg || `HTTP ${res.status}`);
  } catch { return `HTTP ${res.status}`; }
}

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [stats, setStats] = useState({
    totalCommunities: 0,
    totalEvents: 0,
    pendingReportsCount: 0,
    pendingEventsCount: 0,
    pendingAppealsCount: 0,
    backendStatus: 'Checking…',
  });

  const [revenue, setRevenue] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    subscriptionRevenue: 0,
    organiserRevenue: 0,
    featuredEventRevenue: 0,
    premiumUsers: 0,
    verifiedOrganisers: 0,
    pendingOrganiserApplications: 0,
  });

  // Drilldown Modal
  const [drillModalOpen, setDrillModalOpen] = useState(false);
  const [drillTitle, setDrillTitle] = useState('Details');
  const [drillLoading, setDrillLoading] = useState(false);
  const [drillContent, setDrillContent] = useState(null);

  useEffect(() => {
    async function loadStats() {
      const role = getCurrentUser().role || 'owner';
      try {
        const res = await fetch(`${API_BASE}/dashboard/stats`, {
          headers: { 'x-role': role },
        });
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalCommunities: data.totalCommunities || 0,
            totalEvents: data.totalEvents || 0,
            pendingReportsCount: data.pendingReportsCount || 0,
            pendingEventsCount: data.pendingEventsCount || 0,
            pendingAppealsCount: data.pendingAppealsCount || 0,
            backendStatus: 'Reachable',
          });
        } else {
          setStats((prev) => ({ ...prev, backendStatus: '⚠️ Degraded' }));
        }
      } catch {
        setStats({
          totalCommunities: 12,
          totalEvents: 8,
          pendingReportsCount: 3,
          pendingEventsCount: 2,
          pendingAppealsCount: 1,
          backendStatus: 'Local Fallback',
        });
      }

      try {
        const revRes = await fetch(`${API_BASE}/dashboard/revenue`, {
          headers: { 'x-role': role },
        });
        if (revRes.ok) {
          const revData = await revRes.json();
          setRevenue({
            totalRevenue: revData.totalRevenue || 0,
            monthlyRevenue: revData.monthlyRevenue || 0,
            subscriptionRevenue: revData.subscriptionRevenue || 0,
            organiserRevenue: revData.organiserRevenue || 0,
            featuredEventRevenue: revData.featuredEventRevenue || 0,
            premiumUsers: revData.premiumUsers || 0,
            verifiedOrganisers: revData.verifiedOrganisers || 0,
            pendingOrganiserApplications: revData.pendingOrganiserApplications || 0,
          });
        }
      } catch {
        setRevenue({
          totalRevenue: 48500,
          monthlyRevenue: 12400,
          subscriptionRevenue: 32000,
          organiserRevenue: 9500,
          featuredEventRevenue: 7000,
          premiumUsers: 45,
          verifiedOrganisers: 8,
          pendingOrganiserApplications: 3,
        });
      }
    }

    loadStats();
  }, []);

  const openDrill = async (kind, filter) => {
    setDrillModalOpen(true);
    setDrillLoading(true);
    const role = currentUser.role || 'owner';

    try {
      if (kind === 'communities') {
        setDrillTitle('Communities Breakdown');
        let communities = [];
        let users = [];
        let loadError = '';
        try {
          const [commRes, usersRes] = await Promise.all([
            fetch(`${API_BASE}/communities`, { headers: { 'x-role': role } }),
            fetch(`${API_BASE}/users`, { headers: { 'x-role': role } }),
          ]);
          if (commRes.ok) communities = await commRes.json();
          else loadError = await apiErrorMessage(commRes);
          // GET /users is not permitted for the owner role — fall back to
          // "user#<id>" labels rather than showing an error.
          users = usersRes.ok ? await usersRes.json() : [];
        } catch {
          communities = [
            { id: 1, name: 'FPS Arena', icon: '🎯', memberCount: 1420, category: 'FPS', ownerId: 1 },
            { id: 2, name: 'Pro Gamers', icon: '⚡', memberCount: 890, category: 'Gaming', ownerId: 2 },
          ];
        }
        const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]));
        setDrillContent(
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Members</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {communities.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3,#888)' }}>{loadError ? `⚠️ Could not load: ${loadError}` : 'No communities yet.'}</td></tr>
                ) : communities.map((c) => {
                  const owner = usersById.get(String(c.ownerId));
                  return (
                    <tr key={c.id}>
                      <td>
                        <div className="row-name">
                          {c.icon || '🏘️'} {c.name}
                        </div>
                      </td>
                      <td>{owner?.username || `user#${c.ownerId ?? '—'}`}</td>
                      <td>{(c.memberCount || 0).toLocaleString()}</td>
                      <td>{c.category || 'Gaming'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      } else if (kind === 'events') {
        setDrillTitle('Events Overview');
        let events = [];
        let communities = [];
        let loadError = '';
        try {
          const [eventsRes, commsRes] = await Promise.all([
            fetch(`${API_BASE}/events`, { headers: { 'x-role': role } }),
            fetch(`${API_BASE}/communities`, { headers: { 'x-role': role } }),
          ]);
          if (eventsRes.ok) events = await eventsRes.json();
          else loadError = await apiErrorMessage(eventsRes);
          communities = commsRes.ok ? await commsRes.json() : [];
        } catch {
          events = [
            { id: 1, title: 'Summer Valorant Cup', type: 'tournament', entryFee: 150, date: '2026-10-15', status: 'approved', communityId: 1 },
            { id: 2, title: 'Apex Community Scrims', type: 'event', entryFee: 0, date: '2026-10-18', status: 'pending', communityId: 2 },
          ];
          communities = [];
        }
        const commsById = new Map((Array.isArray(communities) ? communities : []).map((c) => [String(c.id), c]));
        const sorted = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
        setDrillContent(
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Community</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3,#888)' }}>{loadError ? `⚠️ Could not load: ${loadError}` : 'No events yet.'}</td></tr>
                ) : sorted.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <div className="row-name">{e.title}</div>
                      <div className="row-sub" style={{ fontSize: '11.5px', color: 'var(--text-3,#888)' }}>
                        {e.type || 'event'}{e.entryFee ? ` · ₹${e.entryFee} entry` : ''}
                      </div>
                    </td>
                    <td>{commsById.get(String(e.communityId))?.name || `Community #${e.communityId ?? '—'}`}</td>
                    <td>{e.date}{e.time ? ` · ${e.time}` : ''}</td>
                    <td><span className={`badge badge-${e.status || 'pending'}`}>{e.status || 'pending'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else if (kind === 'revenue') {
        setDrillTitle('Revenue — All Transactions');
        let payments = [];
        let loadError = '';
        try {
          const res = await fetch(`${API_BASE}/payments/history`, {
            headers: { 'x-role': role },
          });
          if (res.ok) payments = await res.json();
          else loadError = await apiErrorMessage(res);
        } catch {
          payments = [
            { id: 1, type: 'subscription', amount: 499, description: 'Plus Upgrade', createdAt: new Date().toISOString() },
            { id: 2, type: 'tournament_fee', amount: 150, description: 'Tournament Registration', createdAt: new Date().toISOString() },
          ];
        }
        payments = Array.isArray(payments) ? payments : [];
        const byType = payments.reduce((acc, p) => {
          acc[p.type] = (acc[p.type] || 0) + (p.amount || 0);
          return acc;
        }, {});
        const sorted = [...payments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 50);
        setDrillContent(
          <div>
            {payments.length > 0 && (
              <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', marginBottom: '18px' }}>
                {Object.entries(byType).map(([type, amt]) => (
                  <div key={type} className="stat-card" style={{ padding: '12px' }}>
                    <div className="stat-value" style={{ fontSize: '18px' }}>₹{amt.toLocaleString()}</div>
                    <div className="stat-label">{type.replace(/_/g, ' ')}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3,#888)' }}>{loadError ? `⚠️ Could not load: ${loadError}` : 'No transactions yet.'}</td></tr>
                  ) : sorted.map((p, i) => (
                    <tr key={p.id ?? i}>
                      <td><span className="badge badge-active">{p.type.replace(/_/g, ' ')}</span></td>
                      <td>₹{(p.amount || 0).toLocaleString()}</td>
                      <td>{p.description}</td>
                      <td>{new Date(p.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {payments.length > 50 && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-3,#888)' }}>
                Showing 50 most recent of {payments.length} transactions
              </div>
            )}
          </div>
        );
      } else if (kind === 'subscriptions') {
        setDrillTitle('Subscriptions Status');
        let subData = { byPlan: { free: 120, plus: 34, ultra_pro: 11 }, subscribers: [] };
        let loadError = '';
        try {
          const res = await fetch(`${API_BASE}/subscriptions`, {
            headers: { 'x-role': role },
          });
          if (res.ok) subData = await res.json();
          else loadError = await apiErrorMessage(res);
        } catch {
          // fallback
        }
        const subscribers = Array.isArray(subData.subscribers) ? subData.subscribers : [];
        setDrillContent(
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-3,#888)', marginBottom: '14px', lineHeight: 1.6 }}>
              "Active Premium Users" below is a live snapshot — how many people are on a paid plan <em>right now</em>.
              "Subscription Revenue" on the main dashboard is cumulative — every upgrade payment ever collected, which
              a later downgrade or cancellation doesn't reverse. The two numbers measure different things and won't
              always move together; that's expected, not a bug.
            </p>
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '18px' }}>
              <div className="stat-card" style={{ padding: '12px' }}>
                <div className="stat-value">{subData.byPlan?.free || 0}</div>
                <div className="stat-label">Free</div>
              </div>
              <div className="stat-card" style={{ padding: '12px' }}>
                <div className="stat-value">{subData.byPlan?.plus || 0}</div>
                <div className="stat-label">Plus</div>
              </div>
              <div className="stat-card" style={{ padding: '12px' }}>
                <div className="stat-value">{subData.byPlan?.ultra_pro || 0}</div>
                <div className="stat-label">Ultra Pro</div>
              </div>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Since</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.length === 0 ? (
                    <tr><td colSpan={3} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3,#888)' }}>{loadError ? `⚠️ Could not load: ${loadError}` : 'No paid subscribers right now.'}</td></tr>
                  ) : subscribers.map((s, idx) => (
                    <tr key={idx}>
                      <td>{s.username}</td>
                      <td><span className="badge badge-active">{s.plan === 'ultra_pro' ? 'Ultra Pro' : (s.plan ? s.plan[0].toUpperCase() + s.plan.slice(1) : 'Free')}</span></td>
                      <td>{s.startedAt ? new Date(s.startedAt).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      } else if (kind === 'organisers') {
        const title = filter === 'verified' ? 'Verified Organizers' : 'Pending Organizer Applications';
        setDrillTitle(title);
        let orgs = [];
        let loadError = '';
        try {
          const res = await fetch(`${API_BASE}/organisers?status=${filter}`, {
            headers: { 'x-role': role },
          });
          if (res.ok) orgs = await res.json();
          else loadError = await apiErrorMessage(res);
        } catch {
          orgs = [
            { username: 'champion_org', plan: 'premium', appliedAt: new Date().toISOString() },
            { username: 'pixel_guild', plan: 'free', appliedAt: new Date().toISOString() },
          ];
        }
        orgs = Array.isArray(orgs) ? orgs : [];
        setDrillContent(
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Plan</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {orgs.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3,#888)' }}>{loadError ? `⚠️ Could not load: ${loadError}` : `No ${filter} organisers.`}</td></tr>
                ) : orgs.map((o, idx) => (
                  <tr key={idx}>
                    <td>{o.username || `user#${o.userId}`}</td>
                    <td><span className="badge badge-active">{o.plan === 'premium' ? 'Premium' : 'Free'}</span></td>
                    <td>{o.appliedAt ? new Date(o.appliedAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    } catch (err) {
      setDrillContent(<div style={{ color: 'var(--text-3)', padding: '20px' }}>Could not load details: {err.message}</div>);
    }

    setDrillLoading(false);
  };

  return (
    <div className="app-shell">
      <SideBar />

      <div className="main">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <div className="header-icon">📊</div>
            <h1 className="header-title">Platform Statistics</h1>
            <span className="header-badge">OWNER</span>
          </div>
          <div className="header-right">
            <div
              className="header-avatar user-avatar"
              onClick={() => navigate('/profile-settings')}
              style={{ cursor: 'pointer' }}
              title="Profile Settings"
            />
          </div>
        </header>

        <div className="page active">
          <p style={{ color: 'var(--text-3, #9ca3af)', fontSize: '13px', marginBottom: '20px' }}>
            Read-only view — statistics and platform health. No user, community, or moderation actions are available from this account.
          </p>
          <p style={{ color: 'var(--text-3, #666)', fontSize: '11.5px', margin: '-12px 0 14px' }}>
            💡 Click any card for a breakdown.
          </p>

          {/* Communities & Events */}
          <div className="stats-grid">
            <div
              className="stat-card drill-card"
              onClick={() => openDrill('communities')}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-icon bg-cyan">🏘️</div>
              <div className="stat-data">
                <div className="stat-value">{stats.totalCommunities}</div>
                <div className="stat-label">Communities</div>
              </div>
            </div>
            <div
              className="stat-card drill-card"
              onClick={() => openDrill('events')}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-icon bg-green">📅</div>
              <div className="stat-data">
                <div className="stat-value">{stats.totalEvents}</div>
                <div className="stat-label">Total Events</div>
              </div>
            </div>
          </div>

          {/* Revenue Overview */}
          <div className="card-header" style={{ marginBottom: '14px', marginTop: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>
              Revenue Overview
            </h3>
          </div>
          <div className="stats-grid">
            <div className="stat-card drill-card" onClick={() => openDrill('revenue')} style={{ cursor: 'pointer' }}>
              <div className="stat-icon bg-green">💰</div>
              <div className="stat-data">
                <div className="stat-value">₹{revenue.totalRevenue.toLocaleString()}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </div>
            <div className="stat-card drill-card" onClick={() => openDrill('revenue')} style={{ cursor: 'pointer' }}>
              <div className="stat-icon bg-purple">📈</div>
              <div className="stat-data">
                <div className="stat-value">₹{revenue.monthlyRevenue.toLocaleString()}</div>
                <div className="stat-label">Monthly Revenue</div>
              </div>
            </div>
            <div className="stat-card drill-card" onClick={() => openDrill('subscriptions')} style={{ cursor: 'pointer' }}>
              <div className="stat-icon bg-cyan">💎</div>
              <div className="stat-data">
                <div className="stat-value">₹{revenue.subscriptionRevenue.toLocaleString()}</div>
                <div className="stat-label">Subscription Revenue</div>
              </div>
            </div>
            <div className="stat-card drill-card" onClick={() => openDrill('revenue')} style={{ cursor: 'pointer' }}>
              <div className="stat-icon bg-orange">🏆</div>
              <div className="stat-data">
                <div className="stat-value">₹{revenue.organiserRevenue.toLocaleString()}</div>
                <div className="stat-label">Organizer Revenue</div>
              </div>
            </div>
            <div className="stat-card drill-card" onClick={() => openDrill('revenue')} style={{ cursor: 'pointer' }}>
              <div className="stat-icon bg-green">📣</div>
              <div className="stat-data">
                <div className="stat-value">₹{revenue.featuredEventRevenue.toLocaleString()}</div>
                <div className="stat-label">Featured Event Revenue</div>
              </div>
            </div>
            <div className="stat-card drill-card" onClick={() => openDrill('subscriptions')} style={{ cursor: 'pointer' }}>
              <div className="stat-icon bg-purple">👑</div>
              <div className="stat-data">
                <div className="stat-value">{revenue.premiumUsers}</div>
                <div className="stat-label">Active Premium Users</div>
              </div>
            </div>
            <div className="stat-card drill-card" onClick={() => openDrill('organisers', 'verified')} style={{ cursor: 'pointer' }}>
              <div className="stat-icon bg-cyan">✅</div>
              <div className="stat-data">
                <div className="stat-value">{revenue.verifiedOrganisers}</div>
                <div className="stat-label">Verified Organizers</div>
              </div>
            </div>
            <div className="stat-card drill-card" onClick={() => openDrill('organisers', 'pending')} style={{ cursor: 'pointer' }}>
              <div className="stat-icon bg-orange">⏳</div>
              <div className="stat-data">
                <div className="stat-value">{revenue.pendingOrganiserApplications}</div>
                <div className="stat-label">Pending Organizer Applications</div>
              </div>
            </div>
          </div>

          {/* Platform Health */}
          <div className="section-grid" style={{ marginTop: '24px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div className="card-header" style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>
                  Platform Health
                </h3>
              </div>
              <div className="health-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div className="health-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <span className="h-dot green" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
                  Backend: <strong className="h-val">{stats.backendStatus}</strong>
                </div>
                <div className="health-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <span className="h-dot green" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
                  Open Reports: <strong className="h-val">{stats.pendingReportsCount}</strong>
                </div>
                <div className="health-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <span className="h-dot green" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
                  Pending Events: <strong className="h-val">{stats.pendingEventsCount}</strong>
                </div>
                <div className="health-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <span className="h-dot green" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
                  Pending Appeals: <strong className="h-val">{stats.pendingAppealsCount}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drill-down modal */}
      {drillModalOpen && (
        <div
          className="modal-overlay"
          style={{ display: 'flex' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDrillModalOpen(false);
          }}
        >
          <div className="modal-container" style={{ width: '640px', maxWidth: '92vw' }}>
            <div className="modal-header">
              <h3>{drillTitle}</h3>
              <button className="modal-x" onClick={() => setDrillModalOpen(false)}>
                ×
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {drillLoading ? (
                <div className="empty-state" style={{ padding: '30px' }}>
                  <div className="empty-state-text">Loading…</div>
                </div>
              ) : (
                drillContent
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
