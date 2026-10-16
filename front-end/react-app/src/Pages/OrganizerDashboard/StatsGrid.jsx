// Overview metrics grid displaying summary statistics for tournaments, registrations, and revenue.
import React from 'react';
import StatCard from '../../Components/event-management/common/StatCard';

export default function StatsGrid({
  totalCount = 0,
  totalRegistrations = 0,
  pendingCount = 0,
  upcomingCount = 0,
  earnings = '0',
}) {
  return (
    <div className="stats-grid">
      <StatCard
        icon="🏆"
        colorClass="bg-purple"
        value={totalCount}
        label="My Tournaments"
      />
      <StatCard
        icon="👥"
        colorClass="bg-green"
        value={totalRegistrations}
        label="Total Registrations"
      />
      <StatCard
        icon="⏳"
        colorClass="bg-orange"
        value={pendingCount}
        label="Pending Approval"
      />
      <StatCard
        icon="📅"
        colorClass="bg-cyan"
        value={upcomingCount}
        label="Upcoming (Approved)"
      />
      <StatCard
        icon="💰"
        colorClass="bg-green"
        value={`₹${earnings}`}
        label="Est. Earnings (15%)"
      />
    </div>
  );
}
