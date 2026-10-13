import React from 'react';

/**
 * Save & Discard action bar, displayed only when changes are unsaved (isDirty).
 */
export default function SaveBar({ isDirty, onDiscard, onSave }) {
  return (
    <div
      className={`settings-actions ${isDirty ? 'show' : ''}`}
      style={{ display: isDirty ? 'flex' : 'none', gap: '12px', marginTop: '24px' }}
    >
      <button className="btn btn-muted" onClick={onDiscard}>
        Discard Changes
      </button>
      <button className="save-btn btn btn-primary" onClick={onSave}>
        Save Changes
      </button>
    </div>
  );
}
