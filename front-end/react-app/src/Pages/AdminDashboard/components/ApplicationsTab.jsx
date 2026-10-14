import React from 'react';

/**
 * Organizer and Moderator application verification tables.
 */
export default function ApplicationsTab({
  organizerApps,
  moderatorApps,
  onOrganizerApp,
  onModeratorApp,
}) {
  return (
    <div className="admin-page active" id="page-applications">
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <h3 style={{ margin: 0 }}>🏆 Organizer Applications</h3>
        </div>
        <div className="table-wrap">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Experience Note</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizerApps.map((app) => (
                <tr key={app.id}>
                  <td><strong>@{app.user}</strong></td>
                  <td style={{ fontSize: '13px', color: 'var(--text-secondary,#ccc)' }}>{app.experience}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-3,#666)' }}>{app.applied}</td>
                  <td>
                    <span className={`admin-badge-status ${app.status}`}>
                      {app.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {app.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="act-btn act-restore" onClick={() => onOrganizerApp(app.id, 'approved')}>
                          Approve
                        </button>
                        <button className="act-btn act-delete" onClick={() => onOrganizerApp(app.id, 'rejected')}>
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-3,#666)' }}>Decision saved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 style={{ margin: 0 }}>🛡️ Moderator Applications</h3>
        </div>
        <div className="table-wrap">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Quiz Score</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {moderatorApps.map((app) => (
                <tr key={app.id}>
                  <td><strong>@{app.user}</strong></td>
                  <td>
                    <span className="admin-badge-score">{app.quizScore}</span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-3,#666)' }}>{app.applied}</td>
                  <td>
                    <span className={`admin-badge-status ${app.status}`}>
                      {app.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {app.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="act-btn act-restore" onClick={() => onModeratorApp(app.id, 'approved')}>
                          Approve
                        </button>
                        <button className="act-btn act-delete" onClick={() => onModeratorApp(app.id, 'rejected')}>
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-3,#666)' }}>Decision saved</span>
                    )}
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
