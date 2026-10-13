import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../Components/SideBar';
import '../styles/global.css';
import '../styles/sidebar.css';
import '../styles/discovery.css';

const API_BASE = 'http://localhost:3000/api';

// Offline demo fallback only — replaced by live data from GET /api/communities.
const DEFAULT_COMMUNITIES = [
  { id: 1, name: 'Pro Gamers', icon: '⚡', memberCount: 2451, onlineCount: 312, category: 'Gaming', description: 'Competitive gaming for all skill levels.', tags: ['MOBA', 'FPS', 'Esports'] },
  { id: 2, name: 'Dev Nexus', icon: '💻', memberCount: 12400, onlineCount: 890, category: 'Technology', description: 'Realtime discussions on web dev and open source.', tags: ['Web', 'Open Source'] },
  { id: 3, name: 'Design Studio', icon: '🎨', memberCount: 8200, onlineCount: 420, category: 'Design', description: 'Weekly UI crits and design sprints.', tags: ['UI', 'Figma', 'Branding'] },
  { id: 4, name: 'Open Source Hub', icon: '🌱', memberCount: 6800, onlineCount: 245, category: 'Technology', description: 'Collaborate on open source projects.', tags: ['Git', 'Hacktoberfest'] },
  { id: 5, name: 'Hackathon HQ', icon: '🏆', memberCount: 5100, onlineCount: 180, category: 'Technology', description: 'Hackathons, competitions, and team-building.', tags: ['Hackathon', 'Prizes'] },
  { id: 6, name: 'Music Makers', icon: '🎵', memberCount: 3200, onlineCount: 88, category: 'Music', description: 'Producers, singers, and music enthusiasts.', tags: ['EDM', 'Hip-hop', 'Classical'] },
  { id: 7, name: 'Fit Squad', icon: '🏋️', memberCount: 4500, onlineCount: 130, category: 'Sports', description: 'Fitness goals, workout plans, nutrition tips.', tags: ['Fitness', 'Nutrition'] },
  { id: 8, name: 'Learn Anything', icon: '📚', memberCount: 9800, onlineCount: 560, category: 'Education', description: 'Courses, tutorials, and study groups.', tags: ['Courses', 'Mentoring'] },
];

function getCurrentUser() {
  try {
    const stored = localStorage.getItem('nexus_user') || localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

function getJoinedIdList() {
  try {
    const list = JSON.parse(localStorage.getItem('nexus_joined_communities') || '[]');
    return Array.isArray(list) ? list.map(String) : [];
  } catch { return []; }
}

function setJoinedIdList(idStr, joined) {
  const next = joined
    ? [...new Set([...getJoinedIdList(), idStr])]
    : getJoinedIdList().filter(x => x !== idStr);
  localStorage.setItem('nexus_joined_communities', JSON.stringify(next));
}

// Extracts the human-readable error message a NestJS response carries
// (validation failures arrive as arrays of strings).
async function apiErrorMessage(res) {
  try {
    const body = await res.json();
    const msg = body?.message;
    return Array.isArray(msg) ? msg.join(', ') : (msg || `HTTP ${res.status}`);
  } catch { return `HTTP ${res.status}`; }
}

// The API returns memberCount/onlineCount; the demo fallback uses members/online.
const memberCountOf = (c) => c.memberCount ?? c.members ?? 0;
const onlineCountOf = (c) => c.onlineCount ?? c.online ?? 0;

export default function Discovery() {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState(DEFAULT_COMMUNITIES);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('active');
  const [showSort, setShowSort] = useState(false);
  const [joinedIds, setJoinedIds] = useState(() => new Set(getJoinedIdList()));
  const [loading, setLoading] = useState(true);
  const [loadWarning, setLoadWarning] = useState('');
  const [eventCount, setEventCount] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg((cur) => (cur === msg ? null : cur)), 3000);
  };

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      const user = getCurrentUser();
      const role = user.role || 'user';
      const headers = { 'x-role': role };
      try {
        const [commsRes, memsRes, eventsRes] = await Promise.all([
          fetch(`${API_BASE}/communities`, { headers }),
          user.id ? fetch(`${API_BASE}/memberships?userId=${user.id}`, { headers }) : Promise.resolve(null),
          fetch(`${API_BASE}/events`, { headers }),
        ]);
        if (cancelled) return;
        if (commsRes.ok) {
          const data = await commsRes.json();
          if (Array.isArray(data) && data.length > 0) setCommunities(data);
          setLoadWarning('');
        } else {
          setLoadWarning(`Could not load communities — ${await apiErrorMessage(commsRes)}. Showing demo data.`);
        }
        if (memsRes && memsRes.ok) {
          const mems = await memsRes.json();
          if (Array.isArray(mems)) {
            const ids = new Set(getJoinedIdList());
            mems.forEach(m => ids.add(String(m.communityId)));
            setJoinedIds(ids);
          }
        }
        if (eventsRes.ok) {
          const events = await eventsRes.json();
          if (Array.isArray(events)) setEventCount(events.length);
        }
      } catch {
        if (!cancelled) {
          setLoadWarning('Could not reach the backend (http://localhost:3000) — showing demo data.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => {
    const cats = [];
    communities.forEach(c => {
      if (c.category && !cats.includes(c.category)) cats.push(c.category);
    });
    return ['All', ...cats];
  }, [communities]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const cat = activeCategory.toLowerCase();
    return communities
      .filter(c => {
        const matchSearch = !q ||
          c.name?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q);
        const matchCat = activeCategory === 'All' ||
          (c.category || '').toLowerCase() === cat ||
          (c.tags || []).some(t => String(t).toLowerCase() === cat);
        return matchSearch && matchCat;
      })
      .sort((a, b) => {
        if (sortBy === 'members') return memberCountOf(b) - memberCountOf(a);
        if (sortBy === 'trending') {
          return (onlineCountOf(b) / Math.max(memberCountOf(b), 1)) -
                 (onlineCountOf(a) / Math.max(memberCountOf(a), 1));
        }
        if (sortBy === 'newest') {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return (tb - ta) || ((b.id || 0) - (a.id || 0));
        }
        return onlineCountOf(b) - onlineCountOf(a); // most active default
      });
  }, [communities, search, activeCategory, sortBy]);

  const totalMembers = communities.reduce((s, c) => s + memberCountOf(c), 0);
  const totalOnline = communities.reduce((s, c) => s + onlineCountOf(c), 0);
  const fmtStat = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

  const toggleJoin = async (id, e) => {
    e.stopPropagation();
    const user = getCurrentUser();
    if (!user.id) {
      showToast('⚠️ Please log in to join communities.');
      return;
    }
    const role = user.role || 'user';
    const idStr = String(id);
    const isJoined = joinedIds.has(idStr);

    // Optimistic UI + localStorage update, reverted on real failures.
    setJoinedIds(prev => {
      const next = new Set(prev);
      if (isJoined) next.delete(idStr); else next.add(idStr);
      return next;
    });
    setJoinedIdList(idStr, !isJoined);

    try {
      if (isJoined) {
        const memsRes = await fetch(`${API_BASE}/memberships?userId=${user.id}`, { headers: { 'x-role': role } });
        if (!memsRes.ok) throw new Error(await apiErrorMessage(memsRes));
        const mems = await memsRes.json();
        const target = Array.isArray(mems)
          ? mems.find(m => String(m.communityId) === idStr && String(m.userId) === String(user.id))
          : null;
        if (target) {
          const delRes = await fetch(`${API_BASE}/memberships/${target.id}`, {
            method: 'DELETE',
            headers: { 'x-role': role },
          });
          if (!delRes.ok) throw new Error(await apiErrorMessage(delRes));
        }
        showToast('Left community.');
      } else {
        const res = await fetch(`${API_BASE}/memberships`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-role': role },
          body: JSON.stringify({ userId: Number(user.id), communityId: Number(id) }),
        });
        if (!res.ok) {
          const msg = await apiErrorMessage(res);
          // Duplicate joins are harmless — the membership already exists.
          if (!/already a member/i.test(msg)) throw new Error(msg);
        }
        const comm = communities.find(c => String(c.id) === idStr);
        showToast(comm ? `Welcome to ${comm.name}! ⚡` : 'Joined community.');
      }
    } catch (err) {
      setJoinedIds(prev => {
        const next = new Set(prev);
        if (isJoined) next.add(idStr); else next.delete(idStr);
        return next;
      });
      setJoinedIdList(idStr, isJoined);
      showToast(`⚠️ ${err.message}`);
    }
  };

  const sortLabels = { active: 'Most Active', members: 'Most Members', trending: 'Trending', newest: 'Recently Created' };

  return (
    <div className="app-shell">
      <SideBar />
      <div className="main">
        {/* Header */}
        <header className="header">
          <div className="header-title">Discover Communities</div>
          <div className="header-actions">
            <div className="icon-btn">🔔<div className="notif-dot"></div></div>
            <div
              className="header-avatar user-avatar"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/profile-settings')}
            />
          </div>
        </header>

        <div className="content">
          {/* Hero Search */}
          <div className="hero">
            <div className="hero-title">
              Find your next <span>community</span>
            </div>
            <div className="hero-sub">Browse communities across every interest, topic, and niche.</div>
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                id="searchInput"
                type="text"
                placeholder="Search by name, topic, or keyword…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span className="search-kbd">⌘K</span>
              <button className="search-btn" onClick={() => {}}>Search</button>
            </div>
            <div className="hero-stats">
              <div className="h-stat">🏘️ <strong>{communities.length.toLocaleString()}</strong>&nbsp;communities</div>
              <div className="h-stat">👥 <strong>{fmtStat(totalMembers)}</strong>&nbsp;members</div>
              <div className="h-stat">🟢 <strong>{totalOnline.toLocaleString()}</strong>&nbsp;online now</div>
              <div className="h-stat">📅 <strong>{eventCount !== null ? eventCount.toLocaleString() : '—'}</strong>&nbsp;events scheduled</div>
            </div>
          </div>

          {loadWarning && (
            <div style={{
              margin: '10px 32px 0', padding: '10px 14px', fontSize: '13px',
              background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)',
              borderRadius: '10px', color: '#fbbf24',
            }}>
              ⚠️ {loadWarning}
            </div>
          )}

          {/* Filter Bar */}
          <div className="filter-bar" id="filterBar">
            {categories.map(cat => (
              <div
                key={cat}
                className={`chip${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'All' && <span className="chip-icon">✦</span>} {cat}
              </div>
            ))}
            <div className="sort-container" style={{ marginLeft: 'auto' }}>
              <div
                className="sort-btn"
                id="sortBtn"
                onClick={() => setShowSort(s => !s)}
              >
                ⇅ Sort: {sortLabels[sortBy]}
              </div>
              {showSort && (
                <div className="sort-dropdown" id="sortDropdown" style={{ display: 'block' }}>
                  {Object.entries(sortLabels).map(([key, label]) => (
                    <div
                      key={key}
                      className="sort-option"
                      onClick={() => { setSortBy(key); setShowSort(false); }}
                    >
                      {key === 'active' ? '🔥' : key === 'members' ? '👥' : key === 'trending' ? '📈' : '✨'} {label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Grid */}
          <div className="body-area">
            <div className="grid-header">
              <div>
                <span className="grid-title">All Communities</span>
                <span className="grid-count" id="gridCount">
                  {loading ? 'Loading communities…' : `Showing ${filtered.length} of ${communities.length}`}
                </span>
              </div>
            </div>
            <div className="comm-grid" id="commGrid">
              {loading ? (
                <div style={{ color: 'var(--text-3,#666)', fontSize: '13px', gridColumn: '1/-1', padding: '40px 0', textAlign: 'center' }}>
                  Loading communities…
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ color: 'var(--text-3,#666)', fontSize: '13px', gridColumn: '1/-1', padding: '40px 0', textAlign: 'center' }}>
                  No communities match your search.
                </div>
              ) : (
                filtered.map(comm => {
                  const isJoined = joinedIds.has(String(comm.id));
                  return (
                    <div
                      key={comm.id}
                      className="comm-card"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/community/${comm.id}`)}
                    >
                      <div className="cc-banner" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))' }}>
                        <div className="cc-icon">{comm.icon || '🏘️'}</div>
                      </div>
                      <div className="cc-body">
                        <div className="cc-name">{comm.name}</div>
                        <div className="cc-meta">
                          <span className="cc-members">👥 {memberCountOf(comm).toLocaleString()} members</span>
                          {onlineCountOf(comm) > 0 && <span className="cc-online">🟢 {onlineCountOf(comm).toLocaleString()} online</span>}
                        </div>
                        {comm.category && (
                          <div style={{ fontSize: '11.5px', color: 'var(--text-3,#888)', marginTop: '4px' }}>
                            📁 {comm.category}
                          </div>
                        )}
                        <div className="cc-desc">{comm.description}</div>
                        {comm.tags && (
                          <div className="cc-tags">
                            {comm.tags.slice(0, 3).map(t => (
                              <span key={t} className="cc-tag">{t}</span>
                            ))}
                          </div>
                        )}
                        <button
                          className={`cc-join-btn${isJoined ? ' joined' : ''}`}
                          onClick={e => toggleJoin(comm.id, e)}
                          style={{
                            marginTop: '12px', width: '100%', padding: '8px',
                            borderRadius: '8px', border: 'none', cursor: 'pointer',
                            background: isJoined ? 'rgba(99,102,241,0.15)' : '#6366f1',
                            color: isJoined ? '#818cf8' : '#fff',
                            fontWeight: 600, fontSize: '13px', transition: 'all 0.2s',
                          }}
                        >
                          {isJoined ? '✓ Joined' : 'Join'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

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
