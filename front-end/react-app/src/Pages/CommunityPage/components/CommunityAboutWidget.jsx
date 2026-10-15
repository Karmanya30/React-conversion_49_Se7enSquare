import React from 'react';
import { useNavigate } from 'react-router-dom';
import { memberCountOf, onlineCountOf, initialsFromName } from '../../../Components/platform/hooks/useCommunityPage';

/**
 * Overview tab: pinned announcement, about section, stats grid,
 * recent messages feed, active events sidebar, and created-by card.
 */
export default function CommunityAboutWidget({
  community, channelEntries, foundedLabel, events,
}) {
  const navigate = useNavigate();

  return (
    <div className="tab-content active" id="tab-overview">
      <div className="overview-left">
        {/* Pinned Announcement — driven by community description */}
        <div className="pinned-card">
          <div className="pin-header">📌 Welcome to {community.name}</div>
          <div className="pin-text">
            {community.description ||
              `Welcome to ${community.name}! Introduce yourself in #general and let us know what you're working on.`}
          </div>
          {foundedLabel && (
            <div className="pin-footer">
              <div className="pin-author">
                <div className="pin-av user-avatar"></div>
                <span>Community · Founded {foundedLabel}</span>
              </div>
            </div>
          )}
        </div>

        {/* About */}
        <div className="section-card">
          <div className="sc-title">
            <span className="sc-title-icon">ℹ</span> About <span className="comm-name-text">{community.name}</span>
          </div>
          <div className="about-text" id="comm-description">{community.description}</div>
          <div className="tag-row">
            {(community.tags || []).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="section-card">
          <div className="sc-title"><span className="sc-title-icon">📊</span> Community Stats</div>
          <div className="stat-grid">
            <div className="stat-box">
              <div className="stat-val" id="stat-total-members">{memberCountOf(community).toLocaleString()}</div>
              <div className="stat-lbl">Total Members</div>
            </div>
            <div className="stat-box">
              <div className="stat-val stat-online" id="stat-online-now">{onlineCountOf(community).toLocaleString()}</div>
              <div className="stat-lbl">Online Now</div>
            </div>
            <div className="stat-box">
              <div className="stat-val">{channelEntries.length}</div>
              <div className="stat-lbl">Channels</div>
            </div>
            <div className="stat-box">
              <div className="stat-val">—</div>
              <div className="stat-lbl">Messages Sent</div>
            </div>
          </div>
        </div>

        {/* Recent Messages — static demo content, same as the legacy page */}
        <div className="section-card">
          <div className="sc-title"><span className="sc-title-icon">💬</span> Recent Messages</div>
          <div className="messages-feed">
            {[
              { initials: 'AM', name: 'Alex Morgan', time: '10:41 AM', text: "This looks incredible! Love the design direction. Are you using Gameunity's design system?", reactions: [] },
              { initials: 'MP', name: 'Maya Petrov', time: '10:44 AM', text: "Sharing our team's early UI mockup for the hackathon 👀", reactions: [{ emoji: '🔥', count: 22 }, { emoji: '😍', count: 8 }] },
              { initials: 'RK', name: 'Rahul Kumar', time: '10:08 AM', role: 'Moderator', text: 'Check out the nexus-cli setup snippet in #dev-talk', reactions: [] },
            ].map((msg, i) => (
              <div key={i} className="msg-group">
                <div className="msg-av" style={{ fontWeight: 700, fontSize: '12px', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: i === 0 ? '#6366f1' : i === 1 ? '#ec4899' : '#8b5cf6', color: '#fff' }}>
                  {msg.initials}
                </div>
                <div className="msg-body">
                  <div className="msg-header">
                    <span className="msg-uname">{msg.name}</span>
                    {msg.role && <span className="msg-role role-moderator-badge">{msg.role}</span>}
                    <span className="msg-time">{msg.time}</span>
                  </div>
                  <div className="msg-text">{msg.text}</div>
                  {msg.reactions.length > 0 && (
                    <div className="reactions">
                      {msg.reactions.map((r, j) => (
                        <div key={j} className="FPS-pill"><span>{r.emoji}</span><span className="FPS-count">{r.count}</span></div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="view-more-messages">
            <button
              className="view-more-btn"
              onClick={() => navigate(`/chat?community=${community.id}&cname=${encodeURIComponent(community.name)}`)}
            >
              View Community Posts →
            </button>
          </div>
        </div>
      </div>

      <div className="overview-right">
        {/* Active Events */}
        <div className="section-card">
          <div className="sc-title"><span className="sc-title-icon">📅</span> Active Events</div>
          <div id="activeEventsList">
            {events.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-3,#888)', fontSize: '13px' }}>
                No active events yet
              </div>
            ) : (
              events.map((ev) => {
                const date = new Date(ev.date);
                const day = Number.isNaN(date.getTime()) ? '—' : String(date.getDate()).padStart(2, '0');
                const month = Number.isNaN(date.getTime()) ? '' : date.toLocaleString('en-US', { month: 'short' });
                return (
                  <div
                    key={ev.id}
                    className="event-mini"
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(99,102,241,0.08)', borderRadius: '10px', marginBottom: '10px', cursor: 'pointer' }}
                    onClick={() => navigate('/events')}
                  >
                    <div style={{ textAlign: 'center', minWidth: '38px' }}>
                      <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase' }}>{month}</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>{day}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{ev.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3,#666)', marginTop: '2px' }}>
                        {ev.time || '—'} · {ev.attendees || 0} attending
                      </div>
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', textTransform: 'capitalize' }}>
                      {ev.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Created By */}
        <div className="section-card">
          <div className="sc-title"><span className="sc-title-icon">👤</span> Created By</div>
          <div className="created-by-card">
            <div className="created-by-avatar" style={{ background: '#f59e0b', color: '#000', fontWeight: 700, width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {initialsFromName(community.ownerName || community.createdBy || 'Owner')}
            </div>
            <div>
              <div className="created-by-name">{community.ownerName || community.createdBy || 'Community Owner'}</div>
              <div className="created-by-meta">Owner{foundedLabel ? ` · Since ${foundedLabel}` : ''}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
