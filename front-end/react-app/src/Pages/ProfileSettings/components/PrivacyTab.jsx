export default function PrivacyTab({ privacy, setPrivacy }) {
  return <div className="view active"><div className="settings-card">
    <h2 className="card-title">Privacy</h2>
    <p className="card-sub">Administrators and moderators reviewing a report can see the information needed to handle it.</p>
    <label className="field">Profile visibility
      <select value={privacy.profileVisibility} onChange={e => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}>
        <option value="public">Public</option><option value="members">Shared community members</option><option value="private">Private</option>
      </select>
    </label>
    <p className="field-hint">Your username and role remain visible in community member lists.</p>
    {[
      ['showEmail', 'Show email on my profile'], ['showPhone', 'Show phone on my profile'],
      ['showActivity', 'Show my posts in profile activity'], ['appearInSearch', 'Appear in user search and directory'],
    ].map(([key, label]) => <label className="toggle-row" key={key}>
      <span>{label}</span><input type="checkbox" checked={privacy[key]} onChange={e => setPrivacy(prev => ({ ...prev, [key]: e.target.checked }))} />
    </label>)}
  </div></div>;
}
