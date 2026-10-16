import React from 'react';
import SideBar from '../Components/SideBar';
import useDashboard from '../Components/platform/hooks/useDashboard';
import '../styles/global.css';
import '../styles/sidebar.css';
import '../styles/dashboard.css';

/**
 * Dashboard Page Component
 * Converted from dashboard.html, preserving all styles and widgets.
 * Architecture: UI/presentation layer orchestrating useDashboard() hook and dashboardService.
 */
export default function Dashboard() {
  const {
    navigate,
    user,
    greeting,
    communities,
    notifications,
    events,
    stats,
    unreadCount,
    searchQuery,
    searchResults,
    showSearch,
    setShowSearch,
    handleSearch,
    markAllRead,
    loading,
  } = useDashboard();

  return (
    <div className="app-shell">
      <SideBar />
      <div className="main">
        {/* Header */}
        <header className="header">
          <div className="header-title">Home</div>
          <div className="header-search" style={{ position: 'relative' }}>
            <span>🔍</span>
            <input
              type="text"
              id="dashSearchInput"
              placeholder="Search communities, people, events…"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              onFocus={() => searchQuery && setShowSearch(true)}
            />
            {showSearch && searchResults.length > 0 && (
              <div
                id="dashSearchResults"
                style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px',
                  background: 'var(--bg-card,#151d2f)', border: '1px solid var(--border,rgba(255,255,255,0.08))',
                  borderRadius: '10px', boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
                  maxHeight: '360px', overflowY: 'auto', zIndex: 50,
                }}
              >
                {searchResults.map((r, i) => (
                  <div
                    key={i}
                    style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseDown={() => {
                      if (r.type === 'community') navigate('/discovery');
                      else navigate('/events');
                    }}
                  >
                    <span>{r.icon}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary,#aaa)' }}>{r.label}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-3,#666)', textTransform: 'uppercase' }}>{r.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="header-actions">
            <button
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px', marginRight: '12px' }}
              onClick={() => navigate('/create-community')}
            >
              + Create Community
            </button>
            <div className="icon-btn" id="headerNotif" data-tooltip="Notifications">
              🔔
              {unreadCount > 0 && <div className="notif-dot"></div>}
            </div>
            <div
              className="header-avatar user-avatar"
              id="headerProfile"
              data-tooltip="Profile"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/profile-settings')}
            >
              {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="content">
          {/* Greeting Banner */}
          <div className="greeting">
            <div className="greeting-text">
              <div className="greeting-name">
                {greeting}, <span className="user-name">{user.firstName}</span> 👋
              </div>
              <div className="greeting-sub">
                You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''} and {events.length} upcoming event{events.length !== 1 ? 's' : ''} today.
              </div>
            </div>
            <div className="greeting-stats">
              <div className="g-stat">
                <div className="g-stat-val">{stats?.totalCommunities ?? communities.length}</div>
                <div className="g-stat-label">Communities</div>
              </div>
              <div className="g-stat">
                <div className="g-stat-val">{unreadCount}</div>
                <div className="g-stat-label">Messages</div>
              </div>
              <div className="g-stat">
                <div className="g-stat-val">{stats?.totalEvents ?? events.length}</div>
                <div className="g-stat-label">Events</div>
              </div>
            </div>
          </div>

          {/* Joined Communities */}
          <div>
            <div className="section-header">
              <div className="section-title">Joined Communities</div>
              <div
                className="section-link"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/discovery')}
              >
                View all →
              </div>
            </div>
            {loading ? (
              <div style={{ color: 'var(--text-3,#666)', fontSize: '13px', padding: '20px 0' }}>Loading communities…</div>
            ) : (
              <div className="communities-scroll">
                {communities.map((comm) => (
                  <div
                    key={comm.id}
                    className="comm-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/community-page?id=${comm.id}`)}
                  >
                    <div className="comm-card-banner banner-purple"></div>
                    <div className="comm-card-icon grad-purple">{comm.icon || '🏘️'}</div>
                    <div className="comm-card-name">{comm.name}</div>
                    <div className="comm-card-meta">
                      <span>{(comm.members || comm.memberCount || 0).toLocaleString()} members</span>
                    </div>
                  </div>
                ))}
                <div
                  className="comm-card create-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/create-community')}
                >
                  <div style={{ fontSize: '24px', color: 'var(--accent)', marginBottom: '4px' }}>+</div>
                  <div className="comm-card-name" style={{ marginTop: 0 }}>Create Community</div>
                  <div className="comm-card-meta">Start your journey</div>
                </div>
              </div>
            )}
          </div>

          {/* Two Column: Notifications + Events */}
          <div className="two-col">
            {/* Notifications */}
            <div className="section-box">
              <div className="section-header">
                <div className="section-title">🔔 Recent Notifications</div>
                <div className="section-link" style={{ cursor: 'pointer' }} onClick={markAllRead}>
                  Mark all read
                </div>
              </div>
              <div className="notif-list" id="notif-list-container">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notif-item${n.read ? ' read' : ''}`}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '12px',
                      padding: '12px 0', borderBottom: '1px solid var(--border,rgba(255,255,255,0.05))',
                      opacity: n.read ? 0.6 : 1,
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{n.icon}</span>
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary,#ccc)' }}>{n.text}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-3,#666)', marginTop: '3px' }}>{n.time}</div>
                    </div>
                    {!n.read && (
                      <div style={{ marginLeft: 'auto', width: '7px', height: '7px', borderRadius: '50%', background: '#6366f1', flexShrink: 0, marginTop: '4px' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="section-header">
                <div className="section-title">📅 Upcoming Events</div>
                <div className="section-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/events')}>
                  View all →
                </div>
              </div>
              <div className="event-list">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="event-item"
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '12px',
                      padding: '12px 0', borderBottom: '1px solid var(--border,rgba(255,255,255,0.05))',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate('/events')}
                  >
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '20px', flexShrink: 0,
                    }}>
                      {ev.type}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1,#fff)' }}>{ev.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3,#666)', marginTop: '3px' }}>
                        {ev.community} · {ev.date} {ev.time && `· ${ev.time}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
