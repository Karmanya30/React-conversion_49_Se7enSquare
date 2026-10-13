import React from 'react';

/**
 * Flagged content queue cards with resolution actions.
 */
export default function ModerationTab({ reports, onModerationAction }) {
  const modQueue = reports.length > 0 ? reports : [
    { id: 1, reason: 'Hate speech detected in chat', community: 'Pro Gamers', severity: 'high', content: 'Inappropriate slur used in match' },
    { id: 2, reason: 'Repeated spam / invite links', community: 'Dev Nexus', severity: 'medium', content: 'discord.gg/scamlink posted 14 times' },
    { id: 3, reason: 'Impersonation of moderator', community: 'Speedrunners', severity: 'critical', content: 'Display name cloned staff account' },
  ];

  return (
    <div className="admin-page active" id="page-moderation">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {modQueue.map((item) => (
          <div
            key={item.id}
            className="card"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: item.severity === 'critical' ? '#ef4444' : item.severity === 'high' ? '#f97316' : '#eab308',
                    color: '#fff',
                  }}
                >
                  {(item.severity || 'MEDIUM').toUpperCase()}
                </span>
                <span style={{ fontWeight: 600, color: '#fff' }}>{item.reason}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-3,#666)' }}>• {item.community}</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary,#ccc)', marginTop: '6px' }}>
                "{item.content}"
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="act-btn act-view"
                onClick={() => onModerationAction(item, 'dismiss')}
              >
                Dismiss
              </button>
              <button
                className="act-btn act-delete"
                onClick={() => onModerationAction(item, 'delete')}
              >
                Delete Content
              </button>
              <button
                className="act-btn act-delete"
                style={{ background: '#7f1d1d', borderColor: '#ef4444', color: '#fca5a5' }}
                onClick={() => onModerationAction(item, 'suspend_author')}
              >
                Suspend Author
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
