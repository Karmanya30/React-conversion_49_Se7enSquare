// Summary metrics bar displaying counts of pending, approved, and rejected events.
import React from 'react';

export default function SummaryBar({
  pendingCount = 0,
  approvedCount = 0,
  rejectedCount = 0,
}) {
  return (
    <section className="approval-summary" aria-label="Event approval summary">
      <div>
        <span className="summary-label">Pending</span>
        <strong>{pendingCount}</strong>
      </div>
      <div>
        <span className="summary-label">Approved</span>
        <strong>{approvedCount}</strong>
      </div>
      <div>
        <span className="summary-label">Rejected</span>
        <strong>{rejectedCount}</strong>
      </div>
    </section>
  );
}
