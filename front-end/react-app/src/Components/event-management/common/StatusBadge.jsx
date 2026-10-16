// Unified status badge component for event states and tags.
import React from 'react';

export default function StatusBadge({
  status,
  label,
  variant = 'status-badge', // 'status-badge' | 'badge' | 'ev-badge' | 'reg-status'
  className = '',
  children,
}) {
  const normalizedStatus = (status || '').toLowerCase();
  let baseClass = className;

  if (variant === 'status-badge') {
    baseClass = `status-badge ${normalizedStatus}`;
  } else if (variant === 'badge') {
    baseClass = `badge badge-${normalizedStatus}`;
  } else if (variant === 'reg-status') {
    baseClass = `reg-status status-${normalizedStatus}`;
  } else if (variant === 'ev-badge') {
    baseClass = `ev-badge badge-${normalizedStatus}`;
  }

  const finalClass = `${baseClass} ${className}`.trim();
  const content = children || label || status;

  return <span className={finalClass}>{content}</span>;
}
