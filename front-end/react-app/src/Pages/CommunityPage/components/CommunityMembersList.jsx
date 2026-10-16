import React from 'react';
import { useNavigate } from 'react-router-dom';
import { initialsFromName } from '../../../Components/platform/hooks/useCommunityPage';

/**
 * Members tab: search bar, grouped member rows (Owner, Moderators, Members)
 * with role-coloured avatars, initials, and report button.
 */
export default function CommunityMembersList({
  members, filteredMembers, memberSearch, onMemberSearchChange,
}) {
  const navigate = useNavigate();

  return (
    <div className="tab-content active" id="tab-members">
      <div className="members-layout">
        <div className="members-search">
          <span className="members-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search members…"
            value={memberSearch}
            onChange={e => onMemberSearchChange(e.target.value)}
          />
        </div>
        <div className="members-groups" id="membersContainer">
          {members === null ? (
            <div style={{ padding: '20px', color: 'var(--text-muted,#666)', fontSize: '13px' }}>Loading members…</div>
          ) : filteredMembers.length === 0 ? (
            <div style={{ padding: '20px', color: 'var(--text-muted,#666)', fontSize: '13px' }}>
              {members.length ? 'No members match your search.' : 'No members yet.'}
            </div>
          ) : (
            ['owner', 'moderator', 'member'].map(roleGroup => {
              const groupMembers = filteredMembers.filter(m => m.role === roleGroup);
              if (groupMembers.length === 0) return null;
              return (
                <div key={roleGroup}>
                  <div className="members-group-title" style={{ fontSize: '11px', color: 'var(--text-3,#666)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', padding: '16px 0 8px' }}>
                    {roleGroup === 'owner' ? '👑 Owner' : roleGroup === 'moderator' ? '🛡️ Moderators' : '👥 Members'} — {groupMembers.length}
                  </div>
                  {groupMembers.map(m => (
                    <div key={`${roleGroup}-${m.userId}`} className="member-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border,rgba(255,255,255,0.04))' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: m.role === 'owner' ? '#f59e0b' : m.role === 'moderator' ? '#6366f1' : '#374151', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>
                        {m.avatar ? <img src={m.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : initialsFromName(m.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-1,#fff)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {m.name}
                          {m.status && m.status !== 'active' && (
                            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: m.status === 'banned' ? '#ef4444' : '#f59e0b', color: '#fff', textTransform: 'uppercase', fontWeight: 700 }}>
                              {m.status}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-3,#666)' }}>Member #{m.userId}</div>
                      </div>
                      <div style={{ marginLeft: 'auto' }}>
                        <button
                          onClick={() => navigate(`/report?user=${m.userId}&uname=${encodeURIComponent(m.name)}`)}
                          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-3,#666)', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', cursor: 'pointer' }}
                        >
                          🚩
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
