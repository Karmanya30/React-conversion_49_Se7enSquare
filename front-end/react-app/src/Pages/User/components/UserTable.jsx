import React from 'react';
import { ROLE_BADGE_CLASS } from '../../../Components/platform/data/userData';

/**
 * User data table — rows with avatar initials, username, email, role badge, and Manage action button.
 */
export default function UserTable({ loading, filteredUsers, navigate }) {
  return (
    <div
      className="table-wrap"
      style={{ background: 'var(--bg-2, #111118)', borderRadius: '14px', border: '1px solid var(--border, rgba(255,255,255,0.06))', overflow: 'hidden' }}
    >
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '80px' }}>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody id="userTable">
          {loading ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '28px', color: 'var(--text-3, #888)' }}>
                Loading users…
              </td>
            </tr>
          ) : filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '28px', color: 'var(--text-3, #888)' }}>
                No matching users found.
              </td>
            </tr>
          ) : (
            filteredUsers.map(u => (
              <tr key={u.id}>
                <td style={{ color: 'var(--text-3, #666)', fontFamily: 'monospace' }}>#{u.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'linear-gradient(135deg, #5b6ef5, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: '12px', flexShrink: 0,
                      }}
                    >
                      {u.username?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="row-name">@{u.username}</div>
                  </div>
                </td>
                <td style={{ color: 'var(--text-2, #aaa)' }}>{u.email}</td>
                <td>
                  <span className={`badge ${ROLE_BADGE_CLASS[u.role] || 'badge-active'}`}>
                    {u.role}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button
                      className="act-btn act-view"
                      onClick={() => navigate('/admin-dashboard')}
                      title="Inspect in Admin Overview"
                    >
                      Manage
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
