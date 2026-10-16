export default function AccountSecurityTab({ formData, user, onInputChange, passwords, setPasswords, showPassword, setShowPassword }) {
  return <div className="view active"><div className="settings-card">
    <h2 className="card-title">Account Details</h2>
    <div className="field-row">
      <label className="field">Email<input name="email" type="email" value={formData.email} disabled={Boolean(user.googleId)} onChange={e => onInputChange('email', e.target.value)} /></label>
      <label className="field">Phone<input name="phone" type="tel" value={formData.phone} onChange={e => onInputChange('phone', e.target.value)} /></label>
    </div>
    <h2 className="card-title">{user.hasPassword ? 'Change password' : 'Set a password'}</h2>
    <p className="field-hint">Use 8–128 characters, including a letter and a number. Leave blank to keep your password.</p>
    {(user.hasPassword ? ['current', 'new', 'confirm'] : ['new', 'confirm']).map(key => <label className="field" key={key}>
      {key === 'current' ? 'Current password' : key === 'new' ? 'New password' : 'Confirm new password'}
      <input name={key} type={showPassword[key] ? 'text' : 'password'} autoComplete={key === 'current' ? 'current-password' : 'new-password'} value={passwords[key]} onChange={e => setPasswords(prev => ({ ...prev, [key]: e.target.value }))} />
      <button type="button" className="btn-sm" onClick={() => setShowPassword(prev => ({ ...prev, [key]: !prev[key] }))}>{showPassword[key] ? 'Hide' : 'Show'} password</button>
    </label>)}
  </div></div>;
}
