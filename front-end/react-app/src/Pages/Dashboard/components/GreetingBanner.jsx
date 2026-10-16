import React from 'react';

/**
 * GreetingBanner Component
 * Shows personalized greeting, unread message and event count summary, and 3 key overview metrics.
 */
export default function GreetingBanner({ greeting, user, unreadCount, events, stats, communities }) {
  return (
    <div className="greeting">
      <div className="greeting-text">
        <div className="greeting-name">
          {greeting}, <span className="user-name">{user.firstName}</span> 👋
        </div>
        <div className="greeting-sub">
          You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''} and {events.length} upcoming event{events.length !== 1 ? 's' : ''} today.
        </div>
      </div>
      <div className="greeting-stats">
        <div className="g-stat">
          <div className="g-stat-val">{stats?.totalCommunities ?? communities.length}</div>
          <div className="g-stat-label">Communities</div>
        </div>
        <div className="g-stat">
          <div className="g-stat-val">{unreadCount}</div>
          <div className="g-stat-label">Messages</div>
        </div>
        <div className="g-stat">
          <div className="g-stat-val">{stats?.totalEvents ?? events.length}</div>
          <div className="g-stat-label">Events</div>
        </div>
      </div>
    </div>
  );
}
