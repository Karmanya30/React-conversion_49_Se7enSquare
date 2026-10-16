// Section list rendering grouped events (pending, approved, rejected) with loading and empty states.
import React from 'react';
import ApprovalCard from './ApprovalCard';

export default function ApprovalList({
  title,
  description,
  events = [],
  loading = false,
  emptyMessage = 'No events in this list.',
  communityNameFn,
  onViewDetails,
  onApprove,
  onReject,
}) {
  return (
    <section className="approval-list-section">
      <div className="approval-section-head">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="approval-list">
        {loading ? (
          <div className="approval-empty">Loading events…</div>
        ) : events.length === 0 ? (
          <div className="approval-empty">{emptyMessage}</div>
        ) : (
          events.map((event) => (
            <ApprovalCard
              key={event.id}
              event={event}
              communityName={communityNameFn ? communityNameFn(event.communityId) : `Community #${event.communityId}`}
              onViewDetails={onViewDetails}
              onApprove={onApprove}
              onReject={onReject}
            />
          ))
        )}
      </div>
    </section>
  );
}
