import React from 'react';

/**
 * Metric card component for Overview statistics.
 */
export default function StatCard({ card, onClick }) {
  return (
    <div
      className="stat-card"
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <div className={`stat-icon ${card.bg}`}>{card.icon}</div>
      <div className="stat-info">
        <div className="stat-val">{card.val}</div>
        <div className="stat-label">{card.label}</div>
        <div className="stat-trend up">{card.trend} this week</div>
      </div>
    </div>
  );
}
