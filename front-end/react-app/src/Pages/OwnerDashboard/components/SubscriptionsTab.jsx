import React from 'react';

/**
 * Drill-down modal for OwnerDashboard.
 * Renders structured JSX for each drill kind from the data returned by useOwnerDashboard.
 */
export default function SubscriptionsTab({ drillModalOpen, drillTitle, drillLoading, drillContent, onClose }) {
  if (!drillModalOpen) return null;

  const renderContent = () => {
    if (drillLoading) {
      return (
        <div className="empty-state" style={{ padding: '30px' }}>
          <div className="empty-state-text">Loading…</div>
        </div>
      );
    }
    if (!drillContent) return null;

    if (drillContent.kind === 'error') {
      return <div style={{ color: 'var(--text-3)', padding: '20px' }}>Could not load details: {drillContent.message}</div>;
    }

    if (drillContent.kind === 'communities') {
      const { communities = [], users = [], loadError = '' } = drillContent;
      const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]));
      return (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Owner</th><th>Members</th><th>Category</th></tr></thead>
            <tbody>
              {communities.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3,#888)' }}>{loadError ? `⚠️ Could not load: ${loadError}` : 'No communities yet.'}</td></tr>
              ) : communities.map((c) => {
                const owner = usersById.get(String(c.ownerId));
                return (
                  <tr key={c.id}>
                    <td><div className="row-name">{c.icon || '🏘️'} {c.name}</div></td>
                    <td>{owner?.username || `user#${c.ownerId ?? '—'}`}</td>
                    <td>{(c.memberCount || 0).toLocaleString()}</td>
                    <td>{c.category || 'Gaming'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    if (drillContent.kind === 'events') {
      const { events = [], communities = [], loadError = '' } = drillContent;
      const commsById = new Map((Array.isArray(communities) ? communities : []).map((c) => [String(c.id), c]));
      const sorted = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
      return (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Title</th><th>Community</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3,#888)' }}>{loadError ? `⚠️ Could not load: ${loadError}` : 'No events yet.'}</td></tr>
              ) : sorted.map((e) => (
                <tr key={e.id}>
                  <td>
                    <div className="row-name">{e.title}</div>
                    <div className="row-sub" style={{ fontSize: '11.5px', color: 'var(--text-3,#888)' }}>
                      {e.type || 'event'}{e.entryFee ? ` · ₹${e.entryFee} entry` : ''}
                    </div>
                  </td>
                  <td>{commsById.get(String(e.communityId))?.name || `Community #${e.communityId ?? '—'}`}</td>
                  <td>{e.date}{e.time ? ` · ${e.time}` : ''}</td>
                  <td><span className={`badge badge-${e.status || 'pending'}`}>{e.status || 'pending'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (drillContent.kind === 'revenue') {
      const { payments = [], loadError = '' } = drillContent;
      const byType = payments.reduce((acc, p) => { acc[p.type] = (acc[p.type] || 0) + (p.amount || 0); return acc; }, {});
      const sorted = [...payments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 50);
      return (
        <div>
          {payments.length > 0 && (
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', marginBottom: '18px' }}>
              {Object.entries(byType).map(([type, amt]) => (
                <div key={type} className="stat-card" style={{ padding: '12px' }}>
                  <div className="stat-value" style={{ fontSize: '18px' }}>₹{amt.toLocaleString()}</div>
                  <div className="stat-label">{type.replace(/_/g, ' ')}</div>
                </div>
              ))}
            </div>
          )}
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Type</th><th>Amount</th><th>Description</th><th>Date</th></tr></thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3,#888)' }}>{loadError ? `⚠️ Could not load: ${loadError}` : 'No transactions yet.'}</td></tr>
                ) : sorted.map((p, i) => (
                  <tr key={p.id ?? i}>
                    <td><span className="badge badge-active">{p.type.replace(/_/g, ' ')}</span></td>
                    <td>₹{(p.amount || 0).toLocaleString()}</td>
                    <td>{p.description}</td>
                    <td>{new Date(p.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {payments.length > 50 && (
            <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-3,#888)' }}>
              Showing 50 most recent of {payments.length} transactions
            </div>
          )}
        </div>
      );
    }

    if (drillContent.kind === 'subscriptions') {
      const { subData = { byPlan: {}, subscribers: [] }, loadError = '' } = drillContent;
      const subscribers = Array.isArray(subData.subscribers) ? subData.subscribers : [];
      return (
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-3,#888)', marginBottom: '14px', lineHeight: 1.6 }}>
            "Active Premium Users" below is a live snapshot — how many people are on a paid plan <em>right now</em>.
            "Subscription Revenue" on the main dashboard is cumulative — every upgrade payment ever collected, which
            a later downgrade or cancellation doesn't reverse. The two numbers measure different things and won't
            always move together; that's expected, not a bug.
          </p>
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '18px' }}>
            {[
              { key: 'free', label: 'Free' },
              { key: 'plus', label: 'Plus' },
              { key: 'ultra_pro', label: 'Ultra Pro' },
            ].map(({ key, label }) => (
              <div key={key} className="stat-card" style={{ padding: '12px' }}>
                <div className="stat-value">{subData.byPlan?.[key] || 0}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>User</th><th>Plan</th><th>Since</th></tr></thead>
              <tbody>
                {subscribers.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3,#888)' }}>{loadError ? `⚠️ Could not load: ${loadError}` : 'No paid subscribers right now.'}</td></tr>
                ) : subscribers.map((s, idx) => (
                  <tr key={idx}>
                    <td>{s.username}</td>
                    <td><span className="badge badge-active">{s.plan === 'ultra_pro' ? 'Ultra Pro' : (s.plan ? s.plan[0].toUpperCase() + s.plan.slice(1) : 'Free')}</span></td>
                    <td>{s.startedAt ? new Date(s.startedAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (drillContent.kind === 'organisers') {
      const { orgs = [], filter = '', loadError = '' } = drillContent;
      return (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>User</th><th>Plan</th><th>Applied</th></tr></thead>
            <tbody>
              {orgs.length === 0 ? (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-3,#888)' }}>{loadError ? `⚠️ Could not load: ${loadError}` : `No ${filter} organisers.`}</td></tr>
              ) : orgs.map((o, idx) => (
                <tr key={idx}>
                  <td>{o.username || `user#${o.userId}`}</td>
                  <td><span className="badge badge-active">{o.plan === 'premium' ? 'Premium' : 'Free'}</span></td>
                  <td>{o.appliedAt ? new Date(o.appliedAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className="modal-overlay"
      style={{ display: 'flex' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-container" style={{ width: '640px', maxWidth: '92vw' }}>
        <div className="modal-header">
          <h3>{drillTitle}</h3>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>
        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
