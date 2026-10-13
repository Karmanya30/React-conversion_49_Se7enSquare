import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../Components/SideBar';
import Button from '../Components/Button';
import '../styles/global.css';
import '../styles/sidebar.css';
import '../styles/pricing.css';

/**
 * Pricing & Subscription Component
 * Converted from pricing.html, rendering subscription plans via data mapping,
 * managing current plan selection in React state, and providing plan switching feedback.
 */
const API_BASE = 'http://localhost:3000/api';

function getCurrentUser() {
  try {
    const raw = JSON.parse(localStorage.getItem('nexus_user') || localStorage.getItem('currentUser') || '{}');
    return {
      id: raw.id || 1,
      role: raw.role || 'user',
      firstName: raw.firstName || raw.username || 'User',
      username: raw.username || 'user',
    };
  } catch {
    return { id: 1, role: 'user', firstName: 'User', username: 'user' };
  }
}

export default function Pricing() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const PLANS = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: [
        'Up to 4 communities',
        'Up to 4 channels per community',
        '1 moderator',
        'Limited uploads',
        'Basic profile',
      ],
    },
    {
      id: 'plus',
      name: 'Plus',
      price: 99,
      features: [
        '10 communities',
        '20 channels per community',
        'Up to 5 moderators',
        'Premium badge',
        'Username color',
        'Larger uploads',
      ],
    },
    {
      id: 'ultra_pro',
      name: 'Ultra Pro',
      price: 299,
      featured: true,
      features: [
        'Unlimited communities',
        'Unlimited channels',
        'Unlimited moderators',
        'Unlimited members',
        'Animated profile frame',
        'HD Voice',
        'Community Insights Dashboard',
        'Community Boost features',
      ],
    },
  ];

  const PLAN_RANK = { free: 0, plus: 1, ultra_pro: 2 };

  // Current active plan in React state
  const [currentPlan, setCurrentPlan] = useState('free');

  // Toast notification state
  const [toast, setToast] = useState({ show: false, icon: '✅', msg: '' });

  const showToast = (icon, msg) => {
    setToast({ show: true, icon, msg });
    setTimeout(() => {
      setToast({ show: false, icon: '✅', msg: '' });
    }, 2800);
  };

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
        return;
      }
    } catch {}

    setCurrentPlan(planId);
    showToast('✅', `Now on the ${targetPlan.name} plan`);
  };

  const handleCancelSubscription = async () => {
    if (currentPlan === 'free') {
      showToast('ℹ️', 'You are already on the Free plan.');
      return;
    }
    try {
      await fetch(`${API_BASE}/subscriptions/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-role': user.role,
        },
        body: JSON.stringify({ userId: Number(user.id) }),
      });
    } catch {}
    setCurrentPlan('free');
    showToast('✅', 'Subscription cancelled — Reverted to the Free plan');
  };

  const avatarInitials = (user.firstName?.slice(0, 2) || user.username?.slice(0, 2) || 'GU').toUpperCase();

  return (
    <div className="app-shell">
      <SideBar />

      <div className="main">
        {/* Header matching pricing.html */}
        <header className="header">
          <div className="header-left">
            <div className="header-icon">💎</div>
            <h1 className="header-title">Pricing &amp; Subscription</h1>
            <span className="header-badge">PLANS</span>
          </div>
          <div className="header-right">
            <div
              className="header-avatar user-avatar"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/profile-settings')}
              title="Profile Settings"
            >
              {avatarInitials}
            </div>
          </div>
        </header>

        <div className="pricing-page active">
          {/* Pricing Subtitle Intro */}
          <p className="pricing-intro">
            Free gets you started. Plus and Ultra Pro unlock bigger communities, more moderators, and premium extras.
            Upgrades are simulated for this build — no real payment is taken.
          </p>

          {/* Dynamic Plan Grid */}
          <div className="plan-grid" id="planGrid">
            {PLANS.map((plan) => {
              const isCurrent = plan.id === currentPlan;
              const isDowngrade = PLAN_RANK[plan.id] < PLAN_RANK[currentPlan];

              return (
                <div
                  key={plan.id}
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
                    <Button className="plan-cta downgrade" onClick={() => handlePlanChange(plan.id)}>
                      Downgrade
                    </Button>
                  ) : (
                    <Button className="plan-cta primary" onClick={() => handlePlanChange(plan.id)}>
                      Upgrade to {plan.name}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Cancellation Card */}
          <div className="card pricing-cancel-card">
            <div className="card-header">
              <h3>Need to cancel?</h3>
            </div>
            <p className="pricing-cancel-desc">
              Cancelling reverts you to the Free plan immediately.
            </p>
            <Button
              className="btn-ghost pricing-cancel-btn"
              onClick={handleCancelSubscription}
            >
              Cancel current subscription
            </Button>
          </div>
        </div>

        {/* Toast Notification */}
        <div className={`toast ${toast.show ? 'show' : ''}`} id="toast">
          <span id="toastIcon">{toast.icon}</span>
          <span id="toastMsg">{toast.msg}</span>
        </div>
      </div>
    </div>
  );
}
