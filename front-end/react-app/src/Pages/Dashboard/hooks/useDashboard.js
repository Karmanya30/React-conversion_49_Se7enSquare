import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../../../services/dashboardService';
import { authService } from '../../../services/authService';

const DEFAULT_COMMUNITIES = [
  { id: 1, name: 'Pro Gamers', icon: '⚡', memberCount: 2451, description: 'Competitive gaming community' },
  { id: 2, name: 'Dev Nexus', icon: '💻', memberCount: 1200, description: 'Web developers and engineers' },
];

const DEFAULT_NOTIFICATIONS = [
  { id: 1, icon: '💬', text: 'Rahul Kumar mentioned you in #general', time: '10 min ago', read: false },
  { id: 2, icon: '📅', text: 'Gaming Hackathon starts tomorrow at 2:00 PM', time: '1 hr ago', read: false },
  { id: 3, icon: '👥', text: 'Priya Sharma joined Pro Gamers', time: '2 hr ago', read: true },
];

const DEFAULT_EVENTS = [
  { id: 1, title: 'Gaming Hackathon', community: 'Pro Gamers', date: 'Mar 7, 2025', time: '2:00 PM IST', type: '🏆' },
  { id: 2, title: 'Frontend Workshop', community: 'Dev Nexus', date: 'Mar 9, 2025', time: '5:00 PM IST', type: '💻' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Custom hook managing Dashboard data fetching, notifications, and search state and business logic.
 */
export default function useDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const u = authService.getCurrentUser();
    return {
      id: u?.id || 4,
      firstName: u?.firstName || u?.username || 'User',
      lastName: u?.lastName || '',
      username: u?.username || 'player01',
      role: u?.role || 'user',
    };
  });

  const [communities, setCommunities] = useState(DEFAULT_COMMUNITIES);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentUser = authService.getCurrentUser() || user;
      setUser({
        id: currentUser.id || 4,
        firstName: currentUser.firstName || currentUser.username || 'User',
        lastName: currentUser.lastName || '',
        username: currentUser.username || 'player01',
        role: currentUser.role || 'user',
      });

      const [commsRes, eventsRes, notifsRes, statsRes] = await Promise.allSettled([
        dashboardService.getCommunities(),
        dashboardService.getEvents(),
        dashboardService.getNotifications(currentUser.id || 4),
        dashboardService.getStats(),
      ]);

      if (commsRes.status === 'fulfilled' && Array.isArray(commsRes.value) && commsRes.value.length > 0) {
        setCommunities(commsRes.value.slice(0, 8));
      }

      if (eventsRes.status === 'fulfilled' && Array.isArray(eventsRes.value) && eventsRes.value.length > 0) {
        setEvents(
          eventsRes.value.slice(0, 4).map((e) => ({
            id: e.id,
            title: e.title,
            community: e.community || 'Community',
            date: e.date
              ? new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'TBD',
            time: e.time || '',
            type: '📅',
          }))
        );
      }

      if (notifsRes.status === 'fulfilled' && Array.isArray(notifsRes.value) && notifsRes.value.length > 0) {
        setNotifications(
          notifsRes.value.slice(0, 6).map((n) => ({
            id: n.id,
            icon: n.type === 'reaction' ? '💬' : n.type === 'report_status' ? '🛡️' : '🔔',
            text: n.text,
            time: n.createdAt
              ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Recently',
            read: n.read,
          }))
        );
      }

      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setStats(statsRes.value);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (val) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setShowSearch(false);
      return;
    }
    const lower = val.toLowerCase();
    const results = [
      ...communities
        .filter((c) => c.name?.toLowerCase().includes(lower))
        .map((c) => ({ type: 'community', id: c.id, label: c.name, icon: c.icon || '🏘️' })),
      ...events
        .filter((e) => e.title?.toLowerCase().includes(lower))
        .map((e) => ({ type: 'event', id: e.id, label: e.title, icon: '📅' })),
    ];
    setSearchResults(results.slice(0, 6));
    setShowSearch(true);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    navigate,
    user,
    greeting: getGreeting(),
    communities,
    notifications,
    events,
    stats,
    unreadCount,
    searchQuery,
    searchResults,
    showSearch,
    setShowSearch,
    handleSearch,
    markAllRead,
    loading,
    error,
    refresh: fetchData,
  };
}
