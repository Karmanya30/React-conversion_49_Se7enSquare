import React from 'react';

/**
 * User Management page header — icon, title, ADMIN badge, back-to-dashboard button, avatar.
 */
export default function UserHeader({ navigate }) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-icon">👤</div>
        <h1 className="header-title">User Management</h1>
        <span className="header-badge">ADMIN</span>
      </div>
      <div className="header-right">
        <button className="btn-ghost" onClick={() => navigate('/admin-dashboard')}>
          Admin Dashboard
        </button>
        <div
          className="header-avatar user-avatar"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/profile-settings')}
          title="Profile &amp; Settings"
        >
          AD
        </div>
      </div>
    </header>
  );
}
