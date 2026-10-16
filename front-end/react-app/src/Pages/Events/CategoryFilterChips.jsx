// Interactive category filter chips for upcoming events.
import React from 'react';

export default function CategoryFilterChips({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
}) {
  return (
    <div className="filters-row">
      <div
        className={`filter-chip${selectedCategory === 'all' ? ' on' : ''}`}
        onClick={() => onSelectCategory('all')}
      >
        ✦ All Events
      </div>
      {categories.map((cat) => (
        <div
          key={cat}
          className={`filter-chip${selectedCategory === cat ? ' on' : ''}`}
          onClick={() => onSelectCategory(cat)}
        >
          {cat}
        </div>
      ))}
    </div>
  );
}
