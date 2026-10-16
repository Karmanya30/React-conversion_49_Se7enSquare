import React from 'react';

/**
 * Right member sidebar — lists online members with their role badge and status dot.
 */
export default function ChatMembersList({ members = [], onHide }) {
  return (
    <aside className="mem-sidebar" id="memberSidebar">
      <div className="mem-header">
        <div className="mem-title">
          <span className="mem-title-text">Members</span>
          <div className="mem-toggle-area">
            <span className="online-count">{members.length}</span>
            <button type="button" className="mem-toggle-btn" onClick={onHide} title="Toggle Sidebar">
              <span className="toggle-icon">❯</span>
            </button>
          </div>
        </div>
      </div>
      <div className="mem-list">
        <div className="mem-group-title">MEMBERS — {members.length}</div>
        {members.length === 0 ? (
          <div style={{ padding: '20px 12px', color: 'var(--text-3,#888)', fontSize: '13px', textAlign: 'center' }}>
            No members found.
          </div>
        ) : (
          members.map(m => (
            <div key={m.userId} className="mem-row">
              <div className="m-av" style={{ background: m.color || '#6366f1' }}>
                {m.avatar ? <img src={m.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : (m.initials || m.name.slice(0, 2))}
              </div>
              <div className="m-info">
                <div className="m-name">{m.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className={`m-role-tag ${String(m.role || 'user').toLowerCase()}-c`}>{m.role || 'Member'}</span>
                  {m.status && m.status !== 'active' && (
                    <span
                      style={{
                        fontSize: '9px',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        background: m.status === 'banned' ? '#ef4444' : '#f59e0b',
                        color: '#fff',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      {m.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
