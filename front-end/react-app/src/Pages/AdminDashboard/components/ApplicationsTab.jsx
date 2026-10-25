import React from "react";

/**
 * Organizer and Moderator application verification tables.
 */
export default function ApplicationsTab({
  organizerApps,
  moderatorApps,
  onOrganizerApp,
  onModeratorApp,
}) {
  const orgApps = organizerApps || [];
  const modApps = moderatorApps || [];

  return (
    <div className="admin-page active" id="page-applications">
      {/* Page Title & Stats */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontFamily: "'Syne',sans-serif", color: "#fff" }}>
            Role Applications
          </h3>
          <div style={{ fontSize: "12px", color: "#8b949e", marginTop: "4px" }}>
            Verify candidate qualifications for community organizers and platform moderators
          </div>
        </div>
        <span className="admin-users-count-badge">
          {orgApps.length + modApps.length} total applications
        </span>
      </div>

      {/* Organizer Applications Card */}
      <div className="admin-card-container">
        <div className="admin-card-header">
          <h3>🏆 Organizer Applications</h3>
          <span style={{ fontSize: "12px", color: "#8b949e" }}>
            {orgApps.filter((a) => a.status === "pending").length} pending
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-custom-table">
            <thead>
              <tr>
                <th style={{ width: "22%" }}>User</th>
                <th style={{ width: "42%" }}>Experience Note</th>
                <th style={{ width: "14%" }}>Applied</th>
                <th style={{ width: "10%" }}>Status</th>
                <th style={{ width: "12%", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orgApps.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: "36px", color: "#8b949e", fontSize: "13.5px" }}
                  >
                    No organizer applications in queue.
                  </td>
                </tr>
              ) : (
                orgApps.map((app) => {
                  const isPending = app.status === "pending";
                  const statusClass = (app.status || "pending").toLowerCase();

                  return (
                    <tr key={app.id}>
                      <td>
                        <span style={{ fontWeight: 600, color: "#93c5fd" }}>
                          @{app.user}
                        </span>
                      </td>
                      <td style={{ fontSize: "13px", color: "#cbd5e1" }}>
                        {app.experience}
                      </td>
                      <td style={{ fontSize: "12px", color: "#8b949e" }}>
                        {app.applied}
                      </td>
                      <td>
                        <span className={"admin-status-pill " + (statusClass === "approved" ? "active" : statusClass === "rejected" ? "banned" : "suspended")}>
                          <span className="admin-status-dot"></span>
                          {app.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {isPending ? (
                          <div className="admin-action-btn-group" style={{ justifyContent: "flex-end" }}>
                            <button
                              className="admin-btn-action btn-approve"
                              onClick={() => onOrganizerApp(app.id, "approved")}
                            >
                              Approve
                            </button>
                            <button
                              className="admin-btn-action btn-reject"
                              onClick={() => onOrganizerApp(app.id, "rejected")}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "12px", color: "#8b949e" }}>Decision recorded</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Moderator Applications Card */}
      <div className="admin-card-container">
        <div className="admin-card-header">
          <h3>🛡️ Moderator Applications</h3>
          <span style={{ fontSize: "12px", color: "#8b949e" }}>
            {modApps.filter((a) => a.status === "pending").length} pending
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="admin-custom-table">
            <thead>
              <tr>
                <th style={{ width: "24%" }}>User</th>
                <th style={{ width: "28%" }}>Quiz Score</th>
                <th style={{ width: "22%" }}>Applied</th>
                <th style={{ width: "12%" }}>Status</th>
                <th style={{ width: "14%", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {modApps.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: "36px", color: "#8b949e", fontSize: "13.5px" }}
                  >
                    No moderator applications in queue.
                  </td>
                </tr>
              ) : (
                modApps.map((app) => {
                  const isPending = app.status === "pending";
                  const statusClass = (app.status || "pending").toLowerCase();

                  return (
                    <tr key={app.id}>
                      <td>
                        <span style={{ fontWeight: 600, color: "#c084fc" }}>
                          @{app.user}
                        </span>
                      </td>
                      <td>
                        <span className="admin-score-pill">
                          🎯 {app.quizScore}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px", color: "#8b949e" }}>
                        {app.applied}
                      </td>
                      <td>
                        <span className={"admin-status-pill " + (statusClass === "approved" ? "active" : statusClass === "rejected" ? "banned" : "suspended")}>
                          <span className="admin-status-dot"></span>
                          {app.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {isPending ? (
                          <div className="admin-action-btn-group" style={{ justifyContent: "flex-end" }}>
                            <button
                              className="admin-btn-action btn-approve"
                              onClick={() => onModeratorApp(app.id, "approved")}
                            >
                              Approve
                            </button>
                            <button
                              className="admin-btn-action btn-reject"
                              onClick={() => onModeratorApp(app.id, "rejected")}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "12px", color: "#8b949e" }}>Decision recorded</span>
                        )}
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
