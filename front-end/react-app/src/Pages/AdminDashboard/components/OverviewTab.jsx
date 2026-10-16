import React from 'react';
import StatCard from '../../../Components/platform/common/StatCard';
import { getStatCards } from '../../../Components/platform/data/adminData';
import PlatformHealth from './PlatformHealth';
import QuickActions from './QuickActions';

/**
 * Overview tab composing stat cards, health metrics, and quick actions.
 */
export default function OverviewTab({ stats, openReportsCount, onNavigate }) {
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
    </div>
  );
}
