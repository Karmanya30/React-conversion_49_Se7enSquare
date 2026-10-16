import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getAdminUser() {
  try {
    const raw = JSON.parse(
      localStorage.getItem('user') ||
      localStorage.getItem('nexus_user') ||
      localStorage.getItem('currentUser') ||
      '{}'
    );
    return {
      id: raw.id || 1,
      role: raw.role || 'admin',
      firstName: raw.firstName || raw.name?.split(' ')[0] || 'Rajat',
      username: raw.username || 'rajat',
    };
  } catch {
    return { id: 1, role: 'admin', firstName: 'Rajat', username: 'rajat' };
  }
}

/**
 * Admin Dashboard Page Component
 * Refactored modular dashboard orchestrating sub-hooks and subcomponents
 * for 9 administrative views while preserving all classes and handlers.
 */
export default function AdminDashboard() {
  const adminUser = getAdminUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activePage, setActivePage] = useState(tabParam || 'overview');
  const [globalSearch, setGlobalSearch] = useState('');
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab && currentTab !== activePage) {
      setActivePage(currentTab);
    }
  }, [searchParams, activePage]);

  const handleSelectPage = (pageId) => {
    setActivePage(pageId);
    setSearchParams({ tab: pageId });
  };

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
        const headers = {
          'x-user-id': String(adminUser.id || 1),
          'x-role': adminUser.role || 'admin',
        };
        const [usersRes, commsRes, reportsRes, eventsRes, appealsRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/users`, { headers }),
          fetch(`${API_BASE}/communities`, { headers }),
          fetch(`${API_BASE}/reports`, { headers }),
          fetch(`${API_BASE}/events`, { headers }),
          fetch(`${API_BASE}/appeals`, { headers }),
          fetch(`${API_BASE}/dashboard/stats`, { headers }),
        ]);
        if (usersRes.ok) { const d = await usersRes.json(); setUsers(Array.isArray(d) ? d : []); }
        if (commsRes.ok) { const d = await commsRes.json(); setCommunities(Array.isArray(d) ? d : []); }
        if (reportsRes.ok) { const d = await reportsRes.json(); setReports(Array.isArray(d) ? d : []); }
        if (eventsRes.ok) { const d = await eventsRes.json(); setEvents(Array.isArray(d) ? d : []); }
        if (appealsRes.ok) { const d = await appealsRes.json(); setAppeals(Array.isArray(d) ? d : []); }
        if (statsRes.ok) {
          const s = await statsRes.json();
          setStats((prev) => ({
            ...prev,
            messages: s.totalMessages || 0,
          }));
        }
      } catch {}
    }
    fetchAll();
  }, [adminUser.id, adminUser.role, setUsers, setCommunities, setReports, setEvents, setAppeals]);

  // Recalculate platform overview stats strictly from data
  useEffect(() => {
    setStats((prev) => ({
      users: users.length,
      comms: communities.length,
      reports: reports.filter((r) => r.status === 'pending').length,
      events: events.filter((e) => e.status === 'approved').length,
      appeals: appeals.filter((a) => a.status === 'pending').length,
      messages: prev.messages || 0,
    }));
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
      <AdminNav activePage={activePage} onSelectPage={handleSelectPage} />

      <div className="admin-content-area">
        {activePage === 'overview' && (
          <OverviewTab
            stats={stats}
            auditLog={auditLog}
            openReportsCount={stats.reports}
            onNavigate={handleSelectPage}
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
