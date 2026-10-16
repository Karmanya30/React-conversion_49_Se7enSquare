// Banner showcasing the top featured upcoming event.
import React from 'react';

export default function FeaturedEventBanner({
  event,
  comm,
  isRegistered = false,
  onView,
  onRegister,
}) {
  if (!event) return null;

  return (
    <div className="featured-event">
      <div
        className="featured-banner"
        style={{
          background:
            'linear-gradient(135deg,rgba(91,110,245,0.4),rgba(235,94,40,0.25)),url(https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop) center/cover',
          height: '240px',
        }}
      >
        <div className="featured-badges">
          <span className="ev-badge badge-tournament">🏆 FEATURED</span>
          <span className="ev-badge badge-online">{event.type || 'Tournament'}</span>
        </div>
      </div>
      <div className="featured-body">
        <div className="featured-meta-row">
          <div className="featured-date">
            📅 {event.date || 'Upcoming'} {event.time ? `· ${event.time}` : ''}
          </div>
          <div className="featured-comm">
            <div className="featured-comm-av">{comm?.icon || '🎮'}</div>
            <div>{comm?.name || 'Community'}</div>
          </div>
        </div>
        <div className="featured-title">{event.title}</div>
        <div className="featured-desc">
          {event.description ||
            'Join this featured event and compete with players across the community.'}
        </div>
        <div className="featured-actions">
          <button
            className="btn-primary"
            style={{ padding: '10px 22px' }}
            onClick={() => onView && onView(event)}
          >
            View Details
          </button>
          <button
            className={`btn-secondary${isRegistered ? ' registered' : ''}`}
            style={{ padding: '10px 22px' }}
            aria-label="Register for featured event"
            onClick={() => {
              if (!isRegistered && onRegister) onRegister(event);
            }}
            disabled={isRegistered}
          >
            {isRegistered ? '✓ Registered' : 'Register Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
