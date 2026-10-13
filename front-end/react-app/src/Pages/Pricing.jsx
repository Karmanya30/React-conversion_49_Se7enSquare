import React from 'react';
import AppShell from '../Components/platform/layout/AppShell';
import Toast from '../Components/platform/common/Toast';
import usePricing from '../Components/platform/hooks/usePricing';
import PricingHeader from './Pricing/components/PricingHeader';
import PlanGrid from './Pricing/components/PlanGrid';
import CancelSubscriptionCard from './Pricing/components/CancelSubscriptionCard';
import '../styles/pricing.css';

/**
 * Pricing Page Component
 * Refactored modular page displaying subscription tiers, current plan status,
 * upgrade/downgrade switching, and subscription cancellation matching 0cc099a.
 */
export default function Pricing() {
  const { currentPlan, toast, handlePlanChange, handleCancelSubscription } = usePricing();

  return (
    <AppShell
      headerIcon="💎"
      headerTitle="Pricing & Subscription"
      headerBadge="PLANS"
    >
      <div className="pricing-page active">
        <PricingHeader />
        <PlanGrid currentPlan={currentPlan} onPlanChange={handlePlanChange} />
        <CancelSubscriptionCard onCancel={handleCancelSubscription} />
      </div>

      <Toast toast={toast} />
    </AppShell>
  );
}
