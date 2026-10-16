import SideBar from '../Components/SideBar';
import '../styles/global.css';
import '../styles/sidebar.css';
import '../styles/profile-settings.css';
import useProfileSettings from '../Components/platform/hooks/useProfileSettings';
import ProfileHeaderBar from './ProfileSettings/components/ProfileHeaderBar';
import ProfileNav from './ProfileSettings/components/ProfileNav';
import MyProfileTab from './ProfileSettings/components/MyProfileTab';
import AccountSecurityTab from './ProfileSettings/components/AccountSecurityTab';
import MembershipTab from './ProfileSettings/components/MembershipTab';
import PrivacyTab from './ProfileSettings/components/PrivacyTab';
import DangerZoneTab from './ProfileSettings/components/DangerZoneTab';

export default function ProfileSettings() {
  const p = useProfileSettings();
  return <div className="app-shell"><SideBar /><div className="main-column-wrapper">
    <ProfileHeaderBar formData={p.formData} isDirty={p.isDirty} canDiscard={p.canDiscard} saving={p.saving || p.loading} initials={p.initials} onDiscard={p.discardChanges} onSave={p.saveAllChanges} onLogout={p.handleLogout} />
    {p.loading ? <p role="status">Loading your profile…</p> : <div className="body-wrap">
      {p.user && <ProfileNav formData={p.formData} initials={p.initials} activeTab={p.activeTab} onSelectTab={p.setActiveTab} />}
      <div className="main">
        {p.user?.status && p.user.status !== 'active' && (
          <div
            className="card"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#fca5a5',
              padding: '16px 20px',
              borderRadius: '12px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>
                  Account {p.user.status === 'banned' ? 'Banned' : 'Suspended'}
                </div>
                <div style={{ fontSize: '13px', marginTop: '2px', color: '#fca5a5' }}>
                  Reason: {p.user.statusReason || 'Violation of community policies'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => p.navigate('/appeal')}
              style={{
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Appeal →
            </button>
          </div>
        )}
        {p.errors.length > 0 && <div role="alert" className="profile-error"><ul>{p.errors.map((error, i) => <li key={i}>{error}</li>)}</ul></div>}
        {p.toastMsg && <p role="status">{p.toastMsg}</p>}
        {p.user && <fieldset className="profile-fields" disabled={p.saving}>
          {p.activeTab === 'profile' && <MyProfileTab formData={p.formData} initials={p.initials} avatarPreview={p.avatarPreview} onInputChange={p.handleInputChange} onAvatarUpload={p.handleAvatarUpload} onRemovePhoto={p.removePhoto} />}
          {p.activeTab === 'account' && <AccountSecurityTab user={p.user} formData={p.formData} onInputChange={p.handleInputChange} passwords={p.passwords} setPasswords={p.setPasswords} showPassword={p.showPassword} setShowPassword={p.setShowPassword} />}
          {p.activeTab === 'privacy' && <PrivacyTab privacy={p.privacy} setPrivacy={p.setPrivacy} />}
          {p.activeTab === 'membership' && <MembershipTab p={p} />}
          {p.activeTab === 'danger' && <DangerZoneTab navigate={p.navigate} onShowToast={p.showToast} onLogout={p.handleLogout} />}
        </fieldset>}
      </div>
    </div>}
  </div></div>;
}
