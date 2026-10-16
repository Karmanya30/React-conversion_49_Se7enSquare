import { useState, useMemo } from 'react';
import { apiRequest, getStoredUser } from '../../../services/api';

/**
 * Custom hook managing user directory, role editing, suspensions, bans, and reinstatement.
 * All mutations call the API first, await confirmation, then refresh the user list.
 * No optimistic local updates.
 */
export default function useAdminUsers(showToast) {
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState(null);

  const adminUser = getStoredUser();

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      const matchSearch =
        !userSearch ||
        u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [users, userSearch, userRoleFilter]);

  const refreshUsers = async () => {
    try {
      const data = await apiRequest('/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch { /* leave current list */ }
  };

  const updateUserRole = async (userId, newRole) => {
    if (userId === adminUser?.id) {
      showToast('❌ Cannot change your own role');
      return;
    }
    try {
      await apiRequest(`/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      setEditingUser(null);
      showToast(`✓ Role updated to ${newRole}`);
      await refreshUsers();
    } catch (err) {
      showToast(`❌ ${err.message}`);
    }
  };

  const suspendUser = async (userId, reason) => {
    if (userId === adminUser?.id) {
      showToast('❌ Cannot suspend your own account');
      return;
    }
    const targetUser = users.find((u) => u.id === userId);
    const defaultReason = reason || 'Violation of community guidelines';
    const r = window.prompt(`Suspend ${targetUser?.username || `user #${userId}`}?\nEnter reason:`, defaultReason);
    if (!r?.trim()) return;
    try {
      await apiRequest(`/users/${userId}/suspend`, {
        method: 'POST',
        body: JSON.stringify({ reason: r.trim() }),
      });
      showToast('⚠️ User suspended');
      await refreshUsers();
    } catch (err) {
      showToast(`❌ ${err.message}`);
    }
  };

  const banUser = async (userId, reason) => {
    if (userId === adminUser?.id) {
      showToast('❌ Cannot ban your own account');
      return;
    }
    const targetUser = users.find((u) => u.id === userId);
    const defaultReason = reason || 'Repeated policy violations';
    const r = window.prompt(`Permanently ban @${targetUser?.username || `user #${userId}`}?\nEnter reason:`, defaultReason);
    if (!r?.trim()) return;
    try {
      await apiRequest(`/users/${userId}/ban`, {
        method: 'POST',
        body: JSON.stringify({ reason: r.trim() }),
      });
      showToast(`⛔ User banned`);
      await refreshUsers();
    } catch (err) {
      showToast(`❌ ${err.message}`);
    }
  };

  const reinstateUser = async (userId) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!window.confirm(`Reinstate ${targetUser?.username || `user #${userId}`}? Their account will be unlocked.`)) return;
    try {
      await apiRequest(`/users/${userId}/reinstate`, {
        method: 'POST',
        body: JSON.stringify({ reason: 'Reinstated by admin' }),
      });
      showToast('✅ User reinstated');
      await refreshUsers();
    } catch (err) {
      showToast(`❌ ${err.message}`);
    }
  };

  return {
    users,
    setUsers,
    refreshUsers,
    userSearch,
    setUserSearch,
    userRoleFilter,
    setUserRoleFilter,
    editingUser,
    setEditingUser,
    filteredUsers,
    updateUserRole,
    suspendUser,
    banUser,
    reinstateUser,
  };
}
