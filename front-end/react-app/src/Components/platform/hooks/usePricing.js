import { useState, useEffect } from 'react';
import { PLANS, PLAN_RANK } from '../data/pricingPlans';
import { getPlatformUser } from '../utils/platformStorage';
import useToast from './useToast';

const API_BASE = 'http://localhost:3000/api';

/**
 * Custom hook managing all Pricing page state and network actions.
 */
export default function usePricing() {
  const [user] = useState(getPlatformUser);
  const [currentPlan, setCurrentPlan] = useState('free');
  const { toast, showToast } = useToast();

  useEffect(() => {
    fetch(`${API_BASE}/subscriptions/status?userId=${user.id}`, {
      headers: { 'x-role': user.role },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.plan) {
          setCurrentPlan(data.plan);
        }
      })
      .catch(() => {});
  }, [user.id, user.role]);

  const handlePlanChange = async (planId) => {
    const targetPlan = PLANS.find((p) => p.id === planId);
    if (!targetPlan) return;

    const isDowngrade = PLAN_RANK[planId] < PLAN_RANK[currentPlan];

    if (isDowngrade) {
      const confirmed = window.confirm(
        `Downgrade to ${targetPlan.name}? You'll lose access to paid features beyond the ${targetPlan.name} tier limits.`
      );
      if (!confirmed) return;
    }

    try {
      const res = await fetch(`${API_BASE}/subscriptions/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-role': user.role,
        },
        body: JSON.stringify({ userId: Number(user.id), plan: planId }),
      });
      if (res.ok) {
        setCurrentPlan(planId);
        showToast('✅', `Now on the ${targetPlan.name} plan`);
      } else {
        showToast('⚠️', 'Could not update subscription plan.');
      }
    } catch {
      showToast('⚠️', 'Could not update subscription plan.');
    }
  };

  const handleCancelSubscription = async () => {
    if (currentPlan === 'free') {
      showToast('ℹ️', 'You are already on the Free plan.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/subscriptions/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-role': user.role,
        },
        body: JSON.stringify({ userId: Number(user.id) }),
      });
      if (res.ok) {
        setCurrentPlan('free');
        showToast('✅', 'Subscription cancelled — Reverted to the Free plan');
      } else {
        showToast('⚠️', 'Could not cancel subscription.');
      }
    } catch {
      showToast('⚠️', 'Could not cancel subscription.');
    }
  };

  return {
    user,
    currentPlan,
    toast,
    handlePlanChange,
    handleCancelSubscription,
  };
}
