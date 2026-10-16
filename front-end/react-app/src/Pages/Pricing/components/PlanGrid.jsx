import React from 'react';
import { PLANS } from '../../../Components/platform/data/pricingPlans';
import PricingCard from './PricingCard';

/**
 * Grid container rendering all available subscription tier cards.
 */
export default function PlanGrid({
  currentPlan,
  onPlanChange,
  isLoading,
  isSubmitting,
  isOwner,
}) {
  return (
    <div className="plan-grid" id="planGrid">
      {PLANS.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          currentPlan={currentPlan}
          onPlanChange={onPlanChange}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          isOwner={isOwner}
        />
      ))}
    </div>
  );
}

