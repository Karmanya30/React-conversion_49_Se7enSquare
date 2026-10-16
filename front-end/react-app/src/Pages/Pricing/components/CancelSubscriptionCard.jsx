import React from 'react';
import Button from '../../../Components/Button';

/**
  * Cancellation Card component.
  */
export default function CancelSubscriptionCard({
  onCancel,
  currentPlan,
  isSubmitting,
  isOwner,
  user,
}) {
  if (isOwner) {
    return null;
  }

  const isFree = currentPlan === 'free';
  const disabled = isFree || isSubmitting || !user;

  return (
    <div className="card pricing-cancel-card">
      <div className="card-header">
        <h3>Need to cancel?</h3>
      </div>
      <p className="pricing-cancel-desc">
        {isFree
          ? 'You are currently on the Free plan. No active subscription to cancel.'
          : 'Cancelling reverts you to the Free plan immediately.'}
      </p>
      <Button
        className="btn-ghost pricing-cancel-btn"
        onClick={onCancel}
        disabled={disabled}
      >
        {isSubmitting
          ? 'Cancelling...'
          : isFree
          ? 'Currently on Free Plan'
          : 'Cancel current subscription'}
      </Button>
    </div>
  );
}

