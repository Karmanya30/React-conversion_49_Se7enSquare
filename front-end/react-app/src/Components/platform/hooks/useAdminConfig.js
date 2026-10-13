import { useState } from 'react';
import { DEFAULT_CONFIG, DEFAULT_POLICIES } from '../data/adminData';

/**
 * Custom hook managing platform configuration, toggles, limits, and keyword policies.
 */
export default function useAdminConfig(showToast, addAuditLog) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [policies, setPolicies] = useState(DEFAULT_POLICIES);
  const [newPolicyText, setNewPolicyText] = useState('');

  const updateConfigField = (field, value, toastMessage) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    addAuditLog(`Updated config: ${field} = ${value}`, 'config');
    if (toastMessage) showToast(toastMessage);
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
