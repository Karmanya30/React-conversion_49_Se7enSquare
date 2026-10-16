import React, { useState, useEffect } from 'react';
import AppShell from '../Components/platform/layout/AppShell';
import Toast from '../Components/platform/common/Toast';
import useToast from '../Components/platform/hooks/useToast';
import useAuditLog from './AdminDashboard/hooks/useAuditLog';
import useAdminUsers from './AdminDashboard/hooks/useAdminUsers';
import useAdminModeration from './AdminDashboard/hooks/useAdminModeration';
import useAdminConfig from './AdminDashboard/hooks/useAdminConfig';
import { PAGES, DEFAULT_STATS } from '../Components/platform/data/adminData';
import AdminHeader from './AdminDashboard/components/AdminHeader';
import AdminNav from './AdminDashboard/components/AdminNav';
import OverviewTab from './AdminDashboard/components/OverviewTab';
import UsersTab from './AdminDashboard/components/UsersTab';
import CommunitiesTab from './AdminDashboard/components/CommunitiesTab';
import ModerationTab from './AdminDashboard/components/ModerationTab';
import AppealsTab from './AdminDashboard/components/AppealsTab';
import EventsTab from './AdminDashboard/components/EventsTab';
import ApplicationsTab from './AdminDashboard/components/ApplicationsTab';
import AuditLogTab from './AdminDashboard/components/AuditLogTab';
import ConfigTab from './AdminDashboard/components/ConfigTab';
import '../styles/global.css';
import '../styles/sidebar.css';
import '../styles/admin-dashboard.css';

const API_BASE = 'http://localhost:3000/api';

function getAdminUser() {
  try {
    const raw = JSON.parse(localStorage.getItem('nexus_user') || localStorage.getItem('currentUser') || '{}');
    return { role: raw.role || 'admin', firstName: raw.firstName || 'Rajat', username: raw.username || 'rajat' };
  } catch {
    return { role: 'admin', firstName: 'Rajat', username: 'rajat' };
  }
}

/**
 * Admin Dashboard Page Component
 * Refactored modular dashboard orchestrating sub-hooks and subcomponents
 * for 9 administrative views while preserving all classes and handlers.
 */
export default function AdminDashboard() {
  const adminUser = getAdminUser();
  const [activePage, setActivePage] = useState('overview');
  const [globalSearch, setGlobalSearch] = useState('');
  const [stats, setStats] = useState(DEFAULT_STATS);

  const { toast, showToast } = useToast();
  const { auditLog, addAuditLog } = useAuditLog(adminUser.username);

  const {
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
  } = useAdminUsers(adminUser, (msg) => showToast('ℹ️', msg), addAuditLog);

  const {
    communities,
    setCommunities,
    reports,
    setReports,
    events,
    setEvents,
    appeals,
    setAppeals,
    organizerApps,
    moderatorApps,
    handleModerationAction,
    handleAppeal,
    handleOrganizerApp,
    handleModeratorApp,
  } = useAdminModeration(adminUser, (msg) => showToast('ℹ️', msg), addAuditLog);

  const {
    config,
    policies,
    newPolicyText,
    setNewPolicyText,
    updateConfigField,
    handleAddPolicy,
    handleDeletePolicy,
  } = useAdminConfig((msg) => showToast('ℹ️', msg), addAuditLog);

  // Fetch initial data from server if available
  useEffect(() => {
    async function fetchAll() {
      try {
        const [usersRes, commsRes, reportsRes, eventsRes, appealsRes] = await Promise.all([
          fetch(`${API_BASE}/users`, { headers: { 'x-role': adminUser.role } }),
          fetch(`${API_BASE}/communities`, { headers: { 'x-role': adminUser.role } }),
          fetch(`${API_BASE}/reports`, { headers: { 'x-role': adminUser.role } }),
          fetch(`${API_BASE}/events`, { headers: { 'x-role': adminUser.role } }),
          fetch(`${API_BASE}/appeals`, { headers: { 'x-role': adminUser.role } }),
        ]);
        if (usersRes.ok) { const d = await usersRes.json(); if (Array.isArray(d) && d.length > 0) setUsers(d); }
        if (commsRes.ok) { const d = await commsRes.json(); if (Array.isArray(d)) setCommunities(d); }
        if (reportsRes.ok) { const d = await reportsRes.json(); if (Array.isArray(d)) setReports(d); }
        if (eventsRes.ok) { const d = await eventsRes.json(); if (Array.isArray(d)) setEvents(d); }
        if (appealsRes.ok) { const d = await appealsRes.json(); if (Array.isArray(d)) setAppeals(d); }
      } catch {}
    }
    fetchAll();
  }, [adminUser.role, setUsers, setCommunities, setReports, setEvents, setAppeals]);

  // Recalculate platform overview stats
  useEffect(() => {
    setStats({
      users: users.length,
      comms: communities.length || 3,
      reports: reports.filter((r) => r.status === 'pending').length || 1,
      events: events.filter((e) => e.status === 'approved').length || 2,
      appeals: appeals.filter((a) => a.status === 'pending').length || 1,
      messages: 48000,
    });
  }, [users, communities, reports, events, appeals]);

  const currentPage = PAGES.find((p) => p.id === activePage);

  return (
    <AppShell
      customHeader={
        <AdminHeader
          currentPage={currentPage}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          adminUser={adminUser}
        />
      }
    >
      <AdminNav activePage={activePage} onSelectPage={setActivePage} />

      <div className="admin-content-area">
        {activePage === 'overview' && (
          <OverviewTab
            stats={stats}
            auditLog={auditLog}
            openReportsCount={stats.reports}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'users' && (
          <UsersTab
            userSearch={userSearch}
            setUserSearch={setUserSearch}
            userRoleFilter={userRoleFilter}
            setUserRoleFilter={setUserRoleFilter}
            filteredUsers={filteredUsers}
            editingUser={editingUser}
            setEditingUser={setEditingUser}
            updateUserRole={updateUserRole}
            suspendUser={suspendUser}
            banUser={banUser}
            resetPassword={resetPassword}
          />
        )}

        {activePage === 'communities' && (
          <CommunitiesTab
            communities={communities}
            setCommunities={setCommunities}
            addAuditLog={addAuditLog}
            showToast={(msg) => showToast('ℹ️', msg)}
          />
        )}

        {activePage === 'moderation' && (
          <ModerationTab
            reports={reports}
            onModerationAction={handleModerationAction}
          />
        )}

        {activePage === 'events-mgmt' && <EventsTab events={events} />}

        {activePage === 'appeals' && (
          <AppealsTab appeals={appeals} onAppeal={handleAppeal} />
        )}

        {activePage === 'applications' && (
          <ApplicationsTab
            organizerApps={organizerApps}
            moderatorApps={moderatorApps}
            onOrganizerApp={handleOrganizerApp}
            onModeratorApp={handleModeratorApp}
          />
        )}

        {activePage === 'audit' && <AuditLogTab auditLog={auditLog} />}

        {activePage === 'config' && (
          <ConfigTab
            config={config}
            onUpdateConfig={updateConfigField}
            policies={policies}
            newPolicyText={newPolicyText}
            setNewPolicyText={setNewPolicyText}
            onAddPolicy={handleAddPolicy}
            onDeletePolicy={handleDeletePolicy}
          />
        )}
      </div>

      <Toast toast={toast} />
    </AppShell>
  );
}
