import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Manages fetching, filtering, and search state for the User Management page.
 */
export default function useUserManagement() {
  const navigate = useNavigate();

  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    let role = 'admin';
    try {
      const u = JSON.parse(
        localStorage.getItem('user') ||
        localStorage.getItem('nexus_user') ||
        localStorage.getItem('currentUser') ||
        '{}'
      );
      if (u.role) role = u.role;
    } catch {}

    fetch(`${API_BASE}/users`, { headers: { 'x-role': role } })
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setUsers([]);
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter(u => {
    const matchSearch =
      !search ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Derived role counts for stats
  const roleCounts = {
    total:     users.length,
    admin:     users.filter(u => u.role === 'admin').length,
    moderator: users.filter(u => u.role === 'moderator').length,
    user:      users.filter(u => u.role === 'user').length,
  };

  return {
    navigate,
    users, loading,
    filteredUsers,
    search, setSearch,
    roleFilter, setRoleFilter,
    roleCounts,
  };
}
