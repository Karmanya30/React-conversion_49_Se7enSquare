import React from 'react';
import { PAGES } from '../../../Components/platform/data/adminData';

/**
 * Horizontal navigation tabs bar for switching between 9 admin sections.
 */
export default function AdminNav({ activePage, onSelectPage }) {
  return (
    <nav className="admin-su-nav">
      {PAGES.map((page) => (
        <button
          key={page.id}
          className={`admin-su-nav-btn${activePage === page.id ? ' active' : ''}`}
          onClick={() => onSelectPage(page.id)}
        >
          {page.icon} {page.title}
        </button>
      ))}
    </nav>
  );
}
