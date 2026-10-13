import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Report Header matching commit 0cc099a.
 */
export default function ReportHeader({ userInitials }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="breadcrumb">
        <span>Pro Gamers</span>
        <span className="sep">›</span>
        <span>#general</span>
        <span className="sep">›</span>
        <span className="current">🚩 Report Content</span>
      </div>
      <div className="header-actions">
        <div className="icon-btn">
          🔔<div className="notif-dot"></div>
        </div>
        <div
          className="header-avatar user-avatar"
          style={{ cursor: 'pointer' }}
          title="Profile Settings"
          onClick={() => navigate('/profile-settings')}
        >
          {userInitials}
        </div>
      </div>
    </header>
  );
}
