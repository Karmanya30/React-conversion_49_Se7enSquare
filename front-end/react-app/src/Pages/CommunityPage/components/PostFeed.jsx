import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Channels tab: lists all community channels.
 * Members who have joined (or the community owner) can click into the chat;
 * non-members see a locked state.
 */
export default function PostFeed({ community, channelEntries, joined, isOwner, onLockedClick }) {
  const navigate = useNavigate();

  return (
    <div className="tab-content active" id="tab-channels">
      <div className="channels-layout">
        <div className="channels-main" id="channelsList">
          {channelEntries.length === 0 ? (
            <div style={{ padding: '12px', fontSize: '12px', color: 'var(--text-3,#888)' }}>No channels yet.</div>
          ) : (
            channelEntries.map((ch, i) => {
              const chanName = ch.name || `channel-${i}`;
              const isVoice = ch.type === 'Voice';
              if (joined || isOwner) {
                return (
                  <div
                    key={ch.id || chanName}
                    className="channel-row"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                      background: 'var(--bg-card,#151d2f)', borderRadius: '10px', marginBottom: '8px',
                      cursor: 'pointer', border: '1px solid var(--border,rgba(255,255,255,0.06))',
                      transition: 'border-color 0.2s',
                    }}
                    onClick={() => navigate(`/chat?community=${community.id}&cname=${encodeURIComponent(community.name)}&channel=${encodeURIComponent(chanName)}`)}
                  >
                    <span style={{ fontSize: '18px', opacity: 0.7 }}>{isVoice ? '🎙' : '#'}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-1,#fff)' }}>{chanName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-3,#666)', marginTop: '2px' }}>{ch.topic || (isVoice ? 'Voice channel' : 'Text channel')}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-3,#555)' }}>→</span>
                  </div>
                );
              }
              return (
                <div
                  key={ch.id || chanName}
                  className="channel-row ch-locked"
                  title="Join to access"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                    background: 'var(--bg-card,#151d2f)', borderRadius: '10px', marginBottom: '8px',
                    cursor: 'not-allowed', border: '1px solid var(--border,rgba(255,255,255,0.06))', opacity: 0.6,
                  }}
                  onClick={onLockedClick}
                >
                  <span style={{ fontSize: '16px' }}>🔒</span>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-1,#fff)' }}>{chanName}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
