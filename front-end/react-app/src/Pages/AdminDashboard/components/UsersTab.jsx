import React from 'react';

/**
 * User management table with search, role filters, inline role editing,
 * suspension, permanent ban, and reinstatement.
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
  reinstateUser,
  adminUser,
}) {
  return (
    <div className="admin-page active" id="page-users">
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Search users..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '9px 14px',
            background: 'var(--bg-card,#151d2f)',
            border: '1px solid var(--border,rgba(255,255,255,0.08))',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '13px',
          }}
        />
        <select
          value={userRoleFilter}
          onChange={(e) => setUserRoleFilter(e.target.value)}
          style={{
            padding: '9px 14px',
            background: 'var(--bg-card,#151d2f)',
            border: '1px solid var(--border,rgba(255,255,255,0.08))',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '13px',
          }}
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="admin-empty-cell" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-3, #888)' }}>
                    No users match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrentAdmin = u.id === adminUser?.id;
                  const isSuspendedOrBanned = u.status === 'suspended' || u.status === 'banned';

                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: '#6366f1',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '12px',
                              flexShrink: 0,
                            }}
                          >
                            {(u.name || u.username).slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>
                              {u.name || u.username}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-3,#666)' }}>
                              @{u.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--text-3,#aaa)' }}>{u.email}</td>
                      <td>
                        {editingUser === u.id ? (
                          <select
                            defaultValue={u.role}
                            onChange={(e) => updateUserRole(u.id, e.target.value)}
                            style={{
                              padding: '4px 8px',
                              background: 'var(--bg-card,#151d2f)',
                              border: '1px solid #6366f1',
                              borderRadius: '6px',
                              color: '#fff',
                              fontSize: '12px',
                            }}
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
                        <span className={`admin-badge-status ${u.status || 'active'}`}>
                          {(u.status || 'active').toUpperCase()}
                        </span>
                        {u.statusReason && (
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'var(--text-3, #fca5a5)',
                              marginTop: '4px',
                              maxWidth: '180px',
                            }}
                            title={u.statusReason}
                          >
                            {u.statusReason.length > 40
                              ? `${u.statusReason.slice(0, 40)}…`
                              : u.statusReason}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button
                            className="act-btn act-edit"
                            onClick={() => setEditingUser(editingUser === u.id ? null : u.id)}
                            disabled={isCurrentAdmin}
                          >
                            {editingUser === u.id ? 'Cancel' : 'Edit Role'}
                          </button>

                          {isSuspendedOrBanned ? (
                            <button
                              className="act-btn act-edit"
                              style={{ background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.3)', color: '#34d399' }}
                              onClick={() => reinstateUser(u.id)}
                            >
                              Reinstate
                            </button>
                          ) : (
                            <>
                              {!isCurrentAdmin && (
                                <>
                                  <button
                                    className="act-btn act-delete"
                                    onClick={() => suspendUser(u.id)}
                                  >
                                    Suspend
                                  </button>
                                  <button
                                    className="act-btn act-delete"
                                    style={{ background: '#7f1d1d', borderColor: '#ef4444', color: '#fca5a5' }}
                                    onClick={() => banUser(u.id)}
                                  >
                                    Ban
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
