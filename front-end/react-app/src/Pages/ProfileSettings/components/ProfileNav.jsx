import React from 'react';

const NAV_SECTIONS = [
  {
    label: 'Account',
    items: [
      { tab: 'profile',      icon: '👤', label: 'My Profile' },
      { tab: 'account',      icon: '🔐', label: 'Account & Security' },
      { tab: 'membership',   icon: '💎', label: 'Membership' },
      { tab: 'privacy',      icon: '🔒', label: 'Privacy' },
    ],
  },

];

/**
 * Left navigation sidebar for ProfileSettings — avatar, display name, section links.
 */
export default function ProfileNav({ formData, initials, activeTab, onSelectTab }) {
  return (
    <nav className="left-nav">
      <div className="nav-profile" onClick={() => onSelectTab('profile')}>
        <div className="profile-av-wrap">
          <div
            className="profile-av user-avatar"
            style={{
              backgroundImage:    formData.avatar ? `url(${formData.avatar})` : 'none',
              backgroundSize:     'cover',
              backgroundPosition: 'center',
              display:            'flex',
              alignItems:         'center',
              justifyContent:     'center',
              fontWeight:         700,
              fontSize:           '24px',
            }}
          >
            {!formData.avatar && initials}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className="profile-name user-name">{formData.firstName} {formData.lastName}</div>
          <div className="profile-handle">@{formData.username}</div>

        </div>
      </div>

      {NAV_SECTIONS.map(section => (
        <div key={section.label} className="ln-section">
          <div className="ln-label">{section.label}</div>
          {section.items.map(({ tab, icon, label }) => (
            <div
              key={tab}
              className={`ln-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => onSelectTab(tab)}
            >
              <span className="ln-icon">{icon}</span> {label}
            </div>
          ))}
        </div>
      ))}

      <div className="ln-section">
        <div
          className={`ln-item ln-danger ${activeTab === 'danger' ? 'active' : ''}`}
          onClick={() => onSelectTab('danger')}
        >
          <span className="ln-icon">⚠️</span> Danger Zone
        </div>
      </div>
    </nav>
  );
}
