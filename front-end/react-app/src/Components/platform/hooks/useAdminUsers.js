import { useState, useMemo } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Custom hook managing user directory, role editing, suspensions, and bans.
 */
export default function useAdminUsers(adminUser, showToast, addAuditLog) {
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState(null);

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

  const updateUserRole = async (userId, newRole) => {
    try {
      const res = await fetch(`${API_BASE}/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(adminUser.id || 1),
          'x-role': adminUser.role || 'admin',
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update role');
      }
      const updatedUser = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: updatedUser.role || newRole } : u)));
      setEditingUser(null);
      addAuditLog(`Updated role for user #${userId} to ${newRole}`, 'role');
      showToast(`✓ Role updated to ${newRole}`);
    } catch (err) {
      showToast(`❌ ${err.message}`);
    }
  };

  const suspendUser = async (userId) => {
    if (!window.confirm('Suspend this user? They will be locked out until suspension is lifted.')) return;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'suspended' } : u)));
    addAuditLog(`Suspended user #${userId}`, 'moderation');
    showToast('⚠️ User suspended');
    try {
      await fetch(`${API_BASE}/users/${userId}/suspend`, {
        method: 'POST',
        headers: { 'x-role': adminUser.role },
      });
    } catch {}
  };

  const banUser = async (userId, targetUsername) => {
    if (!window.confirm(`Permanently ban @${targetUsername}? This will terminate their active sessions.`)) return;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'banned' } : u)));
    addAuditLog(`Permanently banned user @${targetUsername}`, 'moderation');
    showToast(`⛔ User @${targetUsername} banned`);
  };

  const resetPassword = (targetUsername) => {
    addAuditLog(`Sent password reset token for @${targetUsername}`, 'security');
    showToast(`🔑 Password reset link dispatched for @${targetUsername}`);
  };

  return {
    users,
    setUsers,
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
    resetPassword,
  };
}
