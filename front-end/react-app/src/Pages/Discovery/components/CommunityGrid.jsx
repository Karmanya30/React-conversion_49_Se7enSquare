import React from 'react';
import CommunityCard from './CommunityCard';

/**
 * Responsive grid container for community cards.
 * Handles loading, empty, and populated states.
 */
export default function CommunityGrid({ loading, filtered, communities, joinedIds, onToggleJoin }) {
  return (
    <div className="body-area">
      <div className="grid-header">
        <div>
          <span className="grid-title">All Communities</span>
          <span className="grid-count" id="gridCount">
            {loading ? 'Loading communities…' : `Showing ${filtered.length} of ${communities.length}`}
          </span>
        </div>
      </div>
      <div className="comm-grid" id="commGrid">
        {loading ? (
          <div style={{ color: 'var(--text-3,#666)', fontSize: '13px', gridColumn: '1/-1', padding: '40px 0', textAlign: 'center' }}>
            Loading communities…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ color: 'var(--text-3,#666)', fontSize: '13px', gridColumn: '1/-1', padding: '40px 0', textAlign: 'center' }}>
            No communities match your search.
          </div>
        ) : (
          filtered.map(comm => (
            <CommunityCard
              key={comm.id}
              comm={comm}
              isJoined={joinedIds.has(String(comm.id))}
              onToggleJoin={onToggleJoin}
            />
          ))
        )}
      </div>
    </div>
  );
}
