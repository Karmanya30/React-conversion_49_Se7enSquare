// Custom hook to manage user event registrations, confirmation tickets, and cancellations.
import { useState, useEffect, useCallback } from 'react';
import { eventService } from '../services/eventService';
import { getCurrentUser } from '../utils/constants';

export function useRegistrations() {
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    const user = getCurrentUser();
    if (!user || !user.id) {
      setMyRegistrations([]);
      setLoading(false);
      return;
    }
    try {
      const data = await eventService.getRegistrations(user.id);
      setMyRegistrations(Array.isArray(data) ? data : []);
    } catch {
      setMyRegistrations([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  const isRegistered = useCallback((eventId) => {
    return myRegistrations.some(
      (r) => Number(r.eventId) === Number(eventId) || String(r.eventId) === String(eventId)
    );
  }, [myRegistrations]);

  const registerForEvent = useCallback(async (event, formData) => {
    const user = getCurrentUser();
    if (!user || !user.id) {
      return { success: false, error: 'Please log in to register' };
    }

    const payload = {
      eventId: Number(event.id),
      userId: Number(user.id),
      fullName: formData.fullName?.trim() || user.name || user.username,
      contactEmail: (formData.email || formData.contactEmail || user.email || '').trim(),
      phone: (formData.phone || '').trim(),
      inGameId: (formData.inGameId || '').trim(),
    };

    try {
      const created = await eventService.registerForEvent(payload);
      setMyRegistrations((prev) => [
        ...prev,
        { ...created, eventTitle: event.title },
      ]);
      return { success: true, registration: created };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Could not register. Please try again.',
      };
    }
  }, []);

  const cancelRegistration = useCallback(async (reg) => {
    const regId = reg.id || reg.registrationId;

    try {
      if (regId) {
        await eventService.cancelRegistration(regId);
      }
    } catch {
      // ignore
    }

    setMyRegistrations((prev) =>
      prev.filter((r) => {
        const currentId = r.id || r.registrationId;
        return (
          Number(currentId) !== Number(regId) &&
          String(currentId) !== String(regId) &&
          Number(r.eventId) !== Number(reg.eventId)
        );
      })
    );

    return { success: true };
  }, []);

  return {
    myRegistrations,
    setMyRegistrations,
    loading,
    loadRegistrations,
    isRegistered,
    registerForEvent,
    cancelRegistration,
  };
}
