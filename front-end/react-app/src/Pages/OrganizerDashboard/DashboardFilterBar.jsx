// Filter toolbar for segmenting tournaments by status with quick host tournament CTA.
import React from 'react';
import { EVENT_STATUSES } from '../../Components/event-management/utils/constants';

const FILTERS = [
  'all',
  EVENT_STATUSES.APPROVED,
  EVENT_STATUSES.PENDING,
  EVENT_STATUSES.CANCELLED,
];

export default function DashboardFilterBar({
  currentFilter = 'all',
  onSelectFilter,
  onHostTournament,
}) {
  return (
    <div className="page-toolbar">
      <div className="filter-bar">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${currentFilter === filter ? 'on' : ''}`}
            onClick={() => onSelectFilter && onSelectFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
      <div className="toolbar-right">
        <button className="btn-primary" onClick={onHostTournament}>
          + Host Tournament
        </button>
      </div>
    </div>
  );
}
