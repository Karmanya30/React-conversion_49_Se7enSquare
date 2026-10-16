import React from 'react';

/**
 * "Account & Security" tab — email/phone fields, change-password section with show/hide toggles.
 */
export default function AccountSecurityTab({ formData, onInputChange, passwords, setPasswords, showPassword, setShowPassword }) {
  return (
    <div className="view active">
      <div className="settings-card">
        <div className="card-title">📧 Account Details</div>
        <div className="card-sub">Manage your login credentials and account info.</div>

        <div className="field-row" style={{ marginBottom: '16px' }}>
          <div className="field">
            <label>Email Address *</label>
            <input type="email" value={formData.email} onChange={e => onInputChange('email', e.target.value)} required />
          </div>
          <div className="field">
            <label>Phone Number *</label>
            <input type="tel" value={formData.phone} onChange={e => onInputChange('phone', e.target.value)} />
          </div>
        </div>

        <div className="divider"></div>
        <div className="card-title" style={{ marginBottom: '8px' }}>🔑 Change Password</div>
        <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '16px' }}>
          Leave these fields blank unless you want to change your password.
        </div>

        <div className="field" style={{ marginBottom: '16px' }}>
          <label>Current Password</label>
          <div className="pwd-wrapper">
            <input
              type={showPassword.current ? 'text' : 'password'}
              value={passwords.current}
              placeholder="••••••••"
              onChange={e => setPasswords({ ...passwords, current: e.target.value })}
            />
            <span className="pwd-toggle" onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}>
              {showPassword.current ? '🐵' : '🙈'}
            </span>
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>New Password</label>
            <div className="pwd-wrapper">
              <input
                type={showPassword.new ? 'text' : 'password'}
                value={passwords.new}
                placeholder="Min 8 characters"
                onChange={e => setPasswords({ ...passwords, new: e.target.value })}
              />
              <span className="pwd-toggle" onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}>
                {showPassword.new ? '🐵' : '🙈'}
              </span>
            </div>
          </div>
          <div className="field">
            <label>Confirm New Password</label>
            <div className="pwd-wrapper">
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                value={passwords.confirm}
                placeholder="Repeat new password"
                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
              />
              <span className="pwd-toggle" onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}>
                {showPassword.confirm ? '🐵' : '🙈'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
