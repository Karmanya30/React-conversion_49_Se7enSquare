import React from 'react';

/**
 * ModPanel top header — title, MOD badge, community chip, notification bell, avatar.
 */
export default function ModHeader({ user, navigate }) {
  return (
    <header className="header">
      <div className="header-title">Mod Panel</div>
      <div className="mod-badge">MOD PANEL</div>
      <div className="comm-chip" id="activeCommChip">
        <span id="activeCommIcon">⚡</span>
        <span id="activeCommName">Pro Gamers</span>
      </div>
      <div className="header-actions">
        <div className="icon-btn">🔔</div>
        <div
          className="header-avatar user-avatar"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/profile-settings')}
        >
          {user.firstName.slice(0, 2).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
