import React from 'react';
import Button from '../../../Components/Button';
import { PLAN_RANK } from '../../../Components/platform/data/pricingPlans';

/**
 * Single subscription tier card component matching commit 0cc099a.
 */
export default function PricingCard({ plan, currentPlan, onPlanChange }) {
  const isCurrent = plan.id === currentPlan;
  const isDowngrade = PLAN_RANK[plan.id] < PLAN_RANK[currentPlan];

  return (
    <div
      className={`plan-card ${isCurrent ? 'current' : ''} ${plan.featured ? 'featured' : ''}`}
    >
      {isCurrent && <div className="plan-badge-current">CURRENT</div>}

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

      {isCurrent ? (
        <Button className="plan-cta current" disabled>
          Current Plan
        </Button>
      ) : isDowngrade ? (
        <Button className="plan-cta downgrade" onClick={() => onPlanChange(plan.id)}>
          Downgrade
        </Button>
      ) : (
        <Button className="plan-cta primary" onClick={() => onPlanChange(plan.id)}>
          Upgrade to {plan.name}
        </Button>
      )}
    </div>
  );
}
