import React from 'react';

/**
 * Open appeals cards with Approve and Reject actions.
 */
export default function AppealsTab({ appeals, onAppeal }) {
  const appealsList = appeals.length > 0 ? appeals : [
    { id: 1, appealType: 'Misunderstanding', status: 'pending', userId: 3 },
  ];

  return (
    <div className="admin-page active" id="page-appeals">
      <h3 style={{ fontFamily: "'Syne',sans-serif", marginBottom: '16px' }}>Open Appeals</h3>
      {appealsList.map((ap) => (
        <div
          key={ap.id}
          className="card"
          style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}
        >
          <span style={{ fontSize: '20px' }}>⚖️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>Appeal #{ap.id}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-3,#666)', marginTop: '3px' }}>
              {ap.appealType || 'General Appeal'}
            </div>
          </div>
          <span style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '3px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 700 }}>
            {(ap.status || 'PENDING').toUpperCase()}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onAppeal(ap.id, 'approved')}
              style={{ padding: '6px 12px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '6px', color: '#34d399', fontSize: '12px', cursor: 'pointer' }}
            >
              Approve
            </button>
            <button
              onClick={() => onAppeal(ap.id, 'rejected')}
              style={{ padding: '6px 12px', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '6px', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
