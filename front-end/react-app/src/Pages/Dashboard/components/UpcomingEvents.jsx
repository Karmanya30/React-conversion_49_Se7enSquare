import React from 'react';

/**
 * UpcomingEvents Component
 * Renders upcoming community events with quick navigation to events schedule.
 */
export default function UpcomingEvents({ events, navigate }) {
  return (
    <div>
      <div className="section-header">
        <div className="section-title">📅 Upcoming Events</div>
        <div className="section-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/events')}>
          View all →
        </div>
      </div>
      <div className="event-list">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="event-item"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px 0',
              borderBottom: '1px solid var(--border,rgba(255,255,255,0.05))',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/events')}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(99,102,241,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0,
              }}
            >
              {ev.type}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1,#fff)' }}>
                {ev.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-3,#666)', marginTop: '3px' }}>
                {ev.community} · {ev.date} {ev.time && `· ${ev.time}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
