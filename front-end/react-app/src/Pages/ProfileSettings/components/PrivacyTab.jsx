import React from 'react';

/**
 * "Privacy" tab — profile visibility select, DM permissions select, toggle rows for email/phone/activity/search engine.
 */
export default function PrivacyTab({ privacy, setPrivacy }) {
  const toggle = (key) => setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="view active">
      <div className="settings-card">
        <div className="card-title">🔒 Privacy Controls</div>
        <div className="card-sub">Control who sees your information and who can contact you.</div>

        <div className="field" style={{ marginBottom: '16px' }}>
          <label>Profile Visibility</label>
          <select value={privacy.profileVis} onChange={e => setPrivacy({ ...privacy, profileVis: e.target.value })}>
            <option value="public">Public (Everyone)</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private (Only Me)</option>
          </select>
        </div>

        <div className="field" style={{ marginBottom: '24px' }}>
          <label>Allow Direct Messages From</label>
          <select value={privacy.messages} onChange={e => setPrivacy({ ...privacy, messages: e.target.value })}>
            <option value="everyone">Everyone</option>
            <option value="friends">Friends Only</option>
            <option value="nobody">Nobody</option>
          </select>
        </div>

        <div className="divider"></div>

        {[
          { key: 'showEmail',    title: 'Show Email on Profile',   desc: 'Let others see your email address.' },
          { key: 'showPhone',    title: 'Show Phone Number',       desc: 'Let others see your phone number.' },
          { key: 'showActivity', title: 'Show Activity Status',    desc: 'Show when you are currently online or in-game.' },
          { key: 'searchEngine', title: 'Search Engine Visibility',desc: 'Allow search engines to index your public profile.' },
        ].map(({ key, title, desc }) => (
          <div key={key} className="toggle-row">
            <div className="tr-info">
              <div className="tr-title">{title}</div>
              <div className="tr-desc">{desc}</div>
            </div>
            <div className={`toggle ${privacy[key] ? 'on' : ''}`} onClick={() => toggle(key)}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
