import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * OwnerDashboard header: icon, title, OWNER badge, avatar link.
 */
export default function OwnerHeader() {
  const navigate = useNavigate();

  return (
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
  );
}
