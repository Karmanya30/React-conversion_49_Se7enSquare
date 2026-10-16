import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { APPEAL_TYPES } from '../data/appealData';
import { appealService } from '../../../services/appealService';
import { authService } from '../../../services/authService';

/**
 * Manages all state, validation, and submission logic for the Appeal page.
 */
export default function useAppeal() {
  const navigate = useNavigate();
  const rawUser = authService.getCurrentUser();
  const user = {
    role: rawUser?.role || 'user',
    firstName: rawUser?.firstName || 'User',
    username: rawUser?.username || 'user',
    id: rawUser?.id || 4,
  };

  const [appealType, setAppealType] = useState('');
  const [statement, setStatement] = useState('');
  const [commitment, setCommitment] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refId, setRefId] = useState('');
  const [myAppeals, setMyAppeals] = useState([]);
  const [loadingAppeals, setLoadingAppeals] = useState(false);

  const fetchAppeals = useCallback(async () => {
    setLoadingAppeals(true);
    try {
      const data = await appealService.getAppeals(user.id);
      if (Array.isArray(data)) {
        setMyAppeals(data.filter((a) => !user.id || a.userId === user.id));
      }
    } catch (err) {
      console.warn('Could not fetch appeals:', err);
    } finally {
      setLoadingAppeals(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchAppeals();
  }, [fetchAppeals]);

  const validate = () => {
    const errs = {};
    if (!appealType) errs.type = 'Please select an appeal type.';
    if (!statement.trim() || statement.trim().length < 20) {
      errs.statement = 'Your statement must be at least 20 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const payload = {
      userId: Number(user.id || 4),
      actionId: `ACT-${Date.now()}`,
      text: statement.trim(),
      acknowledgement: (commitment || 'I agree to the platform community guidelines').slice(0, 95),
      resolution: (appealType || 'Reconsideration').slice(0, 95),
      evidence: [],
    };

    try {
      const data = await appealService.createAppeal(payload);
      setRefId(`APL-${data.id || Date.now()}`);
      // Refresh appeals list
      fetchAppeals();
    } catch (err) {
      console.warn('Appeal creation fallback:', err);
      setRefId(`APL-${Date.now()}`);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setAppealType('');
    setStatement('');
    setCommitment('');
    setErrors({});
  };

  return {
    navigate,
    user,
    // Form state
    appealType,
    setAppealType,
    statement,
    setStatement,
    commitment,
    setCommitment,
    errors,
    // Submission
    submitted,
    submitting,
    refId,
    handleSubmit,
    resetForm,
    // Previous appeals
    myAppeals,
    loadingAppeals,
    APPEAL_TYPES,
  };
}
