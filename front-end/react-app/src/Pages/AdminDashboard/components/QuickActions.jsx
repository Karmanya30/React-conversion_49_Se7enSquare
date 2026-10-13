import React from 'react';

/**
 * Shortcuts to high-priority admin actions.
 */
export default function QuickActions({ onNavigate }) {
  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <div className="card-header">
        <h3 style={{ margin: 0 }}>⚡ Quick Actions</h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px' }}>
        <button
          onClick={() => onNavigate('moderation')}
          style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#f87171', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
        >
          🛡️ Review Mod Queue →
        </button>
        <button
          onClick={() => onNavigate('config')}
          style={{ padding: '12px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', color: '#818cf8', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
        >
          ⚙️ AutoMod Config →
        </button>
        <button
          onClick={() => onNavigate('applications')}
          style={{ padding: '12px', background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: '8px', color: '#facc15', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
        >
          📋 Pending Apps →
        </button>
        <button
          onClick={() => onNavigate('audit')}
          style={{ padding: '12px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '8px', color: '#34d399', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
        >
          📜 Security Audit →
        </button>
      </div>
    </div>
  );
}
