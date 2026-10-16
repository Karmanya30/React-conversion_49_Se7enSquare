import React from 'react';
import SideBar from '../Components/SideBar';
import '../styles/global.css';
import '../styles/sidebar.css';
import '../styles/profile-settings.css';
import useProfileSettings from '../Components/platform/hooks/useProfileSettings';
import ProfileHeaderBar    from './ProfileSettings/components/ProfileHeaderBar';
import ProfileNav          from './ProfileSettings/components/ProfileNav';
import MyProfileTab        from './ProfileSettings/components/MyProfileTab';
import AccountSecurityTab  from './ProfileSettings/components/AccountSecurityTab';
import MembershipTab       from './ProfileSettings/components/MembershipTab';
import PrivacyTab          from './ProfileSettings/components/PrivacyTab';
import AppearanceTab       from './ProfileSettings/components/AppearanceTab';
import AccessibilityTab    from './ProfileSettings/components/AccessibilityTab';
import DangerZoneTab       from './ProfileSettings/components/DangerZoneTab';

/**
 * ProfileSettings page — thin orchestrator.
 * All state and handlers live in useProfileSettings().
 */
export default function ProfileSettings() {
  const p = useProfileSettings();

  return (
    <div className="app-shell">
      <SideBar />

      <div className="main-column-wrapper">
        <ProfileHeaderBar
          formData={p.formData}
          isDirty={p.isDirty}
          initials={p.initials}
          onDiscard={p.discardChanges}
          onSave={p.saveAllChanges}
          onLogout={p.handleLogout}
        />

        <div className="body-wrap">
          <ProfileNav
            formData={p.formData}
            initials={p.initials}
            activeTab={p.activeTab}
            onSelectTab={p.setActiveTab}
          />

          <div className="main">
            {p.activeTab === 'profile' && (
              <MyProfileTab
                formData={p.formData}
                initials={p.initials}
                onInputChange={p.handleInputChange}
                onStatusChange={p.handleStatusChange}
                onAvatarUpload={p.handleAvatarUpload}
                onRemovePhoto={p.removePhoto}
              />
            )}
            {p.activeTab === 'account' && (
              <AccountSecurityTab
                formData={p.formData}
                onInputChange={p.handleInputChange}
                passwords={p.passwords}
                setPasswords={p.setPasswords}
                showPassword={p.showPassword}
                setShowPassword={p.setShowPassword}
              />
            )}
            {p.activeTab === 'membership' && (
              <MembershipTab
                user={p.user}
                navigate={p.navigate}
                quizOpen={p.quizOpen}
                setQuizOpen={p.setQuizOpen}
                quizScore={p.quizScore}
                quizAnswers={p.quizAnswers}
                setQuizAnswers={p.setQuizAnswers}
                onApplyOrganizer={p.applyOrganizer}
                onSubmitQuiz={p.submitQuiz}
              />
            )}
            {p.activeTab === 'privacy' && (
              <PrivacyTab privacy={p.privacy} setPrivacy={p.setPrivacy} />
            )}
            {p.activeTab === 'appearance' && (
              <AppearanceTab theme={p.theme} setTheme={p.setTheme} />
            )}
            {p.activeTab === 'accessibility' && (
              <AccessibilityTab accessibility={p.accessibility} setAccessibility={p.setAccessibility} />
            )}
            {p.activeTab === 'danger' && (
              <DangerZoneTab
                navigate={p.navigate}
                onShowToast={p.showToast}
                onLogout={p.handleLogout}
              />
            )}
          </div>
        </div>
      </div>

      {p.toastMsg && (
        <div className="toast show" style={{ display: 'flex' }}>
          <span>{p.toastMsg}</span>
        </div>
      )}
    </div>
  );
}
