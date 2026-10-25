import React from 'react';

/**
 * Open appeals cards with Approve and Reject actions.
 */
export default function AppealsTab({ appeals, onAppeal }) {
  const appealsList = appeals || [];

  return (
    <div className="admin-page active" id="page-appeals">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontFamily: "'Syne',sans-serif", color: '#fff' }}>
            Open Appeals Queue
          </h3>
          <div style={{ fontSize: '12px', color: '#8b949e', marginTop: '4px' }}>
            User appeals contesting moderation sanctions, suspensions, and account bans
          </div>
        </div>
        <span className="admin-users-count-badge">
          {appealsList.length} {appealsList.length === 1 ? 'appeal' : 'appeals'}
        </span>
      </div>

      {appealsList.length === 0 ? (
        <div
          className="admin-card-container"
          style={{ textAlign: 'center', padding: '48px 20px', color: '#8b949e' }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚖️</div>
          <div style={{ fontWeight: 600, color: '#fff', fontSize: '15px' }}>No appeals pending</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>There are currently no active user appeals awaiting decision.</div>
        </div>
      ) : (
        appealsList.map((ap) => {
          const isPending = !ap.status || ap.status === 'pending';
          const statementText = ap.statement || ap.text;
          const appealType = ap.appealType || ap.resolution || ap.reason || 'Account Sanction Appeal';

          return (
            <div key={ap.id} className="admin-appeal-row-card">
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0,
                  boxShadow: '0 2px 10px rgba(168, 85, 247, 0.25)',
                }}
              >
                ⚖️
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '15px', color: '#fff' }}>
                  Appeal #{ap.id}
                  {ap.username && (
                    <span style={{ marginLeft: '8px', color: '#cbd5e1', fontSize: '13px', fontWeight: 500 }}>
                      by @{ap.username}
                    </span>
                  )}
                  {ap.actionId && (
                    <span style={{ marginLeft: '8px', color: '#8b949e', fontSize: '12px', fontWeight: 400 }}>
                      ({ap.actionId})
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12.5px', color: '#8b949e', marginTop: '4px' }}>
                  {appealType}
                </div>
                {statementText && (
                  <div
                    style={{
                      marginTop: '8px',
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '6px',
                      fontSize: '12.5px',
                      color: '#cbd5e1',
                    }}
                  >
                    "{statementText}"
                  </div>
                )}
                {ap.acknowledgement && (
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
                    ✓ {ap.acknowledgement}
                  </div>
                )}
              </div>
              <span className={'admin-status-pill ' + (ap.status === 'approved' ? 'active' : ap.status === 'rejected' ? 'banned' : 'suspended')}>
                <span className="admin-status-dot"></span>
                {(ap.status || 'PENDING').toUpperCase()}
              </span>
              {isPending ? (
                <div className="admin-action-btn-group">
                  <button
                    className="admin-btn-action btn-success"
                    onClick={() => onAppeal(ap.id, 'approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="admin-btn-action btn-danger"
                    onClick={() => onAppeal(ap.id, 'rejected')}
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <span style={{ fontSize: '12px', color: '#8b949e' }}>Resolved</span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
