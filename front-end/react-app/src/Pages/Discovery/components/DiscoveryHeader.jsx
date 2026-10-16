import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Discovery page header: title, notification bell, avatar link.
 * Search hero section with stats bar and load-warning banner.
 */
export default function DiscoveryHeader({
  search, onSearchChange,
  communities, totalMembers, totalOnline, eventCount,
  loadWarning,
}) {
  const navigate = useNavigate();
  const fmtStat = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

  return (
    <>
      <header className="header">
        <div className="header-title">Discover Communities</div>
        <div className="header-actions">
          <div className="icon-btn">🔔<div className="notif-dot"></div></div>
          <div
            className="header-avatar user-avatar"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/profile-settings')}
          />
        </div>
      </header>

      <div className="hero">
        <div className="hero-title">
          Find your next <span>community</span>
        </div>
        <div className="hero-sub">Browse communities across every interest, topic, and niche.</div>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            id="searchInput"
            type="text"
            placeholder="Search by name, topic, or keyword…"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />
          <span className="search-kbd">⌘K</span>
          <button className="search-btn" onClick={() => {}}>Search</button>
        </div>
        <div className="hero-stats">
          <div className="h-stat">🏘️ <strong>{communities.length.toLocaleString()}</strong>&nbsp;communities</div>
          <div className="h-stat">👥 <strong>{fmtStat(totalMembers)}</strong>&nbsp;members</div>
          <div className="h-stat">🟢 <strong>{totalOnline.toLocaleString()}</strong>&nbsp;online now</div>
          <div className="h-stat">📅 <strong>{eventCount !== null ? eventCount.toLocaleString() : '—'}</strong>&nbsp;events scheduled</div>
        </div>
      </div>

      {loadWarning && (
        <div style={{
          margin: '10px 32px 0', padding: '10px 14px', fontSize: '13px',
          background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)',
          borderRadius: '10px', color: '#fbbf24',
        }}>
          ⚠️ {loadWarning}
        </div>
      )}
    </>
  );
}
