import React from 'react';

/**
 * Tab 3: List of community channels with delete action and trigger to open modal.
 */
export default function ChannelsTab({ channels, onDeleteChannel, onOpenModal }) {
  return (
    <section className="settings-tab section active">
      <div className="settings-card">
        <div
          className="settings-card-head"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}
        >
          <div className="settings-card-title">Channels</div>
          <button className="btn btn-primary" onClick={onOpenModal}>
            Create Channel
          </button>
        </div>
        <div className="channel-list">
          {channels.map((ch) => (
            <div
              key={ch.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>
                  {ch.type === 'Voice' ? '🎙' : ch.type === 'Announcement' ? '📢' : '💬'}
                </span>
                <span style={{ fontWeight: 600 }}>#{ch.name}</span>
                <span className="badge badge-active" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  {ch.type}
                </span>
              </div>
              <button
                className="btn btn-muted"
                style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--error)' }}
                onClick={() => onDeleteChannel(ch.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
