// Reusable toast notification alert popup.
import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast show" style={{ display: 'flex' }}>
      <span>{message}</span>
    </div>
  );
}
