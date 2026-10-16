import { useState, useEffect } from 'react';
import { DEFAULT_CONFIG, DEFAULT_POLICIES } from '../data/adminData';

const API_BASE = 'http://localhost:3000/api';

/**
 * Custom hook managing platform configuration, toggles, limits, and keyword policies with backend sync.
 */
export default function useAdminConfig(showToast, addAuditLog) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [policies, setPolicies] = useState(DEFAULT_POLICIES);
  const [newPolicyText, setNewPolicyText] = useState('');

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch(`${API_BASE}/platform-config`, {
          headers: { 'x-role': 'admin' },
        });
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'object') {
            setConfig((prev) => ({ ...prev, ...data }));
          }
        }
      } catch {}
    }
    loadConfig();
  }, []);

  const updateConfigField = async (field, value, toastMessage) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    addAuditLog(`Updated config: ${field} = ${value}`, 'config');
    if (toastMessage) showToast(toastMessage);

    try {
      await fetch(`${API_BASE}/platform-config`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-role': 'admin',
        },
        body: JSON.stringify({ [field]: value }),
      });
    } catch {}
  };

  const handleAddPolicy = (e) => {
    e.preventDefault();
    if (!newPolicyText.trim()) return;
    setPolicies((prev) => [...prev, newPolicyText.trim()]);
    addAuditLog(`Added platform policy: "${newPolicyText.trim()}"`, 'policy');
    setNewPolicyText('');
    showToast('Policy added');
  };

  const handleDeletePolicy = (index) => {
    const deleted = policies[index];
    setPolicies((prev) => prev.filter((_, i) => i !== index));
    addAuditLog(`Removed platform policy: "${deleted}"`, 'policy');
    showToast('Policy removed');
  };

  return {
    config,
    setConfig,
    policies,
    setPolicies,
    newPolicyText,
    setNewPolicyText,
    updateConfigField,
    handleAddPolicy,
    handleDeletePolicy,
  };
}
