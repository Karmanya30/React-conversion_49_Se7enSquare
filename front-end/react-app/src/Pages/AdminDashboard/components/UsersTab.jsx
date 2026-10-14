import React from 'react';

/**
 * User management table with search, role filters, inline role editing, ban, and password reset.
 */
export default function UsersTab({
  userSearch,
  setUserSearch,
  userRoleFilter,
  setUserRoleFilter,
  filteredUsers,
  editingUser,
  setEditingUser,
  updateUserRole,
  suspendUser,
  banUser,
  resetPassword,
}) {
  return (
    <div className="admin-page active" id="page-users">
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Search users..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px', padding: '9px 14px', background: 'var(--bg-card,#151d2f)', border: '1px solid var(--border,rgba(255,255,255,0.08))', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
        />
        <select
          value={userRoleFilter}
          onChange={(e) => setUserRoleFilter(e.target.value)}
          style={{ padding: '9px 14px', background: 'var(--bg-card,#151d2f)', border: '1px solid var(--border,rgba(255,255,255,0.08))', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
          <option value="community_manager">Community Manager</option>
          <option value="organizer">Organizer</option>
          <option value="moderator">Moderator</option>
          <option value="user">User</option>
        </select>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table className="admin-data-table">
            <thead>
              <tr>
                {['User', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>
                        {(u.name || u.username).slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>{u.name || u.username}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-3,#666)' }}>@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--text-3,#aaa)' }}>{u.email}</td>
                  <td>
                    {editingUser === u.id ? (
                      <select
                        defaultValue={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value)}
                        style={{ padding: '4px 8px', background: 'var(--bg-card,#151d2f)', border: '1px solid #6366f1', borderRadius: '6px', color: '#fff', fontSize: '12px' }}
                      >
                        {['user', 'moderator', 'community_manager', 'organizer', 'admin', 'owner'].map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="admin-badge-role">
                        {u.role?.toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`admin-badge-status ${u.status}`}>
                      {(u.status || 'active').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button
                        className="act-btn act-edit"
                        onClick={() => setEditingUser(editingUser === u.id ? null : u.id)}
                      >
                        {editingUser === u.id ? 'Cancel' : 'Edit Role'}
                      </button>
                      <button
                        className="act-btn act-view"
                        onClick={() => resetPassword(u.username)}
                      >
                        Reset PW
                      </button>
                      {u.status !== 'suspended' && u.status !== 'banned' && u.id !== 1 && (
                        <button
                          className="act-btn act-delete"
                          onClick={() => suspendUser(u.id)}
                        >
                          Suspend
                        </button>
                      )}
                      {u.status !== 'banned' && u.id !== 1 && (
                        <button
                          className="act-btn act-delete"
                          style={{ background: '#7f1d1d', borderColor: '#ef4444', color: '#fca5a5' }}
                          onClick={() => banUser(u.id, u.username)}
                        >
                          Ban
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
