import React from 'react';
import '../styles/global.css';
import '../styles/sidebar.css';
import '../styles/chat.css';
import useChat from '../Components/platform/hooks/useChat';
import ChatHeader        from './Chat/components/ChatHeader';
import ChatSidebar       from './Chat/components/ChatSidebar';
import MessageFeed       from './Chat/components/MessageFeed';
import MessageInput      from './Chat/components/MessageInput';
import ChatMembersList   from './Chat/components/ChatMembersList';
import PinnedMessagesModal from './Chat/components/PinnedMessagesModal';

/**
 * Chat page — thin orchestrator.
 * All state, API calls, and handlers live in useChat().
 */
export default function Chat() {
  const c = useChat();

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-1,#0d1117)' }}>
      <ChatHeader
        communityId={c.communityId}
        user={c.user}
        membersCount={c.members.length}
        onToggleSearch={() => c.setShowSearch(s => !s)}
        onTogglePinned={() => c.setShowPinned(s => !s)}
        onToggleMembers={() => c.setShowMembers(s => !s)}
      />

      <div className="chat-layout" style={{ flex: 1, overflow: 'hidden' }}>
        <ChatSidebar
          communityName={c.communityName}
          channelSearch={c.channelSearch}
          onChannelSearchChange={c.setChannelSearch}
          filteredChannels={c.filteredChannels}
          loading={c.loading}
          activeChannel={c.activeChannel}
          onSelectChannel={c.setActiveChannel}
          user={c.user}
          muted={c.muted}
          onToggleMute={() => c.setMuted(m => !m)}
          deafened={c.deafened}
          onToggleDeafen={() => c.setDeafened(d => !d)}
        />

        <main className="chat-area">
          {/* Active channel header */}
          <div className="chat-header">
            <div className="ch-name-display">
              <span className="ch-hash" id="activeChanHash">#</span>
              <span className="ch-name-text" id="activeChanName">{c.activeChannel?.name || 'general'}</span>
              <span className="ch-topic" id="activeChanTopic">
                {c.activeChannel?.topic || 'The main hub — say hello, share updates, ask any...'}
              </span>
            </div>
          </div>

          {/* Inline search bar if toggled */}
          {c.showSearch && (
            <div id="chatSearchBar" className="chat-search-bar open" style={{ display: 'block' }}>
              <div className="chat-search-inner">
                <span className="chat-search-icon">🔍</span>
                <input
                  type="text"
                  id="chatSearchInput"
                  placeholder="Search messages..."
                  value={c.msgSearchQuery}
                  onChange={e => c.setMsgSearchQuery(e.target.value)}
                />
                <span id="chatSearchCount" className="chat-search-count">
                  {c.msgSearchQuery ? `${c.filteredMessages.length} results` : ''}
                </span>
                <button
                  type="button"
                  className="chat-search-close"
                  onClick={() => c.setShowSearch(false)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Messages Feed */}
          <MessageFeed
            filteredMessages={c.filteredMessages}
            showEmojiPicker={c.showEmojiPicker}
            onToggleEmojiPicker={c.setShowEmojiPicker}
            EMOJIS={c.EMOJIS}
            onToggleReaction={c.toggleReaction}
            onSetReplyTo={c.setReplyTo}
            messagesEndRef={c.messagesEndRef}
          />

          {/* Message Input pinned at bottom */}
          <MessageInput
            activeChannel={c.activeChannel}
            msgInput={c.msgInput}
            onMsgInputChange={c.setMsgInput}
            onSendMessage={c.sendMessage}
            replyTo={c.replyTo}
            onCancelReply={() => c.setReplyTo(null)}
            showEmojiPicker={c.showEmojiPicker}
            onToggleEmojiPicker={c.setShowEmojiPicker}
            EMOJIS={c.EMOJIS}
            onAppendEmoji={e => c.setMsgInput(t => t + e)}
            onFormatBold={() => c.setMsgInput(t => `**${t}**`)}
            onFormatItalic={() => c.setMsgInput(t => `_${t}_`)}
            onFormatCode={() => c.setMsgInput(t => `\`${t}\``)}
          />

          {c.showPinned && (
            <PinnedMessagesModal onClose={() => c.setShowPinned(false)} />
          )}
        </main>

        {c.showMembers && (
          <ChatMembersList members={c.members} onHide={() => c.setShowMembers(false)} />
        )}
      </div>
    </div>
  );
}
