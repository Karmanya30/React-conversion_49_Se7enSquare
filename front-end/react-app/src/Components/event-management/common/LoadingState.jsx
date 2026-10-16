// Loading state indicator for lists, cards, and data tables.
import React from 'react';

export default function LoadingState({
  message = 'Loading…',
  isTableRow = false,
  colSpan = 6,
  style,
  className = '',
}) {
  if (isTableRow) {
    return (
      <tr>
        <td
          colSpan={colSpan}
          style={{ textAlign: 'center', padding: '24px', color: 'var(--text-3, #9ca3af)', ...style }}
        >
          {message}
        </td>
      </tr>
    );
  }

  return (
    <div
      className={className || 'approval-empty'}
      style={{
        gridColumn: '1/-1',
        textAlign: 'center',
        padding: '40px',
        color: 'var(--text-3, #9ca3af)',
        ...style,
      }}
    >
      {message}
    </div>
  );
}
