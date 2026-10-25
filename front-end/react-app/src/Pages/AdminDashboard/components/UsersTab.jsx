import React from "react";

/**
 * User management table with search, role filters, inline role editing,
 * suspension, permanent ban, and reinstatement.
 */
export default function UsersTab({
  userSearch,
  setUserSearch,
  userRoleFilter,
  setUserRoleFilter,
  filteredUsers,
  editingUser,
  setEditingUser,
  updateUserRole,
  suspendUser,
  banUser,
  reinstateUser,
  adminUser,
}) {
  return (
    <div className="admin-page active" id="page-users">
      {/* Top Search & Filter Toolbar */}
      <div className="admin-users-toolbar">
        <div className="admin-users-search-wrap">
          <span className="admin-users-search-icon">🔍</span>
          <input
            type="text"
            className="admin-users-search-input"
            placeholder="Search by name, @username, or email..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
        </div>

        <div className="admin-users-controls-right">
          <select
            className="admin-users-role-select"
            value={userRoleFilter}
            onChange={(e) => setUserRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
            <option value="community_manager">Community Manager</option>
            <option value="organizer">Organizer</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>

          <span className="admin-users-count-badge">
            {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}
          </span>
        </div>
      </div>

      {/* Modern Card Table */}
      <div className="admin-users-card">
        <div style={{ overflowX: "auto" }}>
          <table className="admin-users-table">
            <thead>
              <tr>
                <th style={{ width: "28%" }}>User</th>
                <th style={{ width: "24%" }}>Email</th>
                <th style={{ width: "16%" }}>Role</th>
                <th style={{ width: "14%" }}>Status</th>
                <th style={{ width: "18%", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
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
                    No users match the search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrentAdmin = u.id === adminUser?.id;
                  const isSuspendedOrBanned =
                    u.status === "suspended" || u.status === "banned";
                  const roleClass = (u.role || "user").toLowerCase();
                  const statusClass = (u.status || "active").toLowerCase();

                  return (
                    <tr key={u.id}>
                      {/* User Info with Avatar */}
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "10px",
                              background:
                                "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: "13px",
                              letterSpacing: "0.5px",
                              flexShrink: 0,
                              boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
                            }}
                          >
                            {(u.name || u.username).slice(0, 2).toUpperCase()}
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
                              {u.name || u.username}
                              {isCurrentAdmin && (
                                <span
                                  style={{
                                    marginLeft: "8px",
                                    fontSize: "10px",
                                    color: "#a855f7",
                                    background: "rgba(168, 85, 247, 0.15)",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                  }}
                                >
                                  You
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#8b949e",
                                marginTop: "3px",
                              }}
                            >
                              @{u.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ fontSize: "13px", color: "#94a3b8" }}>
                        {u.email}
                      </td>

                      {/* Role */}
                      <td>
                        {editingUser === u.id ? (
                          <select
                            defaultValue={u.role}
                            onChange={(e) => updateUserRole(u.id, e.target.value)}
                            style={{
                              padding: "5px 10px",
                              background: "#0a0a0f",
                              border: "1px solid #8b5cf6",
                              borderRadius: "6px",
                              color: "#fff",
                              fontSize: "12px",
                              outline: "none",
                            }}
                          >
                            {[
                              "user",
                              "moderator",
                              "community_manager",
                              "organizer",
                              "admin",
                              "owner",
                            ].map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className={"admin-role-badge " + roleClass}>
                            {u.role?.toUpperCase()}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        <span className={"admin-status-pill " + statusClass}>
                          <span className="admin-status-dot"></span>
                          {(u.status || "active").toUpperCase()}
                        </span>
                        {u.statusReason && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#f87171",
                              marginTop: "4px",
                              maxWidth: "180px",
                            }}
                            title={u.statusReason}
                          >
                            {u.statusReason.length > 35
                              ? u.statusReason.slice(0, 35) + "..."
                              : u.statusReason}
                          </div>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td style={{ textAlign: "right" }}>
                        <div
                          className="admin-users-actions"
                          style={{ justifyContent: "flex-end" }}
                        >
                          <button
                            className={"admin-user-btn " + (editingUser === u.id ? "admin-user-btn-cancel" : "admin-user-btn-edit")}
                            onClick={() =>
                              setEditingUser(editingUser === u.id ? null : u.id)
                            }
                            disabled={isCurrentAdmin}
                            title={isCurrentAdmin ? "Cannot edit your own role" : "Change user role"}
                          >
                            {editingUser === u.id ? "Cancel" : "Edit Role"}
                          </button>

                          {isSuspendedOrBanned ? (
                            <button
                              className="admin-user-btn admin-user-btn-reinstate"
                              onClick={() => reinstateUser(u.id)}
                            >
                              Reinstate
                            </button>
                          ) : (
                            <>
                              {!isCurrentAdmin && (
                                <>
                                  <button
                                    className="admin-user-btn admin-user-btn-suspend"
                                    onClick={() => suspendUser(u.id)}
                                  >
                                    Suspend
                                  </button>
                                  <button
                                    className="admin-user-btn admin-user-btn-ban"
                                    onClick={() => banUser(u.id)}
                                  >
                                    Ban
                                  </button>
                                </>
                              )}
                            </>
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
