import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Header matching commit HEAD for Admin Dashboard.
 */
export default function AdminHeader({ currentPage, globalSearch, setGlobalSearch, adminUser }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-icon" id="page-icon">
          {currentPage?.icon || '⚡'}
        </div>
        <h1 className="header-title" id="page-title">
          {currentPage?.title || 'System Overview'}
        </h1>
        <span className="header-badge">ADMIN</span>
      </div>
      <div className="header-right">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search anything..."
            id="globalSearch"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>
        <div
          className="header-avatar user-avatar"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/profile-settings')}
          title="Profile Settings"
        >
          {(adminUser.firstName || 'A').slice(0, 2).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
