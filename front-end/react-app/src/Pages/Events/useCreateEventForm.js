// Custom hook for managing the event creation form, validations, drafts, and image upload.
import { useState, useRef } from 'react';
import { DEFAULT_COMMUNITIES } from '../../Components/event-management/utils/constants';
import { getCommunityObject } from '../../Components/event-management/utils/getCommunityName';

export function useCreateEventForm({ submitEvent, showToast, saveDraft, loadDraft, onSuccess }) {
  const fileInputRef = useRef(null);
  const [eventType, setEventType] = useState('Online');
  const [coverPreview, setCoverPreview] = useState(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    community: '',
    capacity: 50,
    category: 'Tournament',
  });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setCoverPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDraft = () => {
    saveDraft({ form, eventType, coverPreview });
    setDraftSaved(true);
    showToast('Draft saved!');
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const handleLoadDraft = () => {
    const draft = loadDraft();
    if (draft) {
      if (draft.form) setForm(draft.form);
      if (draft.eventType) setEventType(draft.eventType);
      if (draft.coverPreview) setCoverPreview(draft.coverPreview);
      showToast('Draft loaded!');
    } else {
      showToast('No saved draft found.');
    }
  };

  const handleSubmitEvent = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const errors = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.description.trim()) errors.description = 'Description is required';
    if (!form.date) errors.date = 'Date is required';
    if (!form.time) errors.time = 'Time is required';
    if (!form.community) errors.community = 'Select a community';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const comm = getCommunityObject(form.community, DEFAULT_COMMUNITIES);
    const res = await submitEvent({
      title: form.title,
      description: form.description,
      date: form.date,
      time: form.time,
      type: eventType,
      category: form.category,
      communityId: Number(form.community) || 1,
      community: comm.name,
      capacity: form.capacity,
      maxAttendees: form.capacity,
      coverImage: coverPreview || '',
    });

    showToast(res.isLocal ? 'Event submitted (offline).' : 'Event submitted for approval!');
    setForm({ title: '', description: '', date: '', time: '', community: '', capacity: 50, category: 'Tournament' });
    setCoverPreview(null);
    if (onSuccess) onSuccess();
  };

  return {
    form,
    setForm,
    formErrors,
    eventType,
    setEventType,
    coverPreview,
    fileInputRef,
    draftSaved,
    handleImageUpload,
    handleSaveDraft,
    handleLoadDraft,
    handleSubmitEvent,
  };
}
