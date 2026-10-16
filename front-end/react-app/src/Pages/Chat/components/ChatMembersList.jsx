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
            <div key={m.name} className="mem-row">
              <div className="m-av" style={{ background: m.color || '#6366f1' }}>
                {m.initials || m.name.split(' ').map(p => p[0]).join('').slice(0, 2)}
                <span className="m-stat" style={{ background: '#10b981' }} />
              </div>
              <div className="m-info">
                <div className="m-name">{m.name}</div>
                <span className={`m-role-tag ${String(m.role || 'user').toLowerCase()}-c`}>{m.role || 'Member'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
