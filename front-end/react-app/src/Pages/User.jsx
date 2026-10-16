import React from 'react';
import SideBar from '../Components/SideBar';
import '../styles/global.css';
import '../styles/sidebar.css';
import '../styles/admin-dashboard.css';
import useUserManagement from '../Components/platform/hooks/useUserManagement';
import UserHeader    from './User/components/UserHeader';
import UserFilterBar from './User/components/UserFilterBar';
import UserTable     from './User/components/UserTable';

/**
 * User Management page — thin orchestrator.
 * All state and fetching logic lives in useUserManagement().
 */
export default function User() {
  const u = useUserManagement();

  return (
    <div className="app-shell">
      <SideBar />

      <div className="main">
        <UserHeader navigate={u.navigate} />

        <div className="page active" style={{ padding: '24px 32px' }}>
          <UserFilterBar
            search={u.search}
            onSearchChange={u.setSearch}
            roleFilter={u.roleFilter}
            onRoleFilterChange={u.setRoleFilter}
            filteredCount={u.filteredUsers.length}
            totalCount={u.users.length}
          />
          <UserTable
            loading={u.loading}
            filteredUsers={u.filteredUsers}
            navigate={u.navigate}
          />
        </div>
      </div>
    </div>
  );
}
