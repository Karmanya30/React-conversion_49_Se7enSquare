import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../../../services/dashboardService';
import { authService } from '../../../services/authService';

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

  const [communities, setCommunities] = useState([]);
  const [createdCommunities, setCreatedCommunities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [events, setEvents] = useState([]);
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
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser((prev) => {
          if (prev.id === currentUser.id && prev.username === currentUser.username && prev.role === currentUser.role) {
            return prev;
          }
          return {
            id: currentUser.id || 4,
            firstName: currentUser.firstName || currentUser.username || 'User',
            lastName: currentUser.lastName || '',
            username: currentUser.username || 'player01',
            role: currentUser.role || 'user',
          };
        });
      }

      const currentId = currentUser?.id || 4;
      const [joinedRes, createdRes, eventsRes, notifsRes, statsRes] = await Promise.allSettled([
        dashboardService.getJoinedCommunities(currentId),
        dashboardService.getCreatedCommunities(currentId),
        dashboardService.getEvents(),
        dashboardService.getNotifications(currentId),
        dashboardService.getStats(),
      ]);

      if (joinedRes.status === 'fulfilled' && Array.isArray(joinedRes.value)) {
        setCommunities(joinedRes.value.slice(0, 8));
      } else {
        setCommunities([]);
      }

      if (createdRes.status === 'fulfilled' && Array.isArray(createdRes.value)) {
        setCreatedCommunities(createdRes.value.slice(0, 8));
      } else {
        setCreatedCommunities([]);
      }

      if (eventsRes.status === 'fulfilled' && Array.isArray(eventsRes.value)) {
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
      } else {
        setEvents([]);
      }

      if (notifsRes.status === 'fulfilled' && Array.isArray(notifsRes.value)) {
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
      } else {
        setNotifications([]);
      }

      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setStats(statsRes.value);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

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
    const allComms = [...communities, ...createdCommunities];
    const results = [
      ...allComms
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
    createdCommunities,
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
