import React from 'react';
import { SETTINGS_TABS } from '../../../Components/platform/data/defaultCommunityData';

/**
 * Left sidebar navigation for switching community settings tabs.
 */
export default function SettingsNav({ activeTab, onSelectTab }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-heading">Community Settings</div>
      <nav className="settings-nav" aria-label="Community settings sections">
        {SETTINGS_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`settings-nav-item tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onSelectTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
