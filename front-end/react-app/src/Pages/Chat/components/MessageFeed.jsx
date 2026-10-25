import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Message feed — renders scrollable message list with day divider,
 * avatars, role badges, text, reaction pills, and hover action toolbar.
 */
export default function MessageFeed({
  filteredMessages,
  showEmojiPicker,
  onToggleEmojiPicker,
  EMOJIS,
  onToggleReaction,
  onSetReplyTo,
  messagesEndRef,
}) {
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!activeMenuId) return;
    function handleOutsideClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [activeMenuId]);

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
                onClick={() => setActiveMenuId(id => id === msg.id ? null : msg.id)}
              >
                ⋯
              </button>
            </div>

            
            {activeMenuId === msg.id && (
              <div ref={menuRef}
                style={{
                  position: "absolute",
                  top: "28px",
                  right: "16px",
                  zIndex: 150,
                  background: "var(--bg-card, #151d2f)",
                  border: "1px solid var(--border, rgba(255, 255, 255, 0.1))",
                  borderRadius: "10px",
                  padding: "6px",
                  minWidth: "160px",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.6)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <button
                  type="button"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#f87171",
                    padding: "8px 12px",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "6px",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() => {
                    setActiveMenuId(null);
                    const uname = encodeURIComponent(msg.author || "");
                    const text = encodeURIComponent(msg.text || "");
                    navigate(`/report?msg=${msg.id}&text=${text}&user=${msg.authorId || ""}&uname=${uname}`);
                  }}
                >
                  <span>🚩</span>
                  <span>Report Message</span>
                </button>

                <button
                  type="button"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#cbd5e1",
                    padding: "8px 12px",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "6px",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() => {
                    navigator.clipboard?.writeText(msg.text || "");
                    setActiveMenuId(null);
                  }}
                >
                  <span>📋</span>
                  <span>Copy Text</span>
                </button>
              </div>
            )}

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
