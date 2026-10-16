// Metric stat card used on the Organizer Dashboard.
import React from 'react';

export default function StatCard({
  icon = '🏆',
  colorClass = 'bg-purple',
  value = 0,
  label = '',
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${colorClass}`}>{icon}</div>
      <div className="stat-data">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
