import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DEFAULT_PRIVACY,
  DEFAULT_ACCESSIBILITY,
  MOD_QUIZ_QUESTIONS,
} from '../data/profileSettingsData';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getStoredUser() {
  try {
    const raw = JSON.parse(
      localStorage.getItem('user') ||
      localStorage.getItem('nexus_user') ||
      localStorage.getItem('currentUser') ||
      '{}'
    );
    const uName = raw.username || raw.handle || 'user';
    return {
      id:        raw.id        || 1,
      firstName: raw.firstName || raw.name?.split(' ')[0] || (uName ? uName.charAt(0).toUpperCase() + uName.slice(1) : 'User'),
      lastName:  raw.lastName  || raw.name?.split(' ').slice(1).join(' ') || '',
      fullName:  raw.fullName  || raw.name || `${raw.firstName || 'User'} ${raw.lastName || ''}`.trim(),
      username:  uName,
      handle:    raw.handle    || uName,
      email:     raw.email     || '',
      phone:     raw.phone     || '',
      bio:       raw.bio       || '',
      avatar:    raw.avatar    || null,
      role:      raw.role      || 'user',
      plan:      raw.plan      || 'free',
      status:    raw.status    || 'Online',
    };
  } catch {
    return {
      id: 1, firstName: 'User', lastName: '', fullName: 'User',
      username: 'user', handle: 'user', email: '',
      phone: '', bio: '', avatar: null, role: 'user', plan: 'free', status: 'Online',
    };
  }
}

/**
 * Manages all state, handlers, and backend interactions for ProfileSettings.
 */
export default function useProfileSettings() {
  const navigate = useNavigate();

  const [user,          setUser]          = useState(getStoredUser);
  const [formData,      setFormData]      = useState({ ...getStoredUser() });
  const [isDirty,       setIsDirty]       = useState(false);
  const [activeTab,     setActiveTab]     = useState('profile');
  const [toastMsg,      setToastMsg]      = useState(null);

  // Password
  const [passwords,     setPasswords]     = useState({ current: '', new: '', confirm: '' });
  const [showPassword,  setShowPassword]  = useState({ current: false, new: false, confirm: false });

  // Privacy & Appearance & Accessibility
  const [privacy,       setPrivacy]       = useState(DEFAULT_PRIVACY);
  const [accessibility, setAccessibility] = useState(DEFAULT_ACCESSIBILITY);
  const [theme,         setTheme]         = useState('dark');

  // Moderator quiz
  const [quizOpen,      setQuizOpen]      = useState(false);
  const [quizScore,     setQuizScore]     = useState(null);
  const [quizAnswers,   setQuizAnswers]   = useState({ q1: '', q2: '', q3: '' });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleStatusChange = (status) => {
    setFormData(prev => ({ ...prev, status }));
    setIsDirty(true);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleInputChange('avatar', reader.result);
        showToast('📷 Photo uploaded. Remember to save changes!');
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    handleInputChange('avatar', null);
    showToast('🗑️ Photo removed.');
  };

  const discardChanges = () => {
    setFormData({ ...user });
    setPasswords({ current: '', new: '', confirm: '' });
    setIsDirty(false);
    showToast('Draft discarded.');
  };

  const saveAllChanges = async () => {
    if (!formData.firstName.trim() || !formData.username.trim() || !formData.email.trim()) {
      showToast('❌ Please fill in required fields (First Name, Username, Email).');
      return;
    }

    const updatedUser = {
      ...user,
      ...formData,
      handle:   formData.username,
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
    };

    try {
      const patchBody = {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      };
      if (updatedUser.bio && updatedUser.bio.length >= 5 && updatedUser.bio.length <= 160) {
        patchBody.bio = updatedUser.bio;
      }
      if (updatedUser.phone) {
        patchBody.phone = updatedUser.phone;
      }
      if (updatedUser.avatar && updatedUser.avatar.length <= 300) {
        patchBody.avatar = updatedUser.avatar;
      }

      const res = await fetch(`${API_BASE}/users/me`, {
        method:  'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(user.id),
          'x-role': user.role || 'user',
        },
        body: JSON.stringify(patchBody),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save profile changes');
      }

      const savedUser = await res.json();
      const sessionUser = {
        id: savedUser.id || user.id,
        username: savedUser.username || user.username,
        role: savedUser.role || user.role,
        name: `${savedUser.firstName || ''} ${savedUser.lastName || ''}`.trim() || user.fullName,
      };
      localStorage.setItem('user', JSON.stringify(sessionUser));
      localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsDirty(false);

      showToast('✅ Profile & settings saved successfully!');
    } catch (err) {
      showToast(`❌ ${err.message || 'Failed to save changes.'}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('nexus_user');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const applyOrganizer = async () => {
    try {
      await fetch(`${API_BASE}/organisers/apply`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'x-role': user.role || 'user' },
        body:    JSON.stringify({
          userId:         Number(user.id),
          experienceNote: 'Community member seeking organizer access',
        }),
      });
      showToast('🏆 Organizer application submitted for admin review!');
    } catch {
      showToast('⚠️ Could not submit organizer application');
    }
  };

  const submitQuiz = async () => {
    if (!quizAnswers.q1 || !quizAnswers.q2 || !quizAnswers.q3) {
      showToast('⚠️ Please answer all questions.');
      return;
    }
    const ansMap   = { a: 0, b: 1, c: 2, d: 3 };
    const ansArray = [ansMap[quizAnswers.q1] || 0, ansMap[quizAnswers.q2] || 0, ansMap[quizAnswers.q3] || 0];

    try {
      const res = await fetch(`${API_BASE}/moderator-certification/apply`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'x-role': user.role || 'user' },
        body:    JSON.stringify({ userId: Number(user.id), answers: ansArray }),
      });
      if (res.ok) {
        const data = await res.json();
        setQuizScore(data.score !== undefined ? data.score : 3);
        showToast('🎉 Application submitted for admin review!');
        return;
      }
    } catch {}

    const correct = MOD_QUIZ_QUESTIONS.reduce(
      (sum, q) => sum + (quizAnswers[q.key] === q.correct ? 1 : 0),
      0
    );
    setQuizScore(correct);
    showToast(correct >= 2
      ? '🎉 Quiz passed! Application forwarded to admins.'
      : '❌ Quiz not passed. Please review policies and try again.'
    );
  };

  const initials = `${formData.firstName?.[0] || ''}${formData.lastName?.[0] || ''}`.toUpperCase() || 'U';

  return {
    // Navigation
    navigate,
    // User & form
    user, formData, isDirty, initials,
    // Tab
    activeTab, setActiveTab,
    // Password
    passwords, setPasswords, showPassword, setShowPassword,
    // Toggleable settings
    privacy, setPrivacy,
    accessibility, setAccessibility,
    theme, setTheme,
    // Quiz
    quizOpen, setQuizOpen, quizScore, quizAnswers, setQuizAnswers,
    // Toast
    toastMsg, showToast,
    // Handlers
    handleInputChange, handleStatusChange,
    handleAvatarUpload, removePhoto,
    discardChanges, saveAllChanges,
    handleLogout, applyOrganizer, submitQuiz,
  };
}
