// Card component representing an event submission with approval and rejection actions.
import React from 'react';
import StatusBadge from '../../Components/event-management/common/StatusBadge';
import { EVENT_STATUSES } from '../../Components/event-management/utils/constants';

export default function ApprovalCard({
  event,
  communityName,
  onViewDetails,
  onApprove,
  onReject,
}) {
  const isPending = event.status === EVENT_STATUSES.PENDING;
  const cardClass = isPending ? 'approval-card' : 'event-card';

  return (
    <article className={cardClass}>
      <StatusBadge status={event.status || EVENT_STATUSES.PENDING} />
      <h3>{event.title}</h3>
      <div className="approval-meta">
        <div>
          <span>Date:</span> {event.date} {event.time || ''}
        </div>
        <div>
          <span>Community:</span> {communityName}
        </div>
        {event.createdBy && (
          <div>
            <span>Requested by:</span> {event.createdBy}
          </div>
        )}
      </div>

      <button className="details-btn" onClick={() => onViewDetails(event)}>
        View Details
      </button>

      {isPending && onApprove && onReject && (
        <div className="approval-actions">
          <button className="approve-btn" onClick={() => onApprove(event.id)}>
            Approve
          </button>
          <button className="reject-btn" onClick={() => onReject(event.id)}>
            Reject
          </button>
        </div>
      )}
    </article>
  );
}
