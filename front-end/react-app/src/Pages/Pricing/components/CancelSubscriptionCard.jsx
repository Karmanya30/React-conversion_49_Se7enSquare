import React from 'react';
import Button from '../../../Components/Button';

/**
 * Cancellation Card matching commit 0cc099a.
 */
export default function CancelSubscriptionCard({ onCancel }) {
  return (
    <div className="card pricing-cancel-card">
      <div className="card-header">
        <h3>Need to cancel?</h3>
      </div>
      <p className="pricing-cancel-desc">
        Cancelling reverts you to the Free plan immediately.
      </p>
      <Button
        className="btn-ghost pricing-cancel-btn"
        onClick={onCancel}
      >
        Cancel current subscription
      </Button>
    </div>
  );
}
