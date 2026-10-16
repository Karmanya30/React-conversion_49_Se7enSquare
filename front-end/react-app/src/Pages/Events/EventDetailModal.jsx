// Detailed inspection modal dialog for a selected event.
import React from 'react';

export default function EventDetailModal({
  event,
  isOpen,
  onClose,
  isRegistered = false,
  onRegister,
  formatDate,
}) {
  if (!isOpen || !event) return null;

  const formattedDate = formatDate ? formatDate(event.date) : event.date;
  const attendees = event.attendees ?? event.registered ?? 0;
  const capacity = event.maxAttendees || event.capacity || '∞';

  return (
    <div
      id="eventModal"
      className="event-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div className="event-modal-content">
        <button
          className="event-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="modal-status" id="modalStatus">
          <span className="ev-badge badge-live">
            ● {event.status || 'Approved'}
          </span>
        </div>
        <h2 id="modalTitle">{event.title}</h2>
        <p id="modalDesc">{event.description}</p>
        <div className="modal-detail-grid">
          <p id="modalDate">
            🗓 {formattedDate} at {event.time || '—'}
          </p>
          <p id="modalCommunity">🏘️ {event.community || 'Community'}</p>
          <p id="modalCapacity">
            👥 {attendees}/{capacity} registered
          </p>
          <p id="modalCategory">🏆 {event.type || event.category || 'Event'}</p>
        </div>
        {!isRegistered && onRegister && (
          <button
            className="btn-publish"
            style={{ width: '100%', marginTop: '16px' }}
            onClick={() => {
              onClose();
              onRegister(event);
            }}
          >
            Register Now
          </button>
        )}
      </div>
    </div>
  );
}
