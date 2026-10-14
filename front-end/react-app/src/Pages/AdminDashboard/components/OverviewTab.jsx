import React from 'react';
import StatCard from '../../../Components/platform/common/StatCard';
import { getStatCards } from '../../../Components/platform/data/adminData';
import PlatformHealth from './PlatformHealth';
import QuickActions from './QuickActions';
import RecentAuditList from './RecentAuditList';

/**
 * Overview tab composing 6 stat cards, health metrics, quick actions, and recent audit activity.
 */
export default function OverviewTab({ stats, auditLog, openReportsCount, onNavigate }) {
  const statCards = getStatCards(stats);

  return (
    <div className="admin-page active" id="page-overview">
      <div className="stats-grid">
        {statCards.map((card) => (
          <StatCard
            key={card.id}
            card={card}
            onClick={() => onNavigate(card.page)}
          />
        ))}
      </div>

      <PlatformHealth openReportsCount={openReportsCount} />
      <QuickActions onNavigate={onNavigate} />
      <RecentAuditList auditLog={auditLog} onNavigate={onNavigate} />
    </div>
  );
}
