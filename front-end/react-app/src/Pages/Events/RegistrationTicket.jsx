// Ticket card presentation component for a user's confirmed event registration.
import React from 'react';

export default function RegistrationTicket({
  registration,
  event,
  comm,
  index = 0,
  onCancel,
}) {
  const ev = event || {
    title: registration.eventTitle || 'Event',
    date: registration.registeredAt,
  };
  const dateObj = ev.date
    ? new Date(ev.date)
    : registration.registeredAt
    ? new Date(registration.registeredAt)
    : null;
  const month =
    dateObj && !isNaN(dateObj)
      ? dateObj.toLocaleString('en-US', { month: 'short' })
      : 'TBD';
  const day = dateObj && !isNaN(dateObj) ? dateObj.getDate() : '--';
  const attendees = ev.attendees ?? ev.registered ?? 0;
  const ticketNumber = String(
    registration.eventId || ev.id || registration.id || index + 1
  ).padStart(6, '0');

  return (
    <div className={`reg-card delay-${(index % 10) * 5}`}>
      <div
        className="reg-card-banner"
        style={{
          background:
            'linear-gradient(135deg,var(--bg-card),rgba(91,110,245,0.15))',
        }}
      >
        <div className="reg-card-banner-inner">🎟</div>
      </div>
      <div className="reg-card-body">
        <div className="reg-card-top">
          <div className="reg-date-box">
            <div className="reg-mon">{month}</div>
            <div className="reg-day">{day}</div>
          </div>
          <div>
            <div className="reg-title">{registration.eventTitle || ev.title}</div>
            <div className="reg-comm">
              <div className="reg-comm-av">{comm?.icon || '🎮'}</div>
              <div className="reg-comm-name">{comm?.name || 'General Community'}</div>
            </div>
          </div>
        </div>
        <div className="reg-meta">
          <div className="reg-meta-item">⏰ {ev.time || '—'}</div>
          <div className="reg-meta-item">{ev.type || 'Event'}</div>
        </div>
        <div className="reg-status-row">
          <span className="reg-status status-confirmed">✓ Confirmed</span>
          <span className="ticket-id">TKT-{ticketNumber}</span>
        </div>
        <div className="reg-card-footer">
          <div className="ev-attendees">👥 {attendees} attending</div>
          <div className="reg-actions">
            <button
              className="btn-cancel"
              onClick={() => onCancel && onCancel(registration)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
