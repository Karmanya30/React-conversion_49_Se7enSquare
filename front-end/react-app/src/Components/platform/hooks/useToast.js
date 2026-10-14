import { useState, useCallback } from 'react';

/**
 * Custom hook to control toast notification display with auto-dismiss.
 */
export default function useToast() {
  const [toast, setToast] = useState({ show: false, icon: '✅', msg: '' });

  const showToast = useCallback((icon, msg) => {
    setToast({ show: true, icon, msg });
    setTimeout(() => {
      setToast({ show: false, icon: '✅', msg: '' });
    }, 2800);
  }, []);

  return { toast, showToast };
}
