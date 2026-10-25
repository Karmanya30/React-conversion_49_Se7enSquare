import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Events management overview with link to Event Approval.
 */
export default function EventsTab({ events }) {
  const navigate = useNavigate();
  const eventsList = events || [];

  return (
    <div className="admin-page active" id="page-events-mgmt">
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
            Platform Events
          </h3>
          <div style={{ fontSize: "12px", color: "#8b949e", marginTop: "4px" }}>
            Scheduled community tournaments, meetups, and platform competitions
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span className="admin-users-count-badge">
            {eventsList.length} {eventsList.length === 1 ? "event" : "events"}
          </span>
          <button
            className="admin-btn-action btn-primary"
            onClick={() => navigate("/event-approval")}
            style={{ padding: "8px 16px", fontSize: "13px" }}
          >
            Event Approval →
          </button>
        </div>
      </div>

      {eventsList.length === 0 ? (
        <div
          className="admin-card-container"
          style={{ textAlign: "center", padding: "48px 20px", color: "#8b949e" }}
        >
          <div style={{ fontSize: "32px", marginBottom: "10px" }}>📅</div>
          <div style={{ fontWeight: 600, color: "#fff", fontSize: "15px" }}>No scheduled events</div>
          <div style={{ fontSize: "13px", marginTop: "4px" }}>Community organizers have not scheduled any events yet.</div>
        </div>
      ) : (
        eventsList.map((ev) => {
          const isApproved = ev.status === "approved" || ev.status === "active";
          return (
            <div key={ev.id} className="admin-event-row-card">
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  flexShrink: 0,
                  boxShadow: "0 2px 10px rgba(16, 185, 129, 0.25)",
                }}
              >
                📅
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "15px", color: "#fff" }}>
                  {ev.title}
                </div>
                <div
                  style={{
                    fontSize: "12.5px",
                    color: "#8b949e",
                    marginTop: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <span style={{ color: "#93c5fd" }}>🏘️ {ev.community || "Global"}</span>
                  <span>⏰ {ev.date || "TBD"}</span>
                </div>
              </div>
              <span className={"admin-status-pill " + (isApproved ? "active" : "suspended")}>
                <span className="admin-status-dot"></span>
                {(ev.status || "PENDING").toUpperCase()}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
