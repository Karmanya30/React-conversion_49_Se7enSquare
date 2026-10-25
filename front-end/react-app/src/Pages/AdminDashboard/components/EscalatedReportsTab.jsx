import React, { useState } from "react";

/**
 * Escalated Reports tab - shows only reports with status === 'escalated',
 * enriched with reporter, target and community names.
 */
export default function EscalatedReportsTab({ reports, users, communities, onAction }) {
  const [notes, setNotes] = useState({});

  const escalated = (reports || []).filter((r) => r.status === "escalated");

  function enrich(r) {
    const reporter = (users || []).find((u) => u.id === r.reporterId);
    const target = (users || []).find((u) => u.id === r.targetId);
    const community = (communities || []).find((c) => c.id === r.communityId);
    return { ...r, reporter, target, community };
  }

  return (
    <div className="admin-page active" id="page-escalated-reports">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h3 style={{ margin: 0, fontFamily: "'Syne',sans-serif", color: "#fff" }}>
            Escalated Reports Queue
          </h3>
          <div style={{ fontSize: "12px", color: "#8b949e", marginTop: "4px" }}>
            Reports escalated by community moderators requiring administrator intervention
          </div>
        </div>
        <span className="admin-users-count-badge">
          {escalated.length} {escalated.length === 1 ? "report" : "reports"} pending
        </span>
      </div>

      {escalated.length === 0 ? (
        <div
          className="admin-card-container"
          style={{
            textAlign: "center",
            padding: "48px 20px",
            color: "#8b949e",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "10px" }}>🛡️</div>
          <div style={{ fontWeight: 600, color: "#fff", fontSize: "15px" }}>Queue is clean!</div>
          <div style={{ fontSize: "13px", marginTop: "4px" }}>No escalated reports require administrative review at this time.</div>
        </div>
      ) : (
        <div className="admin-card-list">
          {escalated.map((raw) => {
            const r = enrich(raw);
            const note = notes[r.id] || "";
            return (
              <div key={r.id} className="admin-esc-card">
                {/* Header row */}
                <div className="admin-esc-header">
                  <span
                    style={{
                      padding: "4px 10px",
                      background: "rgba(239, 68, 68, 0.15)",
                      border: "1px solid rgba(239, 68, 68, 0.35)",
                      borderRadius: "6px",
                      color: "#f87171",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                    }}
                  >
                    ESCALATED
                  </span>
                  <span style={{ fontWeight: 600, color: "#fff", fontSize: "14px" }}>
                    {r.reason}
                  </span>
                  {r.community && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#93c5fd",
                        background: "rgba(59, 130, 246, 0.1)",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      in {r.community.name}
                    </span>
                  )}
                </div>

                {/* Reporter & Target Metadata */}
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    fontSize: "13px",
                    color: "#8b949e",
                    margin: "8px 0",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    Reporter:{" "}
                    <span style={{ color: "#e2e8f0", fontWeight: 600 }}>
                      {r.reporter?.username ? "@" + r.reporter.username : "#" + r.reporterId}
                    </span>
                  </div>
                  <div>
                    Target:{" "}
                    <span style={{ color: "#fca5a5", fontWeight: 600 }}>
                      {r.target?.username ? "@" + r.target.username : "#" + r.targetId}
                    </span>
                  </div>
                </div>

                {/* Content Snapshot */}
                {r.contentSnapshot && (
                  <div className="admin-esc-snapshot">
                    "{r.contentSnapshot}"
                  </div>
                )}

                {/* Actions & Resolution Note Bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginTop: "16px",
                    paddingTop: "14px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                    flexWrap: "wrap",
                  }}
                >
                  <input
                    type="text"
                    className="admin-esc-input"
                    placeholder="Resolution note (required for Dismiss)..."
                    value={note}
                    onChange={(e) =>
                      setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))
                    }
                  />
                  <div className="admin-action-btn-group">
                    <button
                      className="admin-btn-action btn-secondary"
                      onClick={() => onAction(r, "dismiss", note)}
                      disabled={!note.trim()}
                      title={!note.trim() ? "Please enter a resolution note" : "Dismiss report"}
                    >
                      Dismiss
                    </button>
                    <button
                      className="admin-btn-action btn-warn"
                      onClick={() => onAction(r, "warn", note)}
                    >
                      Warn
                    </button>
                    <button
                      className="admin-btn-action btn-danger"
                      onClick={() => onAction(r, "remove_content", note)}
                    >
                      Remove Content
                    </button>
                    <button
                      className="admin-btn-action btn-danger"
                      onClick={() => onAction(r, "suspend_author", note)}
                    >
                      Suspend Author
                    </button>
                    <button
                      className="admin-btn-action btn-danger"
                      onClick={() => onAction(r, "ban_author", note)}
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
