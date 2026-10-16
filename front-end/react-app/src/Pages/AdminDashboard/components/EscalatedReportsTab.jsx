import React, { useState } from 'react';

/**
 * Escalated Reports tab — shows only reports with status === 'escalated',
 * enriched with reporter, target and community names.
 *
 * Actions: Dismiss, Warn, Remove Content, Suspend Author, Ban Author.
 * Each action calls an API endpoint, resolves the report with a note, and
 * sends notifications to both reporter and target.
 */
export default function EscalatedReportsTab({ reports, users, communities, onAction }) {
  const [notes, setNotes] = useState({});

  const escalated = (reports || []).filter((r) => r.status === 'escalated');

  function enrich(r) {
    const reporter = (users || []).find((u) => u.id === r.reporterId);
    const target = (users || []).find((u) => u.id === r.targetId);
    const community = (communities || []).find((c) => c.id === r.communityId);
    return { ...r, reporter, target, community };
  }

  return (
    <div className="admin-page active" id="page-escalated-reports">
      {escalated.length === 0 ? (
        <div className="card admin-empty-state">
          🛡️ No escalated reports. The moderation queue is clean.
        </div>
      ) : (
        <div className="admin-card-list">
          {escalated.map((raw) => {
            const r = enrich(raw);
            const note = notes[r.id] || '';
            return (
              <div key={r.id} className="card admin-report-card">
                <div className="admin-report-header">
                  <span className="admin-badge-status escalated">ESCALATED</span>
                  <span className="admin-report-reason">{r.reason}</span>
                  {r.community && (
                    <span className="admin-report-community">in {r.community.name}</span>
                  )}
                </div>

                <div className="admin-report-meta">
                  <span>Reporter: <strong>{r.reporter?.username || `#${r.reporterId}`}</strong></span>
                  <span>Target: <strong>{r.target?.username || `#${r.targetId}`}</strong></span>
                </div>

                {r.contentSnapshot && (
                  <blockquote className="admin-report-snapshot">"{r.contentSnapshot}"</blockquote>
                )}

                <div className="admin-report-actions">
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Resolution note (required for Dismiss)"
                    value={note}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))}
                  />
                  <div className="admin-action-btns">
                    <button
                      className="act-btn act-view"
                      onClick={() => onAction(r, 'dismiss', note)}
                      disabled={!note.trim()}
                    >
                      Dismiss
                    </button>
                    <button
                      className="act-btn act-edit"
                      onClick={() => onAction(r, 'warn', note)}
                    >
                      Warn
                    </button>
                    <button
                      className="act-btn act-delete"
                      onClick={() => onAction(r, 'remove_content', note)}
                    >
                      Remove Content
                    </button>
                    <button
                      className="act-btn act-delete act-suspend"
                      onClick={() => onAction(r, 'suspend_author', note)}
                    >
                      Suspend Author
                    </button>
                    <button
                      className="act-btn act-delete act-ban"
                      onClick={() => onAction(r, 'ban_author', note)}
                    >
                      Ban Author
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
