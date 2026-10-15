import React from 'react';

/**
 * Step 4: Privacy selector (Public / Private) and member permission toggles.
 */
export default function PrivacyTypeSelector({ privacy, permissions, onPrivacyChange, onPermissionToggle }) {
  return (
    <>
      <div className="fg">
        <div className="f-label">Privacy</div>
        <div className="role-grid">
          <div
            className={`role-card ${privacy === 'public' ? 'on' : ''}`}
            onClick={() => onPrivacyChange('public')}
            style={{ cursor: 'pointer' }}
          >
            <div className="rc-top">
              <span className="rc-ico">🌍</span>
              {privacy === 'public' && <span className="rc-badge">Selected</span>}
            </div>
            <div className="rc-name">Public</div>
            <div className="rc-desc">Anyone can find and join. Content is visible to all.</div>
          </div>
          <div
            className={`role-card ${privacy === 'private' ? 'on' : ''}`}
            onClick={() => onPrivacyChange('private')}
            style={{ cursor: 'pointer' }}
          >
            <div className="rc-top">
              <span className="rc-ico">🔒</span>
              {privacy === 'private' && <span className="rc-badge">Selected</span>}
            </div>
            <div className="rc-name">Private</div>
            <div className="rc-desc">Invite-only. Content hidden from non-members.</div>
          </div>
        </div>
      </div>

      <div className="fg">
        <div className="f-label">Member Permissions</div>
        <div>
          {[
            { key: 'invites', label: 'Allow invites from members', desc: 'Any member can invite others to join' },
            { key: 'approval', label: 'Require approval to join', desc: 'New members need admin approval' },
            { key: 'autoMod', label: 'Enable AutoMod', desc: 'AI moderates harmful content automatically' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="toggle-row">
              <div className="tr-l">
                <div className="tr-lbl">{label}</div>
                <div className="tr-desc">{desc}</div>
              </div>
              <div
                className={`toggle ${permissions[key] ? 'on' : ''}`}
                onClick={() => onPermissionToggle(key)}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
