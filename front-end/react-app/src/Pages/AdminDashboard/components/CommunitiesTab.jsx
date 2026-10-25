import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Communities management table with search, statistics, and moderation actions.
 */
export default function CommunitiesTab({
  communities,
  users,
  suspendCommunity,
  reinstateCommunity,
}) {
  const navigate = useNavigate();

  function ownerName(ownerId) {
    const u = (users || []).find((u) => u.id === ownerId);
    return u ? "@" + u.username : "#" + ownerId;
  }

  return (
    <div className="admin-page active" id="page-communities">
      {/* Header Info Banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontFamily: "'Syne',sans-serif", color: "#fff" }}>
            Managed Communities
          </h3>
          <div style={{ fontSize: "12px", color: "#8b949e", marginTop: "4px" }}>
            Review active server hubs, member populations, and enforcement status
          </div>
        </div>
        <span className="admin-users-count-badge">
          {communities.length} {communities.length === 1 ? "community" : "communities"}
        </span>
      </div>

      {/* Modern Card Table */}
      <div className="admin-card-container">
        <div style={{ overflowX: "auto" }}>
          <table className="admin-custom-table">
            <thead>
              <tr>
                <th style={{ width: "38%" }}>Community</th>
                <th style={{ width: "20%" }}>Owner</th>
                <th style={{ width: "14%" }}>Members</th>
                <th style={{ width: "14%" }}>Status</th>
                <th style={{ width: "14%", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {communities.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "#8b949e",
                      fontSize: "14px",
                    }}
                  >
                    No communities registered on platform.
                  </td>
                </tr>
              ) : (
                communities.map((c) => {
                  const isSuspended = c.status === "suspended";
                  const statusClass = (c.status || "active").toLowerCase();

                  return (
                    <tr key={c.id}>
                      {/* Community info */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "10px",
                              background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "18px",
                              flexShrink: 0,
                              boxShadow: "0 2px 8px rgba(6, 182, 212, 0.25)",
                            }}
                          >
                            🏘️
                          </div>
                          <div>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "#fff",
                                lineHeight: 1.2,
                              }}
                            >
                              {c.name}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#8b949e",
                                marginTop: "3px",
                                maxWidth: "320px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                              title={c.description || ""}
                            >
                              {c.description || "Gaming community hub"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Owner */}
                      <td>
                        <span
                          style={{
                            padding: "3px 8px",
                            background: "rgba(255, 255, 255, 0.05)",
                            borderRadius: "6px",
                            color: "#93c5fd",
                            fontSize: "12.5px",
                            fontWeight: 500,
                          }}
                        >
                          {ownerName(c.ownerId)}
                        </span>
                      </td>

                      {/* Members */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#cbd5e1", fontSize: "13px" }}>
                          <span>👥</span>
                          <span>{(c.memberCount ?? 0).toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={"admin-status-pill " + statusClass}>
                          <span className="admin-status-dot"></span>
                          {(c.status || "active").toUpperCase()}
                        </span>
                        {c.suspendedReason && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#f87171",
                              marginTop: "4px",
                              maxWidth: "160px",
                            }}
                            title={c.suspendedReason}
                          >
                            {c.suspendedReason.slice(0, 30)}...
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: "right" }}>
                        <div className="admin-action-btn-group" style={{ justifyContent: "flex-end" }}>
                          <button
                            className="admin-btn-action btn-view"
                            onClick={() => navigate("/community-page/" + c.id)}
                            title="Visit community page"
                          >
                            View
                          </button>
                          {isSuspended ? (
                            <button
                              className="admin-btn-action btn-success"
                              onClick={() => reinstateCommunity(c.id)}
                            >
                              Reinstate
                            </button>
                          ) : (
                            <button
                              className="admin-btn-action btn-warn"
                              onClick={() => suspendCommunity(c.id)}
                            >
                              Suspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
