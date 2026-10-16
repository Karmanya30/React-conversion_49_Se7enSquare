import React from 'react';
import Button from '../../../Components/Button';
import { PLAN_RANK } from '../../../Components/platform/data/pricingPlans';

/**
 * Single subscription tier card component.
 */
export default function PricingCard({
  plan,
  currentPlan,
  onPlanChange,
  isLoading,
  isSubmitting,
  isOwner,
}) {
  const isCurrent = plan.id === currentPlan;
  const isDowngrade = PLAN_RANK[plan.id] < PLAN_RANK[currentPlan];

  let ctaContent;
  let isDisabled = isSubmitting;


  if (isLoading) {
    ctaContent = 'Loading...';
    isDisabled = true;
  } else if (isOwner) {
    ctaContent = 'Platform Owner Role';
    isDisabled = true;
  } else if (isCurrent) {
    ctaContent = 'Current Plan';
    isDisabled = true;
  } else if (isDowngrade) {
    ctaContent = isSubmitting ? 'Updating...' : 'Downgrade';
  } else {
    ctaContent = isSubmitting ? 'Updating...' : `Upgrade to ${plan.name}`;
  }

  return (
    <div
      className={`plan-card ${isCurrent && !isOwner ? 'current' : ''} ${plan.featured ? 'featured' : ''}`}
    >
      {isCurrent && !isOwner && <div className="plan-badge-current">CURRENT</div>}

      <div className="plan-name">{plan.name}</div>

      <div className="plan-price">
        {plan.price === 0 ? (
          'Free'
        ) : (
          <>
            ₹{plan.price}
            <span>/mo</span>
          </>
        )}
      </div>

      <ul className="plan-features">
        {plan.features.map((feat) => (
          <li key={`${plan.id}-${feat}`}>{feat}</li>
        ))}
      </ul>

      <Button
        className={`plan-cta ${isCurrent && !isOwner ? 'current' : isDowngrade ? 'downgrade' : 'primary'}`}
        disabled={isDisabled}
        onClick={() => !isDisabled && onPlanChange(plan.id)}
      >
        {ctaContent}
      </Button>
    </div>
  );
}

