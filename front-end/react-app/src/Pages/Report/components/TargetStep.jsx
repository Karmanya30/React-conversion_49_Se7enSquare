import React from 'react';

/**
 * Panel 1: Select or confirm user to report.
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
              Reports are anonymous and reviewed by moderators within 24 hours.
            </div>

            {selectedTarget.type === 'user' && (
              <div className="user-preview" style={{ display: 'flex' }}>
                <div className="up-av" id="ctxUserAv">
                  {selectedTarget.name ? selectedTarget.name.slice(0, 2).toUpperCase() : 'US'}
                </div>
                <div className="up-info">
                  <div className="up-name" id="ctxUserName">{selectedTarget.name}</div>
                  <div className="up-meta">User &bull; ID: #{selectedTarget.id}</div>
                </div>
                <div className="up-flag">Selected</div>
              </div>
            )}

            {selectedTarget.type === 'message' && (
              <div className="msg-preview">
                <div className="mp-av">💬</div>
                <div className="mp-body">
                  <div className="mp-header">
                    <span className="mp-name">{selectedTarget.author ? `@${selectedTarget.author}` : 'Chat Message'}</span>
                    <span className="mp-ch">Selected Message</span>
                  </div>
                  <div className="mp-text" id="ctxMsgText">{selectedTarget.text || 'Message content'}</div>
                </div>
                <div className="mp-flag">Selected</div>
              </div>
            )}

            <div className="btn-row" style={{ marginTop: '20px' }}>
              <button className="btn-back" onClick={() => setSelectedTarget(null)}>
                Report someone else instead
              </button>
              <button className="btn-next" onClick={() => goStep(2)}>
                Choose Reason &rarr;
              </button>
            </div>
          </div>
        ) : (
          <div id="targetSelectWrap">
            <div className="panel-title">Who are you reporting?</div>
            <div className="panel-sub">
              Search by username, or paste a numeric User ID directly. To report a specific chat message, use "Report Message" directly from inside the chat channel.
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
                    background: 'var(--bg-card, #151d2f)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: '1px solid var(--border, rgba(255,255,255,0.06))',
                    transition: 'background 0.15s ease',
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
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>{u.name || u.username}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3, #666)' }}>@{u.username} &bull; ID: #{u.id}</div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#6366f1', fontWeight: 600 }}>Select &rarr;</span>
                </div>
              ))}
              {userSearch && searchResults.length === 0 && (
                <div style={{ fontSize: '13px', color: '#8b949e', padding: '12px', textAlign: 'center' }}>
                  No users found matching "{userSearch}"
                </div>
              )}
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
