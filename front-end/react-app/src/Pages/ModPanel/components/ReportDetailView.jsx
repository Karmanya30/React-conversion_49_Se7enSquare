import React from 'react';

/**
 * Center panel — report detail: reporter info, reason card, context quote, action note textarea.
 */
export default function ReportDetailView({ selectedReport, actionNote, onActionNoteChange }) {
  if (!selectedReport) {
    return (
      <div className="detail-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-3,#666)', fontSize: '14px' }}>
        Select a report from the queue to review.
      </div>
    );
  }

  return (
    <div className="detail-panel">
      <div className="dp-header">
        <div className="dp-title" id="dpTitle">
          {selectedReport.ref} — @{selectedReport.reportedUser} in {selectedReport.channel}
        </div>
        <div className="dp-action" id="dpAction">
          {selectedReport.action ? `Last action: ${selectedReport.action}` : 'Last action: None'}
        </div>
      </div>

      <div className="dp-body">
        <div id="tabContent">
          <div className="reporter-row">
            <div className="reporter-av grad-violet" style={{ background: '#6366f1', color: '#fff', fontWeight: 700, width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              AM
            </div>
            <div className="reporter-info">
              <div className="reporter-name">Reported by: Anonymous</div>
              <div className="reporter-sub">
                {selectedReport.date} · via {selectedReport.type === 'message' ? 'Message' : 'Profile'} Report
              </div>
            </div>
            <span className="reporter-anon">🔒 Anonymous</span>
          </div>

          <div className="reason-card">
            <div className="rc-header">
              <div className="rc-icon">🚫</div>
              <div className="rc-title">{selectedReport.reason}</div>
            </div>
            <div className="rc-desc">
              {selectedReport.type === 'message'
                ? 'Content that violates community guidelines.'
                : 'User behavior that violates community standards.'}
            </div>
            {selectedReport.context && (
              <div className="rc-note">"{selectedReport.context}"</div>
            )}
          </div>

          {selectedReport.status !== 'resolved' && (
            <div className="action-note-field" style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-3,#666)', marginBottom: '8px', display: 'block' }}>
                Moderator Note (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Add a note explaining your moderation action…"
                value={actionNote}
                onChange={e => onActionNoteChange(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-card,#151d2f)', border: '1px solid var(--border,rgba(255,255,255,0.08))', borderRadius: '8px', color: '#fff', fontSize: '13px', resize: 'vertical' }}
              />
            </div>
          )}
        </div>
      </div>

      {selectedReport.status === 'resolved' && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#34d399' }}>
          ✅ This report has been resolved.
          {selectedReport.action && (
            <div style={{ fontSize: '13px', color: 'var(--text-3,#666)', marginTop: '8px' }}>
              Action taken: {selectedReport.action}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
