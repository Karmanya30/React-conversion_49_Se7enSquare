import React from 'react';
import { STATUS_OPTIONS } from '../../../Components/platform/data/profileSettingsData';

/**
 * "My Profile" tab — avatar picker, name/username/bio fields, status selector.
 */
export default function MyProfileTab({ formData, initials, onInputChange, onStatusChange, onAvatarUpload, onRemovePhoto }) {
  return (
    <div className="view active">
      <div className="settings-card">
        <div className="card-title">👤 Public Profile</div>
        <div className="card-sub">This is how other members see you across Gameunity.</div>

        <div className="avatar-picker" style={{ marginBottom: '24px' }}>
          <div
            className="av-preview user-avatar"
            style={{
              backgroundImage:    formData.avatar ? `url(${formData.avatar})` : 'none',
              backgroundSize:     'cover',
              backgroundPosition: 'center',
              display:            'flex',
              alignItems:         'center',
              justifyContent:     'center',
              fontWeight:         700,
              fontSize:           '32px',
            }}
          >
            {!formData.avatar && initials}
          </div>
          <div className="av-actions">
            <label className="btn-sm accent" style={{ cursor: 'pointer' }}>
              📷 Upload Photo
              <input type="file" accept="image/*" hidden onChange={onAvatarUpload} />
            </label>
            <div className="btn-sm" onClick={onRemovePhoto} style={{ cursor: 'pointer' }}>Remove Photo</div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', maxWidth: '200px' }}>
            Recommended: Square image, min 200×200px. PNG, JPG or WEBP, max 5MB.
          </div>
        </div>

        <div className="field-row" style={{ marginBottom: '16px' }}>
          <div className="field">
            <label>First Name *</label>
            <input type="text" value={formData.firstName} onChange={e => onInputChange('firstName', e.target.value)} required />
          </div>
          <div className="field">
            <label>Last Name *</label>
            <input type="text" value={formData.lastName}  onChange={e => onInputChange('lastName',  e.target.value)} />
          </div>
        </div>

        <div className="field-row" style={{ marginBottom: '16px' }}>
          <div className="field">
            <label>Username *</label>
            <input type="text" value={formData.username} onChange={e => onInputChange('username', e.target.value)} required />
            <div className="field-hint">nexushub.io/@<span>{formData.username}</span></div>
          </div>
          <div className="field">
            <label>Display Name *</label>
            <input type="text" value={formData.fullName} onChange={e => onInputChange('fullName', e.target.value)} required />
          </div>
        </div>

        <div className="field" style={{ marginBottom: '16px' }}>
          <label>Bio</label>
          <textarea value={formData.bio} onChange={e => onInputChange('bio', e.target.value)} maxLength={160} />
          <div className="field-hint">160 characters max. Visible on your public profile.</div>
        </div>
      </div>

      <div className="settings-card">
        <div className="card-title">🟢 Status</div>
        <div className="card-sub">Set your current activity status.</div>
        <div className="badge-row">
          {STATUS_OPTIONS.map(st => (
            <div
              key={st.id}
              className={`status-badge ${formData.status === st.id ? 'on' : ''}`}
              onClick={() => onStatusChange(st.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="dot" style={{ background: st.color }}></div>
              {st.id}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
