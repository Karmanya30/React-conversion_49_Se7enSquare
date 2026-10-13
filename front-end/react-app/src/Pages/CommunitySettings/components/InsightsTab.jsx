import React from 'react';

/**
 * Tab 5: Community Insights metrics and boost levels.
 */
export default function InsightsTab({ community }) {
  return (
    <section className="settings-tab section active">
      <div className="settings-card">
        <div className="settings-card-title">Community Insights</div>
        <div style={{ display: 'flex', gap: '24px', marginTop: '16px', flexWrap: 'wrap' }}>
          <div style={{ minWidth: '120px' }}>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>
              {community.memberCount || community.members.length}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Members</div>
          </div>
          <div style={{ minWidth: '120px' }}>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{community.channels.length}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Channels</div>
          </div>
          <div style={{ minWidth: '120px' }}>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{community.onlineCount || 12}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Online now</div>
          </div>
        </div>
      </div>

      <div className="settings-card" style={{ marginTop: '20px' }}>
        <div className="settings-card-title">💎 Community Boost</div>
        <div style={{ fontSize: '13px', color: 'var(--text-2)', marginTop: '10px' }}>
          Boost Level 1 Active (5 boosts from members)
        </div>
        <div style={{ marginTop: '12px', fontSize: '12.5px', color: 'var(--text-3)', lineHeight: '1.8' }}>
          • 100 Custom Emoji Slots<br />
          • 128 Kbps Audio Quality in Voice Channels<br />
          • Custom Community Banner &amp; Invite Splash
        </div>
      </div>
    </section>
  );
}
