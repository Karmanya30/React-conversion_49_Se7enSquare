import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Communities list and moderation management table.
 */
export default function CommunitiesTab({ communities, setCommunities, addAuditLog, showToast }) {
  const navigate = useNavigate();

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
              {communities.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{c.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3,#666)' }}>{c.desc}</div>
                  </td>
                  <td>@{c.owner}</td>
                  <td>{c.members} members</td>
                  <td>
                    <span className={`admin-badge-status ${c.status || 'active'}`}>
                      {(c.status || 'ACTIVE').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="act-btn act-view"
                        onClick={() => navigate(`/community-page?id=${c.id}`)}
                      >
                        View
                      </button>
                      <button
                        className="act-btn act-delete"
                        onClick={() => {
                          const newStatus = c.status === 'suspended' ? 'active' : 'suspended';
                          setCommunities((prev) =>
                            prev.map((item) => (item.id === c.id ? { ...item, status: newStatus } : item))
                          );
                          addAuditLog(
                            `${newStatus === 'suspended' ? 'Suspended' : 'Restored'} community: ${c.name}`,
                            'community'
                          );
                          showToast(`Community ${newStatus}`);
                        }}
                      >
                        {c.status === 'suspended' ? 'Restore' : 'Suspend'}
                      </button>
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
