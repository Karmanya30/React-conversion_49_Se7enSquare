import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getHomeRoute } from '../../../services/roleAccess';

/**
 * Top header bar for the Chat page — back button, brand, search/pin/member toggles, avatar.
 */
export default function ChatHeader({
  communityId,
  user,
  membersCount = 3,
  onToggleSearch,
  onTogglePinned,
  onToggleMembers,
}) {
  const navigate = useNavigate();
  const initials = user?.name ? user.name.split(' ').map(p => p[0]).join('').slice(0, 2) : (user?.initials || 'AK');

  return (
    <header className="header" style={{ flexShrink: 0 }}>
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => communityId ? navigate(`/community/${communityId}`) : navigate(getHomeRoute(user?.role))}
          style={{
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
            color: 'var(--text-secondary,#aaa)', borderRadius: '8px', padding: '6px 14px',
            fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >
          ← Back
        </button>
        <div
          className="header-title"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(getHomeRoute(user?.role))}
        >
          Gameunity
        </div>
      </div>

      <div className="header-actions">
        <div className="hact-btn" id="searchToggleBtn" onClick={onToggleSearch} title="Search Messages">🔍</div>
        <div className="hact-btn" id="pinnedToggleBtn" onClick={onTogglePinned} title="Pinned Messages">📌</div>
        <div className="member-count-chip" id="memberCountChip" onClick={onToggleMembers} title="Members List">
          👥 <span id="onlineCount">{membersCount}</span>
        </div>
        <div className="header-divider" style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 8px' }} />
        <div className="icon-btn" onClick={() => navigate('/profile-settings')}>
          <div className="header-avatar user-avatar">{initials}</div>
        </div>
      </div>
    </header>
  );
}
