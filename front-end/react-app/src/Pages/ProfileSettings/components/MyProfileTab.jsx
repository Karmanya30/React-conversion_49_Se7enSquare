export default function MyProfileTab({ formData, initials, onInputChange, onAvatarUpload, onRemovePhoto, avatarPreview }) {
  return <div className="view active"><div className="settings-card">
    <h2 className="card-title">Public Profile</h2>
    <div className="avatar-picker">
      {avatarPreview || formData.avatar ? <img className="av-preview" src={avatarPreview || formData.avatar} alt="Profile preview" /> : <div className="av-preview">{initials}</div>}
      <label className="btn-sm accent">Upload Photo<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={onAvatarUpload} /></label>
      <button type="button" className="btn-sm" onClick={onRemovePhoto}>Remove Photo</button>
    </div>
    <p className="field-hint">PNG, JPG, GIF or WEBP, up to 5MB. Your photo is uploaded when you save.</p>
    <div className="field-row">
      {['firstName', 'lastName', 'username'].map(key => <label className="field" key={key}>
        {key === 'firstName' ? 'First name' : key === 'lastName' ? 'Last name' : 'Username'}
        <input name={key} value={formData[key]} onChange={e => onInputChange(key, e.target.value)} />
      </label>)}
    </div>
    <label className="field">Bio<textarea name="bio" value={formData.bio} onChange={e => onInputChange('bio', e.target.value)} /></label>
    <p className="field-hint">5–160 characters. Your display name uses your first and last name.</p>
  </div></div>;
}
