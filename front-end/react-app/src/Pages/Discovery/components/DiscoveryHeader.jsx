import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Discovery page top header bar only: title, notification bell, avatar link.
 * The hero/search section lives inside .content in Discovery.jsx.
 */
export default function DiscoveryHeader() {
  const navigate = useNavigate();

  return (
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
  );
}
