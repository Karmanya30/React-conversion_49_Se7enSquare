import React from 'react';

/**
 * Left channel sidebar — community header, channel search, channel list, voice footer.
 */
export default function ChatSidebar({
  communityName,
  channelSearch, onChannelSearchChange,
  filteredChannels, loading,
  activeChannel, onSelectChannel,
  user, muted, onToggleMute,
  deafened, onToggleDeafen,
}) {
  const displayName = !communityName || communityName === 'Community' ? 'FPS Arena' : communityName;
  const initials = user?.name ? user.name.split(' ').map(p => p[0]).join('').slice(0, 2) : 'AK';
  const fullName = user?.fullName || user?.firstName || 'Rahul Kumar';

  return (
    <nav className="ch-sidebar">
      <div className="comm-header">
        <div className="comm-header-top">
          <div
            className="comm-icon-sm"
            id="chatCommIcon"
            style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}
          >
            🔥
          </div>
          <div className="comm-hname" id="chatCommName">{displayName}</div>
        </div>
        <div className="comm-hmeta">Online</div>
      </div>

      <div className="ch-search">
        <input
          type="text"
          placeholder="Search channels…"
          value={channelSearch}
          onChange={e => onChannelSearchChange(e.target.value)}
        />
      </div>

      <div className="ch-list" id="channelsList">
        <div className="ch-group-lbl" style={{ padding: '8px 8px 4px', fontSize: '11px', color: 'var(--text-3)', fontWeight: 700, letterSpacing: '0.8px' }}>
          TEXT CHANNELS
        </div>
        {loading ? (
          <div style={{ padding: '12px 16px', color: 'var(--sb-text)', fontSize: '13px' }}>Loading…</div>
        ) : filteredChannels.map(ch => (
          <div
            key={ch.id}
            className={`ch-row${activeChannel?.id === ch.id || activeChannel?.name === ch.name ? ' active' : ''}`}
            onClick={() => onSelectChannel(ch)}
          >
            <span className="ch-hash">#</span>
            <span className="ch-lbl">{ch.name}</span>
          </div>
        ))}
      </div>

      <div className="ch-footer">
        <div
          className="user-av"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '11px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {initials}
          <span
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              border: '1.5px solid var(--bg-sidebar)',
            }}
          />
        </div>
        <div className="user-av-name" style={{ fontSize: '13px', fontWeight: 600 }}>
          {fullName}
        </div>
        <div className="mic-btn" id="muteMicBtn" title="Mute Mic" onClick={onToggleMute}>
          {muted ? '🔇' : '🎤'}
        </div>
        <div className="mic-btn" id="deafenBtn" title="Deafen" onClick={onToggleDeafen}>
          {deafened ? '🔕' : '🎧'}
        </div>
      </div>
    </nav>
  );
}
