import React from 'react';
import SideBar from '../Components/SideBar';
import useOwnerDashboard from '../Components/platform/hooks/useOwnerDashboard';
import OwnerHeader from './OwnerDashboard/components/OwnerHeader';
import OwnerMetricsGrid from './OwnerDashboard/components/OwnerMetricsGrid';
import RecentActivityList from './OwnerDashboard/components/RecentActivityList';
import SubscriptionsTab from './OwnerDashboard/components/SubscriptionsTab';
import '../styles/global.css';
import '../styles/sidebar.css';
import '../styles/admin-dashboard.css';
import '../styles/owner-dashboard.css';

/**
 * OwnerDashboard Page — thin orchestrator.
 * All state, API calls, and drill-down data fetching live in useOwnerDashboard().
 * JSX for drill-down tables is rendered by SubscriptionsTab (not stored in state).
 */
export default function OwnerDashboard() {
  const {
    stats, revenue,
    drillModalOpen, setDrillModalOpen,
    drillTitle, drillLoading, drillContent,
    openDrill,
  } = useOwnerDashboard();

  return (
    <div className="app-shell">
      <SideBar />
      <div className="main">
        <OwnerHeader />

        <div className="page active">
          <p style={{ color: 'var(--text-3, #9ca3af)', fontSize: '13px', marginBottom: '20px' }}>
            Read-only view — statistics and platform health. No user, community, or moderation actions are available from this account.
          </p>
          <p style={{ color: 'var(--text-3, #666)', fontSize: '11.5px', margin: '-12px 0 14px' }}>
            💡 Click any card for a breakdown.
          </p>

          <OwnerMetricsGrid
            stats={stats}
            revenue={revenue}
            onDrill={openDrill}
          />

          <RecentActivityList stats={stats} />
        </div>
      </div>

      <SubscriptionsTab
        drillModalOpen={drillModalOpen}
        drillTitle={drillTitle}
        drillLoading={drillLoading}
        drillContent={drillContent}
        onClose={() => setDrillModalOpen(false)}
      />
    </div>
  );
}
