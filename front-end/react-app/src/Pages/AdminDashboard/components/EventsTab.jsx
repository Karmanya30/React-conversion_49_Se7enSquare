import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Events management overview with link to Event Approval.
 */
export default function EventsTab({ events }) {
  const navigate = useNavigate();
  const eventsList = events || [];

  return (
    <div className="admin-page active" id="page-events-mgmt">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontFamily: "'Syne',sans-serif" }}>Platform Events</h3>
        <button
          onClick={() => navigate('/event-approval')}
          style={{ padding: '8px 16px', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
        >
          Event Approval →
        </button>
      </div>
      {eventsList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-3, #888)' }}>
          📅 No platform events scheduled yet.
        </div>
      ) : (
        eventsList.map((ev) => (
          <div
            key={ev.id}
            className="card"
            style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}
          >
          <span style={{ fontSize: '20px' }}>📅</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>{ev.title}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-3,#666)', marginTop: '3px' }}>
              {ev.community} • {ev.date}
            </div>
          </div>
          <span
            style={{
              background: ev.status === 'approved' ? 'rgba(52,211,153,0.15)' : 'rgba(245,158,11,0.15)',
              color: ev.status === 'approved' ? '#34d399' : '#f59e0b',
              padding: '3px 8px',
              borderRadius: '5px',
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
            {(ev.status || 'PENDING').toUpperCase()}
          </span>
        </div>
      )))}
    </div>
  );
}
