import React from 'react';
import { SORT_LABELS } from '../../../Components/platform/data/discoveryData';

/**
 * Category filter pills + sort dropdown for the Discovery page.
 */
export default function CategoryFilterBar({
  categories, activeCategory, onCategoryChange,
  sortBy, onSortChange,
  showSort, onToggleSort,
}) {
  return (
    <div className="filter-bar" id="filterBar">
      {categories.map(cat => (
        <div
          key={cat}
          className={`chip${activeCategory === cat ? ' active' : ''}`}
          onClick={() => onCategoryChange(cat)}
        >
          {cat === 'All' && <span className="chip-icon">✦</span>} {cat}
        </div>
      ))}
      <div className="sort-container" style={{ marginLeft: 'auto' }}>
        <div
          className="sort-btn"
          id="sortBtn"
          onClick={onToggleSort}
        >
          ⇅ Sort: {SORT_LABELS[sortBy]}
        </div>
        {showSort && (
          <div className="sort-dropdown" id="sortDropdown" style={{ display: 'block' }}>
            {Object.entries(SORT_LABELS).map(([key, label]) => (
              <div
                key={key}
                className="sort-option"
                onClick={() => onSortChange(key)}
              >
                {key === 'active' ? '🔥' : key === 'members' ? '👥' : key === 'trending' ? '📈' : '✨'} {label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
