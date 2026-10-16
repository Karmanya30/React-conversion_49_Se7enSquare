import React from 'react';

/**
 * JoinedCommunities Component
 * Renders horizontally scrolling list of joined communities and quick "Create Community" action card.
 */
export default function JoinedCommunities({ communities, loading, navigate }) {
  return (
    <div>
      <div className="section-header">
        <div className="section-title">Joined Communities</div>
        <div
          className="section-link"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/discovery')}
        >
          View all →
        </div>
      </div>
      {loading ? (
        <div style={{ color: 'var(--text-3,#666)', fontSize: '13px', padding: '20px 0' }}>
          Loading communities…
        </div>
      ) : (
        <div className="communities-scroll">
          {communities.map((comm) => (
            <div
              key={comm.id}
              className="comm-card"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/community-page?id=${comm.id}`)}
            >
              <div className="comm-card-banner banner-purple"></div>
              <div className="comm-card-icon grad-purple">{comm.icon || '🏘️'}</div>
              <div className="comm-card-name">{comm.name}</div>
              <div className="comm-card-meta">
                <span>{(comm.members || comm.memberCount || 0).toLocaleString()} members</span>
              </div>
            </div>
          ))}
          <div
            className="comm-card create-card"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/create-community')}
          >
            <div style={{ fontSize: '24px', color: 'var(--accent)', marginBottom: '4px' }}>+</div>
            <div className="comm-card-name" style={{ marginTop: 0 }}>Create Community</div>
            <div className="comm-card-meta">Start your journey</div>
          </div>
        </div>
      )}
    </div>
  );
}
