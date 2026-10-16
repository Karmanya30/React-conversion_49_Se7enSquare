import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Communities management table.
 * Suspend/Reinstate call POST /admin/communities/:id/suspend|reinstate
 * via the suspendCommunity / reinstateCommunity props from useAdminCommunities.
 */
export default function CommunitiesTab({ communities, users, suspendCommunity, reinstateCommunity }) {
  const navigate = useNavigate();

  function ownerName(ownerId) {
    const u = (users || []).find((u) => u.id === ownerId);
    return u ? `@${u.username}` : `#${ownerId}`;
  }

  return (
    <div className="admin-page active" id="page-communities">
      <div className="card">
        <div className="table-wrap">
          <table className="admin-data-table">
            <thead>
              <tr>
                {['Community', 'Owner', 'Members', 'Status', 'Actions'].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {communities.length === 0 ? (
                <tr>
                  <td colSpan="5" className="admin-empty-cell">No communities found.</td>
                </tr>
              ) : (
                communities.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="admin-cell-title">{c.name}</div>
                      <div className="admin-cell-sub">{c.description || ''}</div>
                    </td>
                    <td>{ownerName(c.ownerId)}</td>
                    <td>{c.memberCount ?? 0}</td>
                    <td>
                      <span className={`admin-badge-status ${c.status || 'active'}`}>
                        {(c.status || 'active').toUpperCase()}
                      </span>
                      {c.suspendedReason && (
                        <div className="admin-cell-sub" title={c.suspendedReason}>
                          {c.suspendedReason.slice(0, 40)}{c.suspendedReason.length > 40 ? '…' : ''}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="admin-action-btns">
                        <button
                          className="act-btn act-view"
                          onClick={() => navigate(`/community-page/${c.id}`)}
                        >
                          View
                        </button>
                        {c.status === 'suspended' ? (
                          <button
                            className="act-btn act-edit"
                            onClick={() => reinstateCommunity(c.id)}
                          >
                            Reinstate
                          </button>
                        ) : (
                          <button
                            className="act-btn act-delete"
                            onClick={() => suspendCommunity(c.id)}
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
