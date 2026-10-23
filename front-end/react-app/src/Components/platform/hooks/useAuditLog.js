import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../../../services/api';

/**
 * Custom hook managing the administrative audit log feed with genuine backend persistence.
 */
export default function useAuditLog(adminUsername = 'admin01') {
  const [auditLog, setAuditLog] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function fetchAuditLog() {
      try {
        const data = await apiRequest('/audit-log');
        if (!cancelled && Array.isArray(data)) {
          setAuditLog(
            data.map((l) => ({
              id: l.id,
              time: l.createdAt
                ? new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Just now',
              admin: l.actor || adminUsername,
              action: l.action,
              type: l.target || 'general',
            }))
          );
        }
      } catch {}
    }
    fetchAuditLog();
    return () => { cancelled = true; };
  }, [adminUsername]);

  const addAuditLog = useCallback(
    async (action, type = 'general') => {
      const newEntry = {
        id: Date.now(),
        time: 'Just now',
        admin: adminUsername,
        action,
        type,
      };
      setAuditLog((prev) => [newEntry, ...prev]);

      try {
        await apiRequest('/audit-log', {
          method: 'POST',
          body: JSON.stringify({
            action: action.slice(0, 95),
            actor: adminUsername,
            target: type.slice(0, 95),
            reason: 'Administrative activity',
          }),
        });
      } catch {}
    },
    [adminUsername]
  );

  return { auditLog, setAuditLog, addAuditLog };
}
