// Inspection modal displaying comprehensive submission details for an event request.
import React from 'react';
import Modal from '../../Components/event-management/common/Modal';
import StatusBadge from '../../Components/event-management/common/StatusBadge';
import { EVENT_STATUSES } from '../../Components/event-management/utils/constants';

export default function EventDetailModal({
  event,
  isOpen,
  onClose,
  communityName,
}) {
  if (!isOpen || !event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} dialogClassName="modal-content">
      <button
        className="modal-close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      <StatusBadge status={event.status || EVENT_STATUSES.PENDING} />
      <h2>{event.title}</h2>
      <p style={{ marginTop: '8px' }}>
        {event.description || 'No description provided.'}
      </p>
      <p style={{ marginTop: '8px' }}>
        <strong>Date:</strong> {event.date} {event.time || ''}
      </p>
      <p>
        <strong>Community:</strong> {communityName}
      </p>
      <p>
        <strong>Capacity:</strong> {event.maxAttendees || 'Unlimited'}
      </p>
      <p>
        <strong>Category:</strong> {event.category || event.type || 'Tournament'}
      </p>
    </Modal>
  );
}
