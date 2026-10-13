import React from 'react';
import useCommunitySettings from '../Components/platform/hooks/useCommunitySettings';
import Toast from '../Components/platform/common/Toast';
import CommunityHeader from './CommunitySettings/components/CommunityHeader';
import SettingsNav from './CommunitySettings/components/SettingsNav';
import BasicInfoTab from './CommunitySettings/components/BasicInfoTab';
import MembersTab from './CommunitySettings/components/MembersTab';
import ChannelsTab from './CommunitySettings/components/ChannelsTab';
import RulesTab from './CommunitySettings/components/RulesTab';
import InsightsTab from './CommunitySettings/components/InsightsTab';
import SaveBar from './CommunitySettings/components/SaveBar';
import CreateChannelModal from './CommunitySettings/components/CreateChannelModal';
import '../styles/global.css';
import '../styles/community-settings.css';

/**
 * Community Settings Page Component
 * Modular page managing community configuration, membership roles, channels,
 * rules, and insights, maintaining a clean .cs-page root container.
 */
export default function CommunitySettings() {
  const {
    communityId,
    activeTab,
    setActiveTab,
    loading,
    isDirty,
    community,
    modalOpen,
    setModalOpen,
    newChName,
    setNewChName,
    newChType,
    setNewChType,
    toastMsg,
    handleFieldChange,
    handleMemberRoleChange,
    handleRemoveMember,
    handleDeleteChannel,
    handleCreateChannel,
    handleBannerUpload,
    saveSettings,
    discardSettings,
  } = useCommunitySettings();

  return (
    <div className="cs-page">
      {/* Topbar */}
      <CommunityHeader
        community={community}
        communityId={communityId}
        onAddChannel={() => {
          setActiveTab('channels');
          setModalOpen(true);
        }}
      />

      {/* Main Container */}
      <div className="main-container">
        {/* Sidebar Navigation */}
        <SettingsNav activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Content Area */}
        <main className="content" id="view-settings">
          <div className="content-inner">
            <div className="page-heading">
              <p className="eyebrow">Settings</p>
              <h1>Community Settings</h1>
              {loading && (
                <p style={{ fontSize: '12px', color: 'var(--text-3)' }}>
                  Loading latest community details…
                </p>
              )}
            </div>

            {/* Active Tab Views */}
            {activeTab === 'basic' && (
              <BasicInfoTab
                community={community}
                onFieldChange={handleFieldChange}
                onBannerUpload={handleBannerUpload}
              />
            )}

            {activeTab === 'members' && (
              <MembersTab
                members={community.members}
                onRoleChange={handleMemberRoleChange}
                onRemoveMember={handleRemoveMember}
              />
            )}

            {activeTab === 'channels' && (
              <ChannelsTab
                channels={community.channels}
                onDeleteChannel={handleDeleteChannel}
                onOpenModal={() => setModalOpen(true)}
              />
            )}

            {activeTab === 'rules' && (
              <RulesTab
                rules={community.rules}
                onRulesChange={(val) => handleFieldChange('rules', val)}
              />
            )}

            {activeTab === 'insights' && <InsightsTab community={community} />}

            {/* Save & Discard Actions */}
            <SaveBar
              isDirty={isDirty}
              onDiscard={discardSettings}
              onSave={saveSettings}
            />
          </div>
        </main>
      </div>

      {/* Create Channel Modal */}
      <CreateChannelModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        channelName={newChName}
        setChannelName={setNewChName}
        channelType={newChType}
        setChannelType={setNewChType}
        onCreateChannel={handleCreateChannel}
      />

      {/* Toast Notification */}
      <Toast toast={{ show: !!toastMsg, msg: toastMsg }} />
    </div>
  );
}
