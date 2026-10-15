import React from 'react';
import { useNavigate } from 'react-router-dom';
import { memberCountOf, onlineCountOf } from '../../../Components/platform/data/discoveryData';

/**
 * Individual community card: banner, icon, name, stats, tags, and Join/Leave button.
 */
export default function CommunityCard({ comm, isJoined, onToggleJoin }) {
  const navigate = useNavigate();

  return (
    <div
      className="comm-card"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/community/${comm.id}`)}
    >
      <div className="cc-banner" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))' }}>
        <div className="cc-icon">{comm.icon || '🏘️'}</div>
      </div>
      <div className="cc-body">
        <div className="cc-name">{comm.name}</div>
        <div className="cc-meta">
          <span className="cc-members">👥 {memberCountOf(comm).toLocaleString()} members</span>
          {onlineCountOf(comm) > 0 && <span className="cc-online">🟢 {onlineCountOf(comm).toLocaleString()} online</span>}
        </div>
        {comm.category && (
          <div style={{ fontSize: '11.5px', color: 'var(--text-3,#888)', marginTop: '4px' }}>
            📁 {comm.category}
          </div>
        )}
        <div className="cc-desc">{comm.description}</div>
        {comm.tags && (
          <div className="cc-tags">
            {comm.tags.slice(0, 3).map(t => (
              <span key={t} className="cc-tag">{t}</span>
            ))}
          </div>
        )}
        <button
          className={`cc-join-btn${isJoined ? ' joined' : ''}`}
          onClick={e => onToggleJoin(comm.id, e)}
          style={{
            marginTop: '12px', width: '100%', padding: '8px',
            borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: isJoined ? 'rgba(99,102,241,0.15)' : '#6366f1',
            color: isJoined ? '#818cf8' : '#fff',
            fontWeight: 600, fontSize: '13px', transition: 'all 0.2s',
          }}
        >
          {isJoined ? '✓ Joined' : 'Join'}
        </button>
      </div>
    </div>
  );
}
