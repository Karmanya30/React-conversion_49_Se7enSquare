import React from 'react';
import { ROLE_OPTIONS } from '../../../Components/platform/data/userData';

/**
 * Search input + role dropdown filter bar for User Management.
 */
export default function UserFilterBar({
  search, onSearchChange,
  roleFilter, onRoleFilterChange,
  filteredCount, totalCount,
}) {
  return (
    <div
      className="page-toolbar"
      style={{
        display: 'flex', gap: '12px', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1, minWidth: '280px' }}>
        <input
          type="text"
          placeholder="🔍 Search by username or email…"
          className="search-input"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          style={{
            flex: 1, maxWidth: '360px', padding: '9px 14px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border, rgba(255,255,255,0.08))',
            borderRadius: '10px', color: '#fff', fontSize: '13px',
          }}
        />
        <select
          value={roleFilter}
          onChange={e => onRoleFilterChange(e.target.value)}
          style={{
            padding: '9px 14px', background: 'var(--bg-card, #111118)',
            border: '1px solid var(--border, rgba(255,255,255,0.08))',
            borderRadius: '10px', color: '#fff', fontSize: '13px', cursor: 'pointer',
          }}
        >
          {ROLE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div style={{ fontSize: '13px', color: 'var(--text-3, #888)' }}>
        Showing {filteredCount} of {totalCount} registered accounts
      </div>
    </div>
  );
}
