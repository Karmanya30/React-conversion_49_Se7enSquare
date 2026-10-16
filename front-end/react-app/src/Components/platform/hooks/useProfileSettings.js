import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, storeUserSession, clearUserSession } from '../../../services/api';
import { DEFAULT_PRIVACY, EMPTY_PASSWORDS, EMPTY_ORGANISER, EMPTY_STATEMENT } from '../data/profileSettingsData';

const fieldsOf = u => Object.fromEntries(['firstName', 'lastName', 'username', 'email', 'phone', 'bio', 'avatar'].map(k => [k, u[k] ?? '']));
const errorMessages = err => Array.isArray(err.data?.message) ? err.data.message : [err.message];

export default function useProfileSettings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(fieldsOf({}));
  const [privacy, setPrivacy] = useState(DEFAULT_PRIVACY);
  const [passwords, setPasswords] = useState(EMPTY_PASSWORDS);
  const [showPassword, setShowPassword] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [plan, setPlan] = useState(null);
  const [organiser, setOrganiser] = useState(null);
  const [moderator, setModerator] = useState(null);
  const [applicationErrors, setApplicationErrors] = useState({});
  const [organiserForm, setOrganiserForm] = useState(EMPTY_ORGANISER);
  const [statement, setStatement] = useState(EMPTY_STATEMENT);
  const [questions, setQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizOpen, setQuizOpen] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const profile = await apiRequest('/users/me');
        if (cancelled) return;
        setUser(profile); setFormData(fieldsOf(profile));
        setPrivacy({ ...DEFAULT_PRIVACY, ...profile.privacy });
        const requests = [];
        if (profile.role !== 'owner') requests.push(['plan', `/subscriptions/status?userId=${profile.id}`, setPlan]);
        if (['user', 'organizer'].includes(profile.role)) requests.push(['organiser', '/organisers/profile', setOrganiser]);
        if (['user', 'organizer', 'community_manager', 'moderator'].includes(profile.role)) requests.push(['moderator', '/moderator-certification/status', setModerator]);
        await Promise.all(requests.map(async ([key, endpoint, setter]) => {
          try { const data = await apiRequest(endpoint); if (!cancelled) setter(data); }
          catch (err) { if (!cancelled) setApplicationErrors(prev => ({ ...prev, [key]: err.message })); }
        }));
      } catch (err) { if (!cancelled) setErrors(errorMessages(err)); }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!avatarFile) { setAvatarPreview(''); return; }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const isDirty = Boolean(user && (avatarFile || JSON.stringify(formData) !== JSON.stringify(fieldsOf(user)) ||
    JSON.stringify(privacy) !== JSON.stringify({ ...DEFAULT_PRIVACY, ...user.privacy }) || Object.values(passwords).some(Boolean)));
  const canDiscard = isDirty || quizOpen || JSON.stringify(organiserForm) !== JSON.stringify(EMPTY_ORGANISER) ||
    JSON.stringify(statement) !== JSON.stringify(EMPTY_STATEMENT) || quizAnswers.some(answer => answer !== undefined);
  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleAvatarUpload = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setErrors(['avatar: select a PNG, JPG, GIF or WEBP image no larger than 5MB']); return;
    }
    setAvatarFile(file); setErrors([]);
  };
  const discardChanges = () => {
    setFormData(fieldsOf(user)); setPrivacy({ ...DEFAULT_PRIVACY, ...user.privacy });
    setPasswords(EMPTY_PASSWORDS); setAvatarFile(null); setErrors([]); setShowPassword({});
    setOrganiserForm(EMPTY_ORGANISER); setStatement(EMPTY_STATEMENT); setQuizAnswers([]); setQuizOpen(false);
    setToastMsg('Draft discarded.');
  };

  const saveAllChanges = async () => {
    if (saving || !user) return;
    const validation = [];
    if (!formData.firstName.trim()) validation.push('firstName: enter your first name');
    if (formData.bio !== (user.bio ?? '') && (formData.bio.length < 5 || formData.bio.length > 160)) validation.push('bio: must contain 5 to 160 characters');
    const changePassword = Object.values(passwords).some(Boolean);
    if (changePassword) {
      if (user.hasPassword && !passwords.current) validation.push('current: enter your current password');
      if (passwords.new.length < 8 || !/[A-Za-z]/.test(passwords.new) || !/\d/.test(passwords.new)) validation.push('new: use at least 8 characters, including a letter and a number');
      if (passwords.new !== passwords.confirm) validation.push('confirm: passwords do not match');
    }
    setErrors(validation);
    if (validation.length) return;
    setSaving(true); setToastMsg('');
    let profileSaved = false;
    try {
      const body = Object.fromEntries(Object.entries(formData).filter(([key, value]) => value !== (user[key] ?? '')));
      body.privacy = privacy;
      if (avatarFile) {
        const upload = new FormData(); upload.append('file', avatarFile);
        const result = await apiRequest('/uploads', { method: 'POST', body: upload });
        body.avatar = result.fileUrl;
      } else if (body.avatar === '') body.avatar = null;
      const saved = await apiRequest('/users/me', { method: 'PATCH', body: JSON.stringify(body) });
      setUser(saved); setFormData(fieldsOf(saved)); setPrivacy({ ...DEFAULT_PRIVACY, ...saved.privacy });
      setAvatarFile(null); storeUserSession(saved); profileSaved = true;
      if (changePassword) {
        const updated = await apiRequest('/auth/change-password', { method: 'POST', body: JSON.stringify(passwords) });
        setUser(prev => ({ ...prev, hasPassword: updated.hasPassword }));
        storeUserSession(updated); setPasswords(EMPTY_PASSWORDS); setShowPassword({});
      }
      setToastMsg('Profile and settings saved.');
    } catch (err) {
      setErrors(errorMessages(err));
      if (profileSaved) setToastMsg('Profile saved. Password was not changed; correct the error and save again.');
    } finally { setSaving(false); }
  };

  const applyOrganizer = async () => {
    if (applying) return;
    setApplying(true); setApplicationErrors(prev => ({ ...prev, organiser: '' }));
    try {
      const data = await apiRequest('/organisers/apply', { method: 'POST', body: JSON.stringify({
        ...organiserForm, expectedTournamentSize: Number(organiserForm.expectedTournamentSize),
        pastEventLinks: organiserForm.pastEventLinks.split('\n').map(s => s.trim()).filter(Boolean),
      }) });
      setOrganiser(data); setOrganiserForm(EMPTY_ORGANISER);
    } catch (err) { setApplicationErrors(prev => ({ ...prev, organiser: errorMessages(err).join('; ') })); }
    finally { setApplying(false); }
  };
  const openQuiz = async () => {
    setApplicationErrors(prev => ({ ...prev, moderator: '' }));
    try { setQuestions(await apiRequest('/moderator-certification/quiz')); setQuizAnswers([]); setQuizOpen(true); }
    catch (err) { setApplicationErrors(prev => ({ ...prev, moderator: err.message })); }
  };
  const submitQuiz = async () => {
    if (applying) return;
    if (questions.some((_, i) => !Number.isInteger(quizAnswers[i]))) {
      setApplicationErrors(prev => ({ ...prev, moderator: 'Answer every question.' })); return;
    }
    setApplying(true); setApplicationErrors(prev => ({ ...prev, moderator: '' }));
    try {
      const data = await apiRequest('/moderator-certification/apply', { method: 'POST', body: JSON.stringify({ answers: quizAnswers,
        statement: { ...statement, weeklyHours: Number(statement.weeklyHours) } }) });
      setModerator(data); setQuizOpen(false); setStatement(EMPTY_STATEMENT); setQuizAnswers([]);
    } catch (err) { setApplicationErrors(prev => ({ ...prev, moderator: errorMessages(err).join('; ') })); }
    finally { setApplying(false); }
  };
  const handleLogout = () => { clearUserSession(); navigate('/login'); };
  const initials = `${formData.firstName?.[0] || ''}${formData.lastName?.[0] || ''}`.toUpperCase() || 'U';
  return { user, formData, privacy, setPrivacy, passwords, setPasswords, showPassword, setShowPassword,
    activeTab, setActiveTab, isDirty, canDiscard, loading, saving, errors, toastMsg, initials, avatarPreview,
    handleInputChange, handleAvatarUpload, removePhoto: () => { setAvatarFile(null); handleInputChange('avatar', ''); },
    discardChanges, saveAllChanges, handleLogout, navigate, showToast: setToastMsg,
    plan, organiser, moderator, applicationErrors, organiserForm, setOrganiserForm, statement, setStatement,
    questions, quizAnswers, setQuizAnswers, quizOpen, openQuiz, applying, applyOrganizer, submitQuiz };
}
