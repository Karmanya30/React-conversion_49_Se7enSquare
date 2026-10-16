import React from 'react';

/**
 * Message input area — formatting toolbar, emoji picker, quick actions,
 * textarea, reply bar, and send button.
 */
export default function MessageInput({
  activeChannel,
  msgInput, onMsgInputChange,
  onSendMessage,
  replyTo, onCancelReply,
  showEmojiPicker, onToggleEmojiPicker,
  EMOJIS, onAppendEmoji,
  onFormatBold, onFormatItalic, onFormatCode,
}) {
  return (
    <div className="input-area">
      <div className="input-wrap">
        <div className="input-toolbar">
          <button type="button" className="tb-btn" title="Bold" onClick={onFormatBold}>
            <strong>B</strong>
          </button>
          <button type="button" className="tb-btn" title="Italic" onClick={onFormatItalic}>
            <em>I</em>
          </button>
          <button type="button" className="tb-btn" title="Code" onClick={onFormatCode}>
            <span className="tb-mono">&lt;/&gt;</span>
          </button>
          <div className="tb-divider" />
          <button
            type="button"
            className="tb-btn"
            title="Emoji"
            onClick={() => onToggleEmojiPicker(p => p === 'input' ? null : 'input')}
          >
            😊
          </button>
          <button
            type="button"
            className="tb-btn"
            title="Mention"
            onClick={() => onMsgInputChange(t => t + '@')}
          >
            @
          </button>
        </div>

        {showEmojiPicker === 'input' && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              padding: '10px 14px',
              background: 'var(--bg-card,#151d2f)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {EMOJIS.map(e => (
              <span
                key={e}
                style={{ cursor: 'pointer', fontSize: '18px' }}
                onClick={() => { onAppendEmoji(e); onToggleEmojiPicker(null); }}
              >
                {e}
              </span>
            ))}
          </div>
        )}

        {replyTo && (
          <div id="replyBar" className="reply-bar" style={{ display: 'flex' }}>
            <div className="reply-bar-inner">
              <span className="reply-bar-icon">↩️</span>
              <span className="reply-bar-text">Replying to <strong id="replyBarName">{replyTo}</strong></span>
              <button type="button" className="reply-bar-close" onClick={onCancelReply}>✕</button>
            </div>
          </div>
        )}

        <div className="input-row">
          <button type="button" className="tb-btn" title="Attach File">➕</button>
          <button type="button" className="tb-btn" title="Quick Action">⚡</button>
          <textarea
            id="msgInput"
            placeholder={`Message #${activeChannel?.name || 'general'}`}
            rows={1}
            value={msgInput}
            onChange={e => onMsgInputChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
          />
          <button type="button" className="send-btn" onClick={onSendMessage}>
            🚀
          </button>
        </div>
      </div>
    </div>
  );
}
