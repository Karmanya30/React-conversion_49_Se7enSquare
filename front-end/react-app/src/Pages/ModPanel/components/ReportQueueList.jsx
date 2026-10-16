import React from 'react';

/**
 * Left panel — report queue: search input, tab pills, and report cards.
 */
export default function ReportQueueList({
  QUEUE_TABS,
  activeQTab, onTabChange,
  queueSearch, onQueueSearchChange,
  queueCounts,
  loading,
  filteredReports,
  selectedReport, onSelectReport,
}) {
  return (
    <div className="queue-panel">
      <div className="qp-header">
        <div className="qp-title">
          Report Queue <span className="qp-count" id="queueCount">{queueCounts[activeQTab] || 0}</span>
        </div>
        <div className="qp-tabs">
          {QUEUE_TABS.map(tab => (
            <div
              key={tab}
              className={`qp-tab${activeQTab === tab ? ' on' : ''}`}
              onClick={() => onTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}{' '}
              {queueCounts[tab] > 0 && `(${queueCounts[tab]})`}
            </div>
          ))}
        </div>
      </div>

      <div className="qp-search">
        <input
          type="text"
          placeholder="🔍 Search reports…"
          value={queueSearch}
          onChange={e => onQueueSearchChange(e.target.value)}
        />
      </div>

      <div className="queue-list" id="queueList">
        {loading ? (
          <div style={{ padding: '20px', color: 'var(--text-3,#666)', fontSize: '13px' }}>
            Loading reports…
          </div>
        ) : filteredReports.length === 0 ? (
          <div style={{ padding: '20px', color: 'var(--text-3,#666)', fontSize: '13px', textAlign: 'center' }}>
            {activeQTab === 'pending' ? '✅ All clear! No pending reports.' : `No ${activeQTab} reports.`}
          </div>
        ) : (
          filteredReports.map(report => (
            <div
              key={report.id}
              className={`queue-item${selectedReport?.id === report.id ? ' active' : ''}`}
              onClick={() => onSelectReport(report)}
              style={{ cursor: 'pointer' }}
            >
              <div className="qi-top">
                <span className="qi-ref">{report.ref}</span>
                <span className={`qi-sev sev-${report.severity}`}>{report.severity}</span>
              </div>
              <div className="qi-user">@{report.reportedUser} in {report.channel}</div>
              <div className="qi-reason">{report.reason}</div>
              <div className="qi-time">{report.date}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
