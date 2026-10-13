import React from 'react';

/**
 * Panel 1: Select or confirm content/target to report.
 */
export default function TargetStep({
  selectedTarget,
  setSelectedTarget,
  userSearch,
  handleUserSearch,
  searchResults,
  goStep,
}) {
  return (
    <div className="panel active" id="panel1">
      <div className="panel-card">
        {selectedTarget ? (
          <div id="contextTargetWrap">
            <div className="panel-title">Confirm what you're reporting</div>
            <div className="panel-sub">
              Reports are anonymous and reviewed by community moderators within 24 hours.
            </div>
            {selectedTarget.type === 'user' && (
              <div className="user-preview">
                <div className="up-av" id="ctxUserAv">
                  {selectedTarget.name?.slice(0, 2).toUpperCase() || '?'}
                </div>
                <div className="up-info">
                  <div className="up-name" id="ctxUserName">{selectedTarget.name}</div>
                  <div className="up-meta">User</div>
                </div>
                <div className="up-flag">Selected</div>
              </div>
            )}
            {selectedTarget.type === 'message' && (
              <div className="msg-preview">
                <div className="mp-av">💬</div>
                <div className="mp-body">
                  <div className="mp-text" id="ctxMsgText">{selectedTarget.text || 'Message content'}</div>
                </div>
                <div className="mp-flag">Selected</div>
              </div>
            )}
            {selectedTarget.type === 'community' && (
              <div className="user-preview">
                <div className="up-av" id="ctxCommIcon">🏘️</div>
                <div className="up-info">
                  <div className="up-name" id="ctxCommName">{selectedTarget.name}</div>
                </div>
                <div className="up-flag">Selected</div>
              </div>
            )}
            <div className="btn-row" style={{ marginTop: '16px' }}>
              <button className="btn-back" onClick={() => setSelectedTarget(null)}>
                Report something else instead
              </button>
              <button className="btn-next" onClick={() => goStep(2)}>
                Choose Reason →
              </button>
            </div>
          </div>
        ) : (
          <div id="userSearchWrap">
            <div className="panel-title">Who are you reporting?</div>
            <div className="panel-sub">
              Search by username, or paste a numeric User ID directly. To report a specific message, use "Report Message" from inside the channel instead.
            </div>
            <div className="additional-field">
              <label>Search users or enter a User ID</label>
              <input
                type="text"
                id="userSearchInput"
                placeholder="e.g. player01 or 4"
                autoComplete="off"
                value={userSearch}
                onChange={(e) => handleUserSearch(e.target.value)}
              />
            </div>
            <div
              id="userSearchResults"
              style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}
            >
              {searchResults.map((u) => (
                <div
                  key={u.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'var(--bg-card,#151d2f)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: '1px solid var(--border,rgba(255,255,255,0.06))',
                  }}
                  onClick={() => setSelectedTarget({ type: 'user', id: u.id, name: u.name || u.username })}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#6366f1',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '12px',
                    }}
                  >
                    {(u.name || u.username).slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{u.name || u.username}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3,#666)' }}>@{u.username}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="notice-bar" style={{ marginTop: '20px' }}>
          <div className="notice-icon">🔒</div>
          <div className="notice-text">
            <strong>Your report is fully anonymous.</strong> The reported user will never know who submitted this report. False or malicious reports may result in action against your own account.
          </div>
        </div>
      </div>
    </div>
  );
}
