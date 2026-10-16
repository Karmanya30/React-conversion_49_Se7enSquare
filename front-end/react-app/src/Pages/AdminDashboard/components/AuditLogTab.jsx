import React from 'react';

/**
 * Full security audit log table.
 */
export default function AuditLogTab({ auditLog }) {
  return (
    <div className="admin-page active" id="page-audit">
      <h3 style={{ fontFamily: "'Syne',sans-serif", marginBottom: '16px' }}>Audit Log</h3>
      <div className="card">
        <div className="table-wrap">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Admin</th>
                <th>Type</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-3, #888)' }}>
                    No audit log records found.
                  </td>
                </tr>
              ) : (
                auditLog.map((entry) => (
                  <tr key={entry.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-1,#fff)', fontSize: '13px' }}>
                        {entry.action}
                      </div>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-secondary,#ccc)', fontSize: '12px' }}>@{entry.admin}</span>
                    </td>
                    <td>
                      <span className="admin-badge-role">{entry.type}</span>
                    </td>
                    <td style={{ color: 'var(--text-3,#666)', fontSize: '12px' }}>{entry.time}</td>
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
