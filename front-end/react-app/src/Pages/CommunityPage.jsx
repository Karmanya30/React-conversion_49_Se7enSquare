import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import '../styles/global.css';
import '../styles/community-page.css';

const API_BASE = 'http://localhost:3000/api';

function getUser() {
  try {
    const raw = JSON.parse(localStorage.getItem('nexus_user') || localStorage.getItem('currentUser') || '{}');
    return { id: raw.id, role: raw.role || 'user', username: raw.username || 'user', firstName: raw.firstName || 'User' };
  } catch { return { role: 'user', username: 'user', firstName: 'User' }; }
}

function getJoinedIdList() {
  try {
    const list = JSON.parse(localStorage.getItem('nexus_joined_communities') || '[]');
    return Array.isArray(list) ? list.map(String) : [];
  } catch { return []; }
}

function setJoinedIdList(idStr, joined) {
  const current = getJoinedIdList();
  const next = joined
    ? [...new Set([...current, idStr])]
    : current.filter(x => x !== idStr);
  localStorage.setItem('nexus_joined_communities', JSON.stringify(next));
}

function getOwnedIdList() {
  try {
    const list = JSON.parse(localStorage.getItem('nexus_owned_community_ids') || '[]');
    return Array.isArray(list) ? list.map(String) : [];
  } catch { return []; }
}

async function apiErrorMessage(res) {
  try {
    const body = await res.json();
    const msg = body?.message;
    return Array.isArray(msg) ? msg.join(', ') : (msg || `HTTP ${res.status}`);
  } catch { return `HTTP ${res.status}`; }
}

// Demo fallback used only to fill fields the API record doesn't carry.
const DEFAULT_COMMUNITY = {
  icon: '⚡', category: 'Esports · Competitive', founded: 'Mar 2022',
  description: '',
  tags: [],
  channels: [],
  rules: [],
};

// Generic defaults shown until the owner sets real rules via community
// settings — same as the legacy page.
const DEFAULT_RULES = [
  'Treat every member with kindness and respect. Personal attacks, harassment, hate speech, and discriminatory language of any kind are strictly prohibited.',
  "Keep discussions relevant to each channel's purpose. Use an off-topic channel for casual conversations.",
  'Unsolicited advertisements, excessive self-promotion, and repetitive posting are not allowed.',
  'When answering questions, be thorough and patient. Encourage learning at every level.',
  'Always credit the original author when sharing code, articles, or other content.',
  'Sharing pirated software, cracked licenses, or any illegal content is grounds for immediate permanent ban.',
  'Moderator decisions are final. If you disagree with an action, use the appeal process rather than arguing in public channels.',
];

// The API returns memberCount/onlineCount.
const memberCountOf = (c) => c?.memberCount ?? 0;
const onlineCountOf = (c) => c?.onlineCount ?? 0;

function initialsFromName(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'U';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

export default function CommunityPage() {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const id = paramId || searchParams.get('id') || '1';
  const user = getUser();

  const [community, setCommunity] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [joined, setJoined] = useState(() => getJoinedIdList().includes(String(id)));
  const [memberSearch, setMemberSearch] = useState('');
  const [members, setMembers] = useState(null); // null = still loading
  const [events, setEvents] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg((cur) => (cur === msg ? null : cur)), 3000);
  };

  useEffect(() => {
    let cancelled = false;
    async function fetchCommunity() {
      setLoading(true);
      try {
        const commRes = await fetch(`${API_BASE}/communities/${id}`, { headers: { 'x-role': user.role } });
        if (cancelled) return;
        if (commRes.ok) {
          const data = await commRes.json();
          setCommunity({ ...DEFAULT_COMMUNITY, ...data });
          setLoadError('');
        } else {
          setCommunity(null);
          setLoadError(`Could not load community — ${await apiErrorMessage(commRes)}`);
        }
      } catch {
        if (!cancelled) {
          setCommunity(null);
          setLoadError('Could not reach the backend (http://localhost:3000). Is the NestJS server running?');
        }
      }
      if (!cancelled) setLoading(false);

      // Join state: localStorage is the source of truth (same as legacy),
      // reconciled with the server's membership list.
      if (user.id) {
        try {
          const memsRes = await fetch(`${API_BASE}/memberships?userId=${user.id}`, { headers: { 'x-role': user.role } });
          if (!cancelled && memsRes.ok) {
            const mems = await memsRes.json();
            if (Array.isArray(mems)) {
              setJoined(mems.some((m) => String(m.communityId) === String(id)));
            }
          }
        } catch { /* keep localStorage-derived state */ }
      }
    }
    fetchCommunity();
    return () => { cancelled = true; };
  }, [id, user.role, user.id]);

  useEffect(() => {
    let cancelled = false;
    async function fetchPageData() {
      if (!community?.id) return;
      try {
        const eventsRes = await fetch(`${API_BASE}/events`, { headers: { 'x-role': user.role } });
        if (!cancelled && eventsRes.ok) {
          const all = await eventsRes.json();
          if (Array.isArray(all)) {
            setEvents(all.filter((e) =>
              String(e.communityId) === String(community.id) && e.status === 'approved'
            ));
          }
        }
      } catch { /* events section stays empty */ }

      try {
        const [memsRes, usersRes] = await Promise.all([
          fetch(`${API_BASE}/memberships?communityId=${community.id}`, { headers: { 'x-role': user.role } }),
          fetch(`${API_BASE}/users`, { headers: { 'x-role': user.role } }),
        ]);
        if (cancelled) return;
        const mems = memsRes.ok ? await memsRes.json() : [];
        const users = usersRes.ok ? await usersRes.json() : [];
        const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]));
        setMembers((Array.isArray(mems) ? mems : []).map((m) => {
          const u = usersById.get(String(m.userId));
          const isOwner = u && String(u.id) === String(community.ownerId);
          const isMod = !isOwner && (u?.role === 'moderator' || u?.role === 'community_manager');
          return {
            userId: m.userId,
            name: u ? (u.username || u.email) : `User #${m.userId}`,
            role: isOwner ? 'owner' : (isMod ? 'moderator' : 'member'),
          };
        }));
      } catch {
        if (!cancelled) setMembers([]);
      }
    }
    fetchPageData();
    return () => { cancelled = true; };
  }, [community, user.role]);

  const toggleJoin = async () => {
    if (!community?.id) return;
    if (!user.id) {
      showToast('⚠️ Please log in to join communities.');
      return;
    }
    const next = !joined;
    setJoined(next);
    setJoinedIdList(String(community.id), next);
    try {
      if (next) {
        const res = await fetch(`${API_BASE}/memberships`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-role': user.role },
          body: JSON.stringify({ userId: Number(user.id), communityId: Number(community.id) }),
        });
        if (!res.ok) {
          const msg = await apiErrorMessage(res);
          // Duplicate joins are harmless — the membership already exists.
          if (!/already a member/i.test(msg)) throw new Error(msg);
        }
        showToast(`Welcome to ${community.name}! 🚀`);
      } else {
        const memsRes = await fetch(`${API_BASE}/memberships?userId=${user.id}`, { headers: { 'x-role': user.role } });
        if (!memsRes.ok) throw new Error(await apiErrorMessage(memsRes));
        const mems = await memsRes.json();
        const target = Array.isArray(mems)
          ? mems.find((m) => String(m.communityId) === String(community.id) && String(m.userId) === String(user.id))
          : null;
        if (target) {
          const delRes = await fetch(`${API_BASE}/memberships/${target.id}`, {
            method: 'DELETE',
            headers: { 'x-role': user.role },
          });
          if (!delRes.ok) throw new Error(await apiErrorMessage(delRes));
        }
        showToast('Left community.');
      }
    } catch (err) {
      setJoined(!next);
      setJoinedIdList(String(community.id), !next);
      showToast(`⚠️ ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!community?.id) return;
    if (!window.confirm(`Are you sure you want to permanently delete "${community.name}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_BASE}/communities/${community.id}`, {
        method: 'DELETE',
        headers: { 'x-role': user.role },
      });
      if (!res.ok) {
        showToast(`⚠️ Could not delete community: ${await apiErrorMessage(res)}`);
        return;
      }
    } catch (err) {
      showToast(`⚠️ Could not reach the backend: ${err.message}`);
      return;
    }
    // Mirror the deletion locally so discovery/settings stop listing it.
    const idStr = String(community.id);
    localStorage.setItem('nexus_owned_community_ids', JSON.stringify(getOwnedIdList().filter((x) => x !== idStr)));
    localStorage.setItem('nexus_joined_communities', JSON.stringify(getJoinedIdList().filter((x) => x !== idStr)));
    showToast('🗑️ Community deleted.');
    setTimeout(() => navigate('/discovery'), 600);
  };

  // Owner gate: compare against the community record's ownerId from the server,
  // or grant admin full access. localStorage is NOT used here — any user could
  // tamper with nexus_owned_community_ids to gain owner UI.
  const isOwner =
    (user.id && String(community?.ownerId) === String(user.id)) ||
    user.role === 'admin';

  // Channels come from the record's channels, falling back to tags
  // (same as the legacy page).
  const rawChannels = community?.channels?.length ? community.channels : (community?.tags || []);
  const channelEntries = rawChannels.map((item) =>
    typeof item === 'object' ? item : { name: item, type: 'Text' }
  );

  const foundedLabel = community?.createdAt
    ? new Date(community.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : community?.founded;

  const rules = community?.rules?.length ? community.rules : DEFAULT_RULES;

  const filteredMembers = (members || []).filter((m) =>
    !memberSearch ||
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    String(m.userId) === memberSearch.trim()
  );

  const TABS = [
    { id: 'overview', label: '📋 Overview' },
    { id: 'channels', label: '📡 Channels', count: channelEntries.length },
    { id: 'members', label: '👥 Members', count: memberCountOf(community) },
    { id: 'rules', label: '📜 Rules', count: rules.length },
  ];

  if (loading && !community) {
    return (
      <div className="main">
        <header className="header">
          <button className="page-back-btn" onClick={() => navigate(-1)}>← Back</button>
        </header>
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-3,#888)' }}>Loading community…</div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="main">
        <header className="header">
          <button className="page-back-btn" onClick={() => navigate('/discovery')}>← Back</button>
        </header>
        <div style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🫥</div>
          <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Community not found</div>
          <div style={{ fontSize: '13px', color: 'var(--text-3,#888)', marginBottom: '20px' }}>{loadError}</div>
          <button
            onClick={() => navigate('/discovery')}
            style={{ background: '#6366f1', border: 'none', borderRadius: '8px', padding: '9px 18px', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
          >
            Browse Communities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      {/* Header */}
      <header className="header">
        <button className="page-back-btn" onClick={() => navigate(-1)} title="Back to communities">
          ← Back
        </button>
        <div className="breadcrumb">
          <button className="breadcrumb-link" onClick={() => navigate('/discovery')}>Discover</button>
          <span className="sep">›</span>
          <button className="breadcrumb-link" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <span className="sep">›</span>
          <span className="current" id="breadcrumbCommunityName">{community.name}</span>
        </div>
        <div className="header-actions">
          <div className="icon-btn">
            🔔
            <div className="notif-dot"></div>
          </div>
          <div className="header-avatar user-avatar" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile-settings')} />
        </div>
      </header>

      {/* Banner */}
      <div className="comm-banner-area">
        <div className="comm-banner">
          <div className="banner-pattern"></div>
          <div className="banner-emoji" id="comm-icon">{community.icon || '🏘️'}</div>
        </div>
        <div className="comm-profile-row">
          <div className="comm-big-icon">{community.icon || '🏘️'}</div>
          <div className="comm-title-block">
            <div className="comm-title-row">
              <h1 className="comm-big-name" id="comm-name-title">{community.name}</h1>
              <div className="verified-badge">✓ Verified</div>
            </div>
            <div className="comm-meta-row">
              <div className="meta-chip"><span className="online-dot"></span> <span id="comm-online-count">{onlineCountOf(community).toLocaleString()}</span> online</div>
              <div className="meta-chip">👥 <span id="comm-member-count">{memberCountOf(community).toLocaleString()}</span> members</div>
              <div className="meta-chip" id="comm-category">💻 {community.category || 'Gaming'} · Community</div>
              {foundedLabel && <div className="meta-chip" id="comm-founded">📅 Founded {foundedLabel}</div>}
            </div>
          </div>
          <div className="comm-actions">
            <button
              className={`btn-joined-main${joined ? '' : ' not-joined'}`}
              id="joinMainBtn"
              onClick={toggleJoin}
              style={{
                background: joined ? 'rgba(99,102,241,0.2)' : '#6366f1',
                border: joined ? '1px solid #6366f1' : 'none',
                color: '#fff', borderRadius: '10px', padding: '10px 20px',
                fontWeight: 600, cursor: 'pointer', fontSize: '14px',
              }}
            >
              {joined ? '✓ Joined' : '+ Join Community'}
            </button>
            {isOwner && (
              <Link
                to={`/community-settings/${community.id}`}
                className="rbac-manage-btn"
                id="rbacManageBtn"
                title="Open community settings"
                style={{
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#ccc', borderRadius: '10px', padding: '10px 16px', textDecoration: 'none',
                  fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                ⚙️ Community Settings
              </Link>
            )}
            {isOwner && (
              <button
                id="rbacDeleteBtn"
                onClick={handleDelete}
                style={{
                  background: 'rgba(255,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(255,68,68,0.2)',
                  borderRadius: '8px', padding: '0 16px', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px', height: '40px',
                }}
              >
                🗑️ Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="tab-bar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="tab-count">{(tab.count || 0).toLocaleString()}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="tab-content active" id="tab-overview">
          <div className="overview-left">
            {/* Pinned Announcement — driven by community description */}
            <div className="pinned-card">
              <div className="pin-header">📌 Welcome to {community.name}</div>
              <div className="pin-text">
                {community.description ||
                  `Welcome to ${community.name}! Introduce yourself in #general and let us know what you're working on.`}
              </div>
              {foundedLabel && (
                <div className="pin-footer">
                  <div className="pin-author">
                    <div className="pin-av user-avatar"></div>
                    <span>Community · Founded {foundedLabel}</span>
                  </div>
                </div>
              )}
            </div>

            {/* About */}
            <div className="section-card">
              <div className="sc-title">
                <span className="sc-title-icon">ℹ</span> About <span className="comm-name-text">{community.name}</span>
              </div>
              <div className="about-text" id="comm-description">{community.description}</div>
              <div className="tag-row">
                {(community.tags || []).map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="section-card">
              <div className="sc-title"><span className="sc-title-icon">📊</span> Community Stats</div>
              <div className="stat-grid">
                <div className="stat-box">
                  <div className="stat-val" id="stat-total-members">{memberCountOf(community).toLocaleString()}</div>
                  <div className="stat-lbl">Total Members</div>
                </div>
                <div className="stat-box">
                  <div className="stat-val stat-online" id="stat-online-now">{onlineCountOf(community).toLocaleString()}</div>
                  <div className="stat-lbl">Online Now</div>
                </div>
                <div className="stat-box">
                  <div className="stat-val">{channelEntries.length}</div>
                  <div className="stat-lbl">Channels</div>
                </div>
                <div className="stat-box">
                  <div className="stat-val">—</div>
                  <div className="stat-lbl">Messages Sent</div>
                </div>
              </div>
            </div>

            {/* Recent Messages — static demo content, same as the legacy page */}
            <div className="section-card">
              <div className="sc-title"><span className="sc-title-icon">💬</span> Recent Messages</div>
              <div className="messages-feed">
                {[
                  { initials: 'AM', name: 'Alex Morgan', time: '10:41 AM', text: 'This looks incredible! Love the design direction. Are you using Gameunity\'s design system?', reactions: [] },
                  { initials: 'MP', name: 'Maya Petrov', time: '10:44 AM', text: 'Sharing our team\'s early UI mockup for the hackathon 👀', reactions: [{ emoji: '🔥', count: 22 }, { emoji: '😍', count: 8 }] },
                  { initials: 'RK', name: 'Rahul Kumar', time: '10:08 AM', role: 'Moderator', text: 'Check out the nexus-cli setup snippet in #dev-talk', reactions: [] },
                ].map((msg, i) => (
                  <div key={i} className="msg-group">
                    <div className="msg-av" style={{ fontWeight: 700, fontSize: '12px', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: i === 0 ? '#6366f1' : i === 1 ? '#ec4899' : '#8b5cf6', color: '#fff' }}>
                      {msg.initials}
                    </div>
                    <div className="msg-body">
                      <div className="msg-header">
                        <span className="msg-uname">{msg.name}</span>
                        {msg.role && <span className="msg-role role-moderator-badge">{msg.role}</span>}
                        <span className="msg-time">{msg.time}</span>
                      </div>
                      <div className="msg-text">{msg.text}</div>
                      {msg.reactions.length > 0 && (
                        <div className="reactions">
                          {msg.reactions.map((r, j) => (
                            <div key={j} className="FPS-pill"><span>{r.emoji}</span><span className="FPS-count">{r.count}</span></div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="view-more-messages">
                <button
                  className="view-more-btn"
                  onClick={() => navigate(`/chat?community=${community.id}&cname=${encodeURIComponent(community.name)}`)}
                >
                  View Community Posts →
                </button>
              </div>
            </div>
          </div>

          <div className="overview-right">
            {/* Active Events */}
            <div className="section-card">
              <div className="sc-title"><span className="sc-title-icon">📅</span> Active Events</div>
              <div id="activeEventsList">
                {events.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-3,#888)', fontSize: '13px' }}>
                    No active events yet
                  </div>
                ) : (
                  events.map((ev) => {
                    const date = new Date(ev.date);
                    const day = Number.isNaN(date.getTime()) ? '—' : String(date.getDate()).padStart(2, '0');
                    const month = Number.isNaN(date.getTime()) ? '' : date.toLocaleString('en-US', { month: 'short' });
                    return (
                      <div
                        key={ev.id}
                        className="event-mini"
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(99,102,241,0.08)', borderRadius: '10px', marginBottom: '10px', cursor: 'pointer' }}
                        onClick={() => navigate('/events')}
                      >
                        <div style={{ textAlign: 'center', minWidth: '38px' }}>
                          <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase' }}>{month}</div>
                          <div style={{ fontSize: '16px', fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>{day}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{ev.title}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-3,#666)', marginTop: '2px' }}>
                            {ev.time || '—'} · {ev.attendees || 0} attending
                          </div>
                        </div>
                        <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', textTransform: 'capitalize' }}>
                          {ev.status}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Created By */}
            <div className="section-card">
              <div className="sc-title"><span className="sc-title-icon">👤</span> Created By</div>
              <div className="created-by-card">
                <div className="created-by-avatar" style={{ background: '#f59e0b', color: '#000', fontWeight: 700, width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {initialsFromName(community.ownerName || community.createdBy || 'Owner')}
                </div>
                <div>
                  <div className="created-by-name">{community.ownerName || community.createdBy || 'Community Owner'}</div>
                  <div className="created-by-meta">Owner{foundedLabel ? ` · Since ${foundedLabel}` : ''}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CHANNELS TAB ── */}
      {activeTab === 'channels' && (
        <div className="tab-content active" id="tab-channels">
          <div className="channels-layout">
            <div className="channels-main" id="channelsList">
              {channelEntries.length === 0 ? (
                <div style={{ padding: '12px', fontSize: '12px', color: 'var(--text-3,#888)' }}>No channels yet.</div>
              ) : (
                channelEntries.map((ch, i) => {
                  const chanName = ch.name || `channel-${i}`;
                  const isVoice = ch.type === 'Voice';
                  if (joined) {
                    return (
                      <div
                        key={ch.id || chanName}
                        className="channel-row"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                          background: 'var(--bg-card,#151d2f)', borderRadius: '10px', marginBottom: '8px',
                          cursor: 'pointer', border: '1px solid var(--border,rgba(255,255,255,0.06))',
                          transition: 'border-color 0.2s',
                        }}
                        onClick={() => navigate(`/chat?community=${community.id}&cname=${encodeURIComponent(community.name)}&channel=${encodeURIComponent(chanName)}`)}
                      >
                        <span style={{ fontSize: '18px', opacity: 0.7 }}>{isVoice ? '🎙' : '#'}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-1,#fff)' }}>{chanName}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-3,#666)', marginTop: '2px' }}>{ch.topic || (isVoice ? 'Voice channel' : 'Text channel')}</div>
                        </div>
                        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-3,#555)' }}>→</span>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={ch.id || chanName}
                      className="channel-row ch-locked"
                      title="Join to access"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                        background: 'var(--bg-card,#151d2f)', borderRadius: '10px', marginBottom: '8px',
                        cursor: 'not-allowed', border: '1px solid var(--border,rgba(255,255,255,0.06))', opacity: 0.6,
                      }}
                      onClick={() => showToast('🔒 Join this community first to access channels!')}
                    >
                      <span style={{ fontSize: '16px' }}>🔒</span>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-1,#fff)' }}>{chanName}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MEMBERS TAB ── */}
      {activeTab === 'members' && (
        <div className="tab-content active" id="tab-members">
          <div className="members-layout">
            <div className="members-search">
              <span className="members-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search members…"
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
              />
            </div>
            <div className="members-groups" id="membersContainer">
              {members === null ? (
                <div style={{ padding: '20px', color: 'var(--text-muted,#666)', fontSize: '13px' }}>Loading members…</div>
              ) : filteredMembers.length === 0 ? (
                <div style={{ padding: '20px', color: 'var(--text-muted,#666)', fontSize: '13px' }}>
                  {members.length ? 'No members match your search.' : 'No members yet.'}
                </div>
              ) : (
                ['owner', 'moderator', 'member'].map(roleGroup => {
                  const groupMembers = filteredMembers.filter(m => m.role === roleGroup);
                  if (groupMembers.length === 0) return null;
                  return (
                    <div key={roleGroup}>
                      <div className="members-group-title" style={{ fontSize: '11px', color: 'var(--text-3,#666)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', padding: '16px 0 8px' }}>
                        {roleGroup === 'owner' ? '👑 Owner' : roleGroup === 'moderator' ? '🛡️ Moderators' : '👥 Members'} — {groupMembers.length}
                      </div>
                      {groupMembers.map(m => (
                        <div key={`${roleGroup}-${m.userId}`} className="member-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border,rgba(255,255,255,0.04))' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: m.role === 'owner' ? '#f59e0b' : m.role === 'moderator' ? '#6366f1' : '#374151', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>
                            {initialsFromName(m.name)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-1,#fff)' }}>{m.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-3,#666)' }}>Member #{m.userId}</div>
                          </div>
                          <div style={{ marginLeft: 'auto' }}>
                            <button
                              onClick={() => navigate(`/report?user=${m.userId}&uname=${encodeURIComponent(m.name)}`)}
                              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-3,#666)', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', cursor: 'pointer' }}
                            >
                              🚩
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── RULES TAB ── */}
      {activeTab === 'rules' && (
        <div className="tab-content active" id="tab-rules">
          <div className="rules-layout">
            <div className="rules-main" id="rulesMain">
              {rules.map((rule, i) => (
                <div key={i} className="rule-item" style={{ display: 'flex', gap: '16px', padding: '16px', background: 'var(--bg-card,#151d2f)', borderRadius: '10px', marginBottom: '10px', border: '1px solid var(--border,rgba(255,255,255,0.06))' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#818cf8', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ color: 'var(--text-secondary,#ccc)', fontSize: '14px', lineHeight: '1.5' }}>{rule}</div>
                </div>
              ))}
            </div>
            <div className="rules-aside">
              <div className="rules-note">
                <div className="rules-note-title">✓ Safe Community</div>
                <div className="rules-note-text">
                  {community.name} has zero tolerance for hate speech, harassment, or discrimination. Violations result in immediate action.
                </div>
              </div>
              <div className="section-card">
                <div className="sc-title">⚖️ Enforcement</div>
                <div className="enforcement-list">
                  {['⚠️ 1st offense: Warning', '🔇 2nd offense: 24h mute', '🚫 3rd offense: Temp ban', '⛔ Severe: Permanent ban'].map((item, i) => (
                    <div key={i} className={`enforcement-item${i === 3 ? ' enforcement-item--severe' : ''}`}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="section-card">
                <div className="sc-title">📬 Report a Problem</div>
                <div className="report-text">Use the report button on any message or contact a moderator directly.</div>
                <button
                  className="report-btn"
                  onClick={() => navigate(`/report?community=${community.id}&cname=${encodeURIComponent(community.name)}`)}
                >
                  🚩 Report an Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          background: '#1c2333', color: '#fff', border: '1px solid rgba(99,102,241,0.4)',
          borderRadius: '10px', padding: '10px 18px', fontSize: '13.5px', zIndex: 2000,
          boxShadow: '0 8px 30px rgba(0,0,0,0.45)', maxWidth: '80vw',
        }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
}
