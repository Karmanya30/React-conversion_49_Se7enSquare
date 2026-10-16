// Empty state presentation component for empty lists and missing parameters.
import React from 'react';

export default function EmptyState({
  icon = '📋',
  title = 'No items found',
  subtitle,
  actionText,
  onAction,
  style,
  className = '',
}) {
  return (
    <div
      className={`empty-state ${className}`.trim()}
      style={style}
    >
      {icon && <div className="empty-state-icon" style={{ fontSize: '40px', marginBottom: '10px' }}>{icon}</div>}
      {title && <div className="empty-state-text" style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px' }}>{title}</div>}
      {subtitle && <div className="empty-state-sub" style={{ color: 'var(--text-3, #9ca3af)', fontSize: '13px', marginBottom: actionText ? '15px' : '0' }}>{subtitle}</div>}
      {actionText && onAction && (
        <button
          className="btn-create"
          style={{ marginTop: '12px' }}
          onClick={onAction}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
