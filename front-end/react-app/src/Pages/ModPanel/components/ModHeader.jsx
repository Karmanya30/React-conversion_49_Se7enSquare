import React from 'react';

/**
 * ModPanel top header - modern premium design.
 * Logo icon, title, MOD badge, community chip, notification bell, avatar.
 */
export default function ModHeader({ user, navigate }) {
  return (
    <header className="mp-header">
      <div className="mp-header-left">
        <div className="mp-logo-icon">🛡️</div>
        <div className="mp-header-title">Mod Panel</div>
        <div className="mp-mod-badge">
          <span>⚡</span>
          <span>MODERATOR</span>
        </div>
        <div className="mp-comm-chip" id="activeCommChip">
          <span id="activeCommIcon">🌐</span>
          <span id="activeCommName">{user.communityName || 'Platform Moderation'}</span>
        </div>
      </div>

      <div className="mp-header-right">
        <div className="mp-icon-btn" title="Notifications">
          🔔
          <span className="mp-notif-dot" />
        </div>
        <div
          className="mp-avatar"
          title="Profile Settings"
          onClick={() => navigate('/profile-settings')}
        >
          {user.firstName.slice(0, 2).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
