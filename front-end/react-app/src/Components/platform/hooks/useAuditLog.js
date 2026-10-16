import { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://localhost:3000/api';

/**
 * Custom hook managing the administrative audit log feed with genuine backend persistence.
 */
export default function useAuditLog(adminUsername = 'admin01') {
  const [auditLog, setAuditLog] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function fetchAuditLog() {
      try {
        const res = await fetch(`${API_BASE}/audit-log`, {
          headers: { 'x-role': 'admin' },
        });
        if (!cancelled && res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
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
        await fetch(`${API_BASE}/audit-log`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-role': 'admin',
          },
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
