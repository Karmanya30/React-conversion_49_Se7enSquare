import React from 'react';

/**
 * Platform health metrics cards panel.
 */
export default function PlatformHealth({ openReportsCount }) {
  return (
    <div style={{ marginTop: '24px' }}>
      <h3 style={{ margin: 0, fontFamily: "'Syne',sans-serif", marginBottom: '16px' }}>
        Platform Health &amp; Telemetry
      </h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-green">🤖</div>
          <div className="stat-info">
            <div className="stat-val">98.2%</div>
            <div className="stat-label">AutoMod Accuracy</div>
            <div className="stat-trend up">Automated resolution rate</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-cyan">⚡</div>
          <div className="stat-info">
            <div className="stat-val">42ms</div>
            <div className="stat-label">API Latency</div>
            <div className="stat-trend up">Global p95 benchmark</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-orange">⚠️</div>
          <div className="stat-info">
            <div className="stat-val">{openReportsCount}</div>
            <div className="stat-label">Open Escalations</div>
            <div className="stat-trend down">Requires staff review</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-purple">🛡️</div>
          <div className="stat-info">
            <div className="stat-val">99.98%</div>
            <div className="stat-label">System Uptime</div>
            <div className="stat-trend up">Rolling 30-day window</div>
          </div>
        </div>
      </div>
    </div>
  );
}
