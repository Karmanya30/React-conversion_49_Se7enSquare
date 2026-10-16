import React from 'react';

/**
 * Right panel — queue overview stats and recent actions list.
 * Also renders the action buttons panel when a report is selected and unresolved.
 */
export default function ModActionPanel({
  selectedReport,
  MOD_ACTIONS,
  processing,
  onTakeAction,
  onMoveToReview,
  queueCounts,
  recentActions,
}) {
  return (
    <>
      {/* Action buttons for selected unresolved report */}
      {selectedReport && selectedReport.status !== 'resolved' && (
        <div className="actions-panel" style={{ marginBottom: '0' }}>
          <div className="ap-title">Take Action</div>
          {selectedReport.status === 'pending' && (
            <button
              className="ap-btn ap-btn-review"
              onClick={() => onMoveToReview(selectedReport.id)}
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', marginBottom: '12px', width: '100%' }}
            >
              📋 Move to In Review
            </button>
          )}
          <div className="actions-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {MOD_ACTIONS.map(({ label, action }) => (
              <button
                key={action}
                className={`ap-btn${action === 'ban_perm' ? ' ap-btn-danger' : action === 'dismiss' ? ' ap-btn-dismiss' : ''}`}
                onClick={() => onTakeAction(label, selectedReport.id)}
                disabled={processing}
                style={{
                  padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border,rgba(255,255,255,0.08))',
                  background: action === 'ban_perm' ? 'rgba(255,68,68,0.1)' : action === 'dismiss' ? 'rgba(52,211,153,0.1)' : 'var(--bg-card,#151d2f)',
                  color: action === 'ban_perm' ? '#f87171' : action === 'dismiss' ? '#34d399' : 'var(--text-secondary,#ccc)',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats panel */}
      <div className="stats-panel">
        <div className="sp-title">Queue Overview</div>
        {[
          { label: 'Pending',   count: queueCounts.pending  || 0, color: '#f59e0b' },
          { label: 'In Review', count: queueCounts.review   || 0, color: '#6366f1' },
          { label: 'Resolved',  count: queueCounts.resolved || 0, color: '#34d399' },
        ].map(stat => (
          <div key={stat.label} className="sp-stat">
            <div className="sp-stat-label">{stat.label}</div>
            <div className="sp-stat-val" style={{ color: stat.color, fontWeight: 700, fontSize: '24px' }}>
              {stat.count}
            </div>
          </div>
        ))}

        <div className="sp-title" style={{ marginTop: '24px' }}>Recent Actions</div>
        {recentActions.map(r => (
          <div key={r.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border,rgba(255,255,255,0.05))', fontSize: '12px' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-secondary,#ccc)' }}>{r.action}</div>
            <div style={{ color: 'var(--text-3,#666)', marginTop: '2px' }}>@{r.reportedUser} · {r.ref}</div>
          </div>
        ))}
      </div>
    </>
  );
}
