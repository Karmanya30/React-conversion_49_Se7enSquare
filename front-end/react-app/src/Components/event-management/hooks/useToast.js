// Custom hook to manage toast notification messages with automatic timeout dismissal.
import { useState, useCallback, useRef, useEffect } from 'react';

export function useToast(defaultDuration = 3000) {
  const [toastMsg, setToastMsg] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((msg, duration = defaultDuration) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToastMsg(msg);
    timerRef.current = setTimeout(() => {
      setToastMsg(null);
      timerRef.current = null;
    }, duration);
  }, [defaultDuration]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { toastMsg, showToast };
}
