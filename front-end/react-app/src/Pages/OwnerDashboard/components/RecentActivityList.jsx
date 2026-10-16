import React from 'react';

/**
 * Platform health indicator row: backend status, open reports,
 * pending events, pending appeals.
 */
export default function PlatformHealth({ stats }) {
  return (
    <div className="section-grid" style={{ marginTop: '24px' }}>
      <div className="card" style={{ padding: '20px' }}>
        <div className="card-header" style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>
            Platform Health
          </h3>
        </div>
        <div className="health-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div className="health-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span className="h-dot green" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
            Backend: <strong className="h-val">{stats.backendStatus}</strong>
          </div>
          <div className="health-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span className="h-dot green" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
            Open Reports: <strong className="h-val">{stats.pendingReportsCount}</strong>
          </div>
          <div className="health-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span className="h-dot green" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
            Pending Events: <strong className="h-val">{stats.pendingEventsCount}</strong>
          </div>
          <div className="health-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span className="h-dot green" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
            Pending Appeals: <strong className="h-val">{stats.pendingAppealsCount}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
