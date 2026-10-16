import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { getHomeRoute } from '../../../services/roleAccess';

/**
 * Topbar header for Community Settings.
 */
export default function CommunityHeader({ community, communityId, onAddChannel }) {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="brand" onClick={() => navigate(getHomeRoute(user?.role))} style={{ cursor: 'pointer' }}>
          <div className="brand-mark">G</div>
          <div className="brand-name">Gameunity</div>
        </div>
        <div className="community-title">
          <div className="community-mark">{community.name?.[0] || 'C'}</div>
          <span>{community.name}</span>
        </div>
      </div>

      <div className="topbar-actions">
        <button
          className="back-btn"
          onClick={() => navigate(`/community-page?id=${communityId}`)}
        >
          &larr; Back to Community
        </button>
        <button className="btn btn-primary" onClick={onAddChannel}>
          Add Channel
        </button>
        <div
          className="profile-avatar user-avatar"
          onClick={() => navigate('/profile-settings')}
          style={{ cursor: 'pointer' }}
          title="Profile Settings"
        />
      </div>
    </header>
  );
}
