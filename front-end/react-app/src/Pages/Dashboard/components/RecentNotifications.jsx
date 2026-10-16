import React from 'react';

/**
 * RecentNotifications Component
 * Renders user notifications list with read status, timestamps, and mark-all-read action.
 */
export default function RecentNotifications({ notifications, markAllRead }) {
  return (
    <div className="section-box">
      <div className="section-header">
        <div className="section-title">🔔 Recent Notifications</div>
        <div className="section-link" style={{ cursor: 'pointer' }} onClick={markAllRead}>
          Mark all read
        </div>
      </div>
      <div className="notif-list" id="notif-list-container">
        {notifications.length === 0 ? (
          <div style={{ color: 'var(--text-3,#888)', fontSize: '13px', padding: '24px 0', textAlign: 'center' }}>
            No notifications right now.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`notif-item${n.read ? ' read' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 0',
                borderBottom: '1px solid var(--border,rgba(255,255,255,0.05))',
                opacity: n.read ? 0.6 : 1,
              }}
            >
              <span style={{ fontSize: '18px' }}>{n.icon}</span>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary,#ccc)' }}>{n.text}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3,#666)', marginTop: '3px' }}>{n.time}</div>
              </div>
              {!n.read && (
                <div
                  style={{
                    marginLeft: 'auto',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#6366f1',
                    flexShrink: 0,
                    marginTop: '4px',
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
