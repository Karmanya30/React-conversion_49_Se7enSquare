// Card presentation component for an upcoming event.
import React from 'react';

export default function EventCard({
  event,
  index = 0,
  comm,
  isRegistered = false,
  onView,
  onRegister,
  onCancel,
  canDelete = false,
  onDelete,
}) {
  const dateObj = event.date ? new Date(event.date) : null;
  const month =
    dateObj && !isNaN(dateObj)
      ? dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase()
      : 'TBD';
  const day =
    dateObj && !isNaN(dateObj)
      ? dateObj.getDate().toString().padStart(2, '0')
      : '--';
  const attendees = event.attendees ?? event.registered ?? 0;
  const capacity = event.maxAttendees || event.capacity || null;
  const isFull = capacity && attendees >= capacity;
  const seatsLabel = capacity
    ? `⚡ ${capacity - attendees} seats left`
    : 'Open registration';

  return (
    <div
      className={`ev-card delay-${(index % 10) * 5}`}
      onClick={() => onView && onView(event)}
    >
      <div
        className="ev-card-banner"
        style={{
          background: 'linear-gradient(135deg,var(--accent),var(--bg-surface))',
        }}
      >
        <div className="ev-card-banner-inner">{comm?.icon || '🎮'}</div>
        <div className="ev-card-badges">
          <span className="ev-badge badge-online">{event.type || 'Event'}</span>
          {event.free && <span className="ev-badge badge-free">🆓 Free</span>}
        </div>
      </div>
      <div className="ev-card-body">
        <div className="ev-card-top">
          <div className="ev-date-box">
            <div className="ev-date-mon">{month}</div>
            <div className="ev-date-day">{day}</div>
          </div>
          <div>
            <div className="ev-card-title">{event.title}</div>
            <div className="ev-card-comm">
              <div className="ev-comm-av">{comm?.icon || '🎮'}</div>
              <div className="ev-comm-name">{comm?.name || 'General Community'}</div>
            </div>
          </div>
        </div>
        <div className="ev-card-meta">
          <div className="ev-meta-tag">⏰ {event.time || '—'}</div>
          <div className="ev-meta-tag">👤 {attendees} / {capacity || '∞'}</div>
          <div className="ev-meta-tag">{event.mode || event.type || 'Event'}</div>
        </div>
        <div className="ev-card-footer">
          <div className="ev-attendees">{isFull ? '🚫 Event Full' : seatsLabel}</div>
          <div className="ev-actions" style={{ display: 'flex', gap: '6px' }}>
            <button
              className="btn-ev"
              onClick={(e) => {
                e.stopPropagation();
                if (onView) onView(event);
              }}
            >
              View
            </button>
            <button
              className={`btn-register${isRegistered ? ' registered' : ''}`}
              style={{ padding: '6px 14px', fontSize: '12px' }}
              onClick={(e) => {
                e.stopPropagation();
                if (isRegistered && onCancel) {
                  onCancel(event);
                } else if (!isFull && onRegister) {
                  onRegister(event);
                }
              }}
              disabled={isFull && !isRegistered}
            >
              {isRegistered ? 'Registered' : isFull ? 'Event Full' : 'Register Now'}
            </button>
            {canDelete && onDelete && (
              <button
                className="btn-delete-event"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(event.id);
                }}
                title="Delete"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
