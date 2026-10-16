import React from 'react';

/**
 * Message feed — renders scrollable message list with day divider,
 * avatars, role badges, text, reaction pills, and hover action toolbar.
 */
export default function MessageFeed({
  filteredMessages,
  showEmojiPicker, onToggleEmojiPicker,
  EMOJIS,
  onToggleReaction,
  onSetReplyTo,
  messagesEndRef,
}) {
  return (
    <div className="messages-wrap" id="messagesWrap">
      {/* Centered Date Separator matching design */}
      <div className="day-divider">
        <span>May 1, 2026</span>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="chat-empty-state" style={{ display: 'flex' }}>
          <div className="empty-icon">👋</div>
          <div className="empty-text">Start the conversation</div>
        </div>
      ) : (
        filteredMessages.map(msg => (
          <div key={msg.id} className="msg-group">
            <div
              className="msg-av"
              style={{ background: msg.color || '#6366f1', color: '#fff' }}
            >
              {msg.initials}
            </div>

            <div className="msg-body">
              <div className="msg-header">
                <span className="msg-uname">{msg.author}</span>
                {msg.role && (
                  <span className={`msg-role role-${msg.role.toLowerCase()}-badge`}>
                    {msg.role}
                  </span>
                )}
                <span className="msg-time">{msg.time}</span>
              </div>

              <div className="msg-text">{msg.text}</div>

              {msg.reactions && msg.reactions.length > 0 && (
                <div className="reactions">
                  {msg.reactions.map((r, i) => (
                    <div
                      key={i}
                      className="reaction-pill mine"
                      onClick={() => onToggleReaction(msg.id, r.emoji)}
                    >
                      <span>{r.emoji}</span>
                      <span className="reaction-count">{r.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="msg-actions">
              <button
                type="button"
                className="act-btn"
                title="Add Reaction"
                onClick={() => onToggleEmojiPicker(p => p === msg.id ? null : msg.id)}
              >
                😊
              </button>
              <button
                type="button"
                className="act-btn"
                title="Reply"
                onClick={() => onSetReplyTo(msg.author)}
              >
                ↩
              </button>
              <button
                type="button"
                className="act-btn"
                title="More"
              >
                ⋯
              </button>
            </div>

            {showEmojiPicker === msg.id && (
              <div
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '16px',
                  zIndex: 100,
                  background: 'var(--bg-card,#151d2f)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '12px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  maxWidth: '220px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                }}
              >
                {EMOJIS.map(e => (
                  <span
                    key={e}
                    style={{ cursor: 'pointer', fontSize: '18px' }}
                    onClick={() => {
                      onToggleReaction(msg.id, e);
                      onToggleEmojiPicker(null);
                    }}
                  >
                    {e}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
