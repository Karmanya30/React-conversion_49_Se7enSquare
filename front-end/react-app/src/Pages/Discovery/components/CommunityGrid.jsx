import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityCard from './CommunityCard';
import { memberCountOf, onlineCountOf } from '../../../Components/platform/data/discoveryData';

/**
 * body-area: featured banner + community grid.
 * Mirrors the HTML structure: #featuredSection + .grid-header + .comm-grid
 */
export default function CommunityGrid({ loading, filtered, communities, joinedIds, onToggleJoin }) {
  const navigate = useNavigate();

  // Featured = highest onlineCount community (mirrors renderFeaturedCommunity in discovery.js)
  const featured = communities.length > 0
    ? [...communities].sort((a, b) => onlineCountOf(b) - onlineCountOf(a))[0]
    : null;
  const featJoined = featured ? joinedIds.has(String(featured.id)) : false;

  return (
    <div className="body-area discovery-body-area">
      {/* Featured Community Banner */}
      {featured && (
        <div
          className="featured-banner"
          onClick={() => navigate(`/community/${featured.id}`)}
        >
          <div className={`feat-icon ${featured.grad || 'grad-purple'}`}>
            {featured.icon || '🏘️'}
          </div>
          <div className="feat-info">
            <div className="feat-name">{featured.name}</div>
            <div className="feat-desc">{featured.description}</div>
            <div className="feat-meta">
              <div className="feat-tag">
                <span className="dot"></span>
                {onlineCountOf(featured).toLocaleString()} online
              </div>
              <div className="feat-tag">👥 {memberCountOf(featured).toLocaleString()} members</div>
              <div className="feat-tag">📍 {featured.category || 'Gaming'}</div>
            </div>
          </div>
          <button
            className={`btn-join-feat${featJoined ? ' joined' : ''}`}
            onClick={e => { e.stopPropagation(); onToggleJoin(featured.id, e); }}
          >
            {featJoined ? '✓ Joined' : 'Join Community'}
          </button>
        </div>
      )}

      {/* Grid Header */}
      <div className="grid-header">
        <div>
          <span className="grid-title">All Communities</span>
          <span className="grid-count" id="gridCount">
            {loading ? 'Loading communities…' : `Showing ${filtered.length} of ${communities.length}`}
          </span>
        </div>
      </div>

      {/* Community Cards Grid */}
      <div className="comm-grid" id="commGrid">
        {loading ? (
          <div style={{ color: 'var(--text-3,#666)', fontSize: '13px', gridColumn: '1/-1', padding: '40px 0', textAlign: 'center' }}>
            Loading communities…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ color: 'var(--text-3,#666)', fontSize: '13px', gridColumn: '1/-1', padding: '40px 0', textAlign: 'center' }}>
            No communities found matching your criteria.
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
