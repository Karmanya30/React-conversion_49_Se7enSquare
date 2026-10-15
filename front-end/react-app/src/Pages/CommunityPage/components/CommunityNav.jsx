import React from 'react';

/**
 * Tab bar for CommunityPage: Overview, Channels, Members, Rules.
 */
export default function CommunityNav({ tabs, activeTab, onTabChange }) {
  return (
    <div className="tab-bar">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="tab-count">{(tab.count || 0).toLocaleString()}</span>
          )}
        </button>
      ))}
    </div>
  );
}
