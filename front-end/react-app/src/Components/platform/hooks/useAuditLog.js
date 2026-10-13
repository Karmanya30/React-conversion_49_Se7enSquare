import { useState, useCallback } from 'react';
import { DEFAULT_AUDIT_LOG } from '../data/adminData';

/**
 * Custom hook managing the administrative audit log feed.
 */
export default function useAuditLog(adminUsername = 'admin') {
  const [auditLog, setAuditLog] = useState(DEFAULT_AUDIT_LOG);

  const addAuditLog = useCallback((action, type = 'general') => {
    setAuditLog((prev) => [
      { id: Date.now(), time: 'Just now', admin: adminUsername, action, type },
      ...prev,
    ]);
  }, [adminUsername]);

  return { auditLog, setAuditLog, addAuditLog };
}
