import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DEFAULT_CHANNELS, DEMO_MESSAGES, EMOJIS } from '../data/chatData';

const API_BASE = 'http://localhost:3000/api';

function getUser() {
  try {
    const raw = JSON.parse(localStorage.getItem('nexus_user') || localStorage.getItem('currentUser') || '{}');
    const name = raw.fullName || raw.name || (raw.firstName ? `${raw.firstName} ${raw.lastName || ''}`.trim() : 'Rahul Kumar');
    return {
      id: raw.id || 1,
      name,
      fullName: name,
      firstName: raw.firstName || 'Rahul',
      username: raw.username || 'rahul',
      initials: raw.initials || 'AK',
      role: raw.role || 'admin',
    };
  } catch {
    return { id: 1, name: 'Rahul Kumar', fullName: 'Rahul Kumar', firstName: 'Rahul', username: 'rahul', initials: 'AK', role: 'admin' };
  }
}

/**
 * Manages all state, effects, and handlers for the Chat page.
 * Returns state and callbacks for the channel sidebar, message feed, input area, etc.
 */
export default function useChat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const communityId    = searchParams.get('community') || '';
  const communityName  = decodeURIComponent(searchParams.get('cname')   || 'FPS Arena');
  const initialChannel = decodeURIComponent(searchParams.get('channel') || 'general');

  const messagesEndRef = useRef(null);
  const user = getUser();

  const [channels,        setChannels]        = useState(DEFAULT_CHANNELS);
  const [activeChannel,   setActiveChannel]   = useState(
    () => DEFAULT_CHANNELS.find(c => c.name === initialChannel) || DEFAULT_CHANNELS[0]
  );
  const [messages,        setMessages]        = useState(DEMO_MESSAGES);
  const [msgInput,        setMsgInput]        = useState('');
  const [channelSearch,   setChannelSearch]   = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSearch,      setShowSearch]      = useState(false);
  const [msgSearchQuery,  setMsgSearchQuery]  = useState('');
  const [showPinned,      setShowPinned]      = useState(false);
  const [showMembers,     setShowMembers]     = useState(true);
  const [replyTo,         setReplyTo]         = useState(null);
  const [muted,           setMuted]           = useState(false);
  const [deafened,        setDeafened]        = useState(false);
  const [loading,         setLoading]         = useState(true);

  // Fetch community channels from backend
  useEffect(() => {
    async function fetchChannels() {
      if (!communityId) {
        setActiveChannel({ id: 'general', name: 'general', topic: 'The main hub 👋' });
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/communities/${communityId}`, {
          headers: { 'x-role': user.role },
        });
        if (res.ok) {
          const comm = await res.json();
          if (Array.isArray(comm.channels) && comm.channels.length > 0) {
            const parsed = comm.channels.map((c, idx) => ({
              id:    typeof c === 'string' ? c : c.id || c.name || String(idx + 1),
              name:  typeof c === 'string' ? c : c.name,
              topic: typeof c === 'object' && c.topic ? c.topic : `#${typeof c === 'string' ? c : c.name} channel`,
            }));
            setChannels(parsed);
            const found = parsed.find(c => c.name === initialChannel || c.id === initialChannel) || parsed[0];
            if (found) setActiveChannel(found);
          } else {
            setActiveChannel({ id: 'general', name: 'general', topic: 'General discussion' });
          }
        }
      } catch {}
      setLoading(false);
    }
    fetchChannels();
  }, [communityId, user.role, initialChannel]);

  // Fetch messages for the active channel
  useEffect(() => {
    async function fetchMessages() {
      if (!activeChannel?.id) return;
      try {
        const res = await fetch(`${API_BASE}/channels/${activeChannel.id}/messages`, {
          headers: { 'x-role': user.role },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setMessages(data.map(m => {
              const reactionsArr = [];
              if (m.reactions && typeof m.reactions === 'object') {
                for (const [emoji, count] of Object.entries(m.reactions)) {
                  reactionsArr.push({ emoji, count: Number(count) });
                }
              }
              const authorName = m.authorName || m.author?.name || m.author || 'User';
              return {
                id:        m.id,
                author:    authorName,
                initials:  authorName.slice(0, 2).toUpperCase(),
                color:     '#6366f1',
                text:      m.content || '',
                time:      m.createdAt
                  ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '',
                reactions: reactionsArr,
              };
            }));
          }
        }
      } catch {}
    }
    fetchMessages();
  }, [activeChannel?.id, user.role]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = msgInput.trim();
    if (!text || !activeChannel?.id) return;

    const fullContent  = replyTo ? `↩️ ${replyTo}: ${text}` : text;
    const authorName   = user.username || user.firstName || 'User';
    const tempMsg = {
      id:        Date.now(),
      author:    authorName,
      initials:  authorName.slice(0, 2).toUpperCase(),
      color:     '#34d399',
      text:      fullContent,
      time:      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
    };

    setMessages(prev => [...prev, tempMsg]);
    setMsgInput('');
    setReplyTo(null);

    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'x-role': user.role },
        body:    JSON.stringify({
          channelId:  String(activeChannel.id),
          content:    fullContent,
          communityId: Number(communityId) || 1,
          authorId:   user.id || 4,
          authorName,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setMessages(prev =>
          prev.map(m => m.id === tempMsg.id ? { ...m, id: created.id } : m)
        );
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const toggleReaction = async (msgId, emoji) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const existing  = m.reactions.find(r => r.emoji === emoji);
      const reactions = existing
        ? m.reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r)
        : [...m.reactions, { emoji, count: 1 }];
      return { ...m, reactions };
    }));

    try {
      await fetch(`${API_BASE}/messages/${msgId}/reactions`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'x-role': user.role },
        body:    JSON.stringify({
          emoji,
          actorId:   user.id || 4,
          actorName: user.username || user.firstName,
        }),
      });
    } catch {}
  };

  const filteredChannels = channels.filter(c =>
    !channelSearch || c.name.toLowerCase().includes(channelSearch.toLowerCase())
  );

  const filteredMessages = msgSearchQuery
    ? messages.filter(m => m.text.toLowerCase().includes(msgSearchQuery.toLowerCase()))
    : messages;

  return {
    // Identity / routing
    navigate, user, communityId, communityName,
    // Refs
    messagesEndRef,
    // Channel state
    channels, loading, activeChannel, setActiveChannel,
    channelSearch, setChannelSearch,
    filteredChannels,
    // Message state
    messages, filteredMessages,
    msgInput, setMsgInput,
    msgSearchQuery, setMsgSearchQuery,
    replyTo, setReplyTo,
    // UI toggles
    showEmojiPicker, setShowEmojiPicker,
    showSearch, setShowSearch,
    showPinned, setShowPinned,
    showMembers, setShowMembers,
    muted, setMuted,
    deafened, setDeafened,
    // Actions
    sendMessage, toggleReaction,
    EMOJIS,
  };
}
