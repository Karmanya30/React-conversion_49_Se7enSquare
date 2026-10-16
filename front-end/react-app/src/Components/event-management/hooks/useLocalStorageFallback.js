// Custom hook to synchronize and fallback state to localStorage.
import { useCallback } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

export function useLocalStorageFallback(storageKey = STORAGE_KEYS.EVENTS) {
  const getStoredItems = useCallback(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore JSON parse errors
    }
    return [];
  }, [storageKey]);

  const setStoredItems = useCallback((items) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // ignore storage write errors
    }
  }, [storageKey]);

  const updateStoredItem = useCallback((id, patch) => {
    const items = getStoredItems();
    const updated = items.map((item) =>
      Number(item.id) === Number(id) || String(item.id) === String(id)
        ? { ...item, ...patch }
        : item
    );
    setStoredItems(updated);
    return updated;
  }, [getStoredItems, setStoredItems]);

  const addStoredItem = useCallback((newItem) => {
    const items = getStoredItems();
    const updated = [newItem, ...items];
    setStoredItems(updated);
    return updated;
  }, [getStoredItems, setStoredItems]);

  const removeStoredItem = useCallback((id) => {
    const items = getStoredItems();
    const updated = items.filter(
      (item) => Number(item.id) !== Number(id) && String(item.id) !== String(id)
    );
    setStoredItems(updated);
    return updated;
  }, [getStoredItems, setStoredItems]);

  return {
    getStoredItems,
    setStoredItems,
    updateStoredItem,
    addStoredItem,
    removeStoredItem,
  };
}
