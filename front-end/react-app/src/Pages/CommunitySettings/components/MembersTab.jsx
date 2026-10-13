import React from 'react';

/**
 * Tab 2: Manage members, role dropdown, and remove action.
 */
export default function MembersTab({ members, onRoleChange, onRemoveMember }) {
  return (
    <section className="settings-tab section active">
      <div className="settings-card">
        <div className="settings-card-title">Members ({members.length})</div>
        <div className="member-list">
          {members.map((m) => (
            <div
              key={m.id}
              className="member-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#6366f1',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '13px',
                  }}
                >
                  {m.initials || m.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{m.handle}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <select
                  value={m.role}
                  onChange={(e) => onRoleChange(m.id, e.target.value)}
                  style={{
                    padding: '4px 8px',
                    background: 'var(--bg-input, rgba(255,255,255,0.05))',
                    border: '1px solid var(--border, rgba(255,255,255,0.1))',
                    borderRadius: '6px',
                    color: 'var(--text-1, #fff)',
                    fontSize: '12px',
                  }}
                >
                  <option value="Owner">Owner</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Member">Member</option>
                </select>
                {m.role !== 'Owner' && (
                  <button
                    className="btn btn-muted"
                    style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--error)' }}
                    onClick={() => onRemoveMember(m.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
