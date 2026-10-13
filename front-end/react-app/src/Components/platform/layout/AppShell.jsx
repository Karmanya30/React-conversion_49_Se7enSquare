import React from 'react';
import SideBar from '../../SideBar';
import Header from '../../Header';

/**
 * AppShell Layout Component
 * Composes existing SideBar and Header without modifying them.
 * Supports props for headerIcon, headerTitle, headerBadge, headerActions,
 * onAvatarClick, or a customHeader slot if custom header markup is required.
 */
export default function AppShell({
  headerIcon,
  headerTitle,
  headerBadge,
  headerActions,
  onAvatarClick,
  customHeader,
  children,
}) {
  return (
    <div className="app-shell">
      <SideBar />
      <div className="main">
        {customHeader ? (
          customHeader
        ) : (
          <Header
            icon={headerIcon}
            title={headerTitle}
            badge={headerBadge}
            onAvatarClick={onAvatarClick}
          >
            {headerActions}
          </Header>
        )}
        {children}
      </div>
    </div>
  );
}
