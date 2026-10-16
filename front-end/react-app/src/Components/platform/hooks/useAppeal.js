import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APPEAL_TYPES } from '../data/appealData';

const API_BASE = 'http://localhost:3000/api';

function getUser() {
  try {
    const raw = JSON.parse(localStorage.getItem('nexus_user') || localStorage.getItem('currentUser') || '{}');
    return { role: raw.role || 'user', firstName: raw.firstName || 'User', username: raw.username || 'user', id: raw.id || 1 };
  } catch { return { role: 'user', firstName: 'User', username: 'user', id: 1 }; }
}

/**
 * Manages all state, validation, and submission logic for the Appeal page.
 */
export default function useAppeal() {
  const navigate = useNavigate();
  const user = getUser();

  const [appealType,  setAppealType]  = useState('');
  const [statement,   setStatement]   = useState('');
  const [commitment,  setCommitment]  = useState('');
  const [errors,      setErrors]      = useState({});
  const [submitted,   setSubmitted]   = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [refId,       setRefId]       = useState('');
  const [myAppeals,   setMyAppeals]   = useState([]);

  useEffect(() => {
    async function fetchAppeals() {
      try {
        const res = await fetch(`${API_BASE}/appeals`, { headers: { 'x-role': user.role } });
        if (res.ok) {
          const d = await res.json();
          if (Array.isArray(d)) {
            setMyAppeals(d.filter(a => !user.id || a.userId === user.id));
          }
        }
      } catch {}
    }
    fetchAppeals();
  }, [user.id, user.role]);

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
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const payload = {
      userId:          Number(user.id || 4),
      actionId:        `ACT-${Date.now()}`,
      text:            statement.trim(),
      acknowledgement: (commitment || 'I agree to the platform community guidelines').slice(0, 95),
      resolution:      (appealType || 'Reconsideration').slice(0, 95),
    };

    try {
      const res  = await fetch(`${API_BASE}/appeals`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'x-role': user.role },
        body:    JSON.stringify(payload),
      });
      const data = res.ok ? await res.json() : {};
      setRefId(`APL-${data.id || Date.now()}`);
    } catch { setRefId(`APL-${Date.now()}`); }

    setSubmitting(false);
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setAppealType('');
    setStatement('');
    setCommitment('');
  };

  return {
    navigate, user,
    // Form state
    appealType, setAppealType,
    statement, setStatement,
    commitment, setCommitment,
    errors,
    // Submission
    submitted, submitting, refId,
    handleSubmit, resetForm,
    // Previous appeals
    myAppeals,
    APPEAL_TYPES,
  };
}
