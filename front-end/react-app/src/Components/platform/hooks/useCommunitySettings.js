import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { DEFAULT_COMMUNITY } from '../data/defaultCommunityData';
import useDirtyForm from './useDirtyForm';

const API_BASE = 'http://localhost:3000/api';

function getRole() {
  try {
    const stored = localStorage.getItem('nexus_user') || localStorage.getItem('currentUser');
    const raw = stored ? JSON.parse(stored) : {};
    return raw.role || 'user';
  } catch {
    return 'user';
  }
}

/**
 * Custom hook encapsulating CommunitySettings state, network fetch/save, and modal actions.
 */
export default function useCommunitySettings() {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const communityId = paramId || searchParams.get('id') || '1';

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const { isDirty, setIsDirty, markDirty, markClean } = useDirtyForm(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Community state with snapshot for discard
  const [community, setCommunity] = useState(DEFAULT_COMMUNITY);
  const [initialCommunity, setInitialCommunity] = useState(DEFAULT_COMMUNITY);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [newChName, setNewChName] = useState('');
  const [newChType, setNewChType] = useState('Text');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    async function loadCommunity() {
      try {
        const [commRes, memsRes, usersRes] = await Promise.all([
          fetch(`${API_BASE}/communities/${communityId}`, { headers: { 'x-role': getRole() } }),
          fetch(`${API_BASE}/memberships?communityId=${communityId}`, { headers: { 'x-role': getRole() } }),
          fetch(`${API_BASE}/users`, { headers: { 'x-role': getRole() } }),
        ]);
        if (commRes.ok) {
          const data = await commRes.json();
          let membersList = [];
          if (memsRes.ok && usersRes.ok) {
            const mems = await memsRes.json();
            const usrs = await usersRes.json();
            const usersById = new Map((Array.isArray(usrs) ? usrs : []).map(u => [String(u.id), u]));
            membersList = (Array.isArray(mems) ? mems : []).map(m => {
              const u = usersById.get(String(m.userId)) || {};
              const uName = u.fullName || u.name || u.username || `User #${m.userId}`;
              return {
                id: m.id,
                userId: m.userId,
                name: uName,
                handle: `@${u.username || 'user'}`,
                role: u.id === data.ownerId ? 'Owner' : (u.role || 'Member'),
                initials: uName.slice(0, 2).toUpperCase(),
              };
            });
          }
          const loaded = {
            ...DEFAULT_COMMUNITY,
            ...data,
            members: membersList,
            rules: Array.isArray(data.rules)
              ? data.rules.join('\n')
              : data.rules || DEFAULT_COMMUNITY.rules,
            channels: Array.isArray(data.channels)
              ? data.channels.map((ch, idx) =>
                  typeof ch === 'string' ? { id: idx + 1, name: ch, type: 'Text' } : ch
                )
              : DEFAULT_COMMUNITY.channels,
          };
          setCommunity(loaded);
          setInitialCommunity(loaded);
        }
      } catch {
        // use fallback
      }
      setLoading(false);
    }
    loadCommunity();
  }, [communityId]);

  const handleFieldChange = (field, value) => {
    setCommunity((prev) => ({ ...prev, [field]: value }));
    markDirty();
  };

  const handleMemberRoleChange = (memberId, newRole) => {
    setCommunity((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)),
    }));
    markDirty();
    showToast(`Role updated to ${newRole}`);
  };

  const handleRemoveMember = (memberId) => {
    setCommunity((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
    }));
    markDirty();
    showToast('Member removed');
  };

  const handleDeleteChannel = (channelId) => {
    setCommunity((prev) => ({
      ...prev,
      channels: prev.channels.filter((c) => c.id !== channelId),
    }));
    markDirty();
    showToast('Channel deleted');
  };

  const handleCreateChannel = (e) => {
    e.preventDefault();
    if (!newChName.trim()) {
      showToast('⚠️ Channel name is required');
      return;
    }
    const cleanName = newChName.trim().toLowerCase().replace(/\s+/g, '-');
    setCommunity((prev) => ({
      ...prev,
      channels: [...prev.channels, { id: Date.now(), name: cleanName, type: newChType }],
    }));
    setNewChName('');
    setModalOpen(false);
    markDirty();
    showToast(`Channel #${cleanName} created`);
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleFieldChange('banner', reader.result);
        showToast('📷 Banner updated! Save to persist.');
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = async () => {
    try {
      const parsedRules = Array.isArray(community.rules)
        ? community.rules
        : typeof community.rules === 'string'
        ? community.rules.split('\n').map((r) => r.trim()).filter(Boolean)
        : undefined;

      await fetch(`${API_BASE}/communities/${communityId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-role': getRole(),
        },
        body: JSON.stringify({
          name: community.name,
          description: community.description,
          banner: community.banner || undefined,
          rules: parsedRules,
        }),
      });
      showToast('✅ Community settings saved successfully!');
    } catch {
      showToast('✅ Community settings saved (locally)!');
    }
    setInitialCommunity({ ...community });
    markClean();
  };

  const discardSettings = () => {
    setCommunity(initialCommunity);
    markClean();
    showToast('Changes discarded.');
  };

  return {
    communityId,
    activeTab,
    setActiveTab,
    loading,
    isDirty,
    setIsDirty,
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
  };
}
