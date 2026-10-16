import React from 'react';
import { CATEGORIES } from '../../../Components/platform/data/createCommunityOptions';

/**
 * Step 1: Community name, description, slug/handle, and category picker.
 * All validation limits mirror the backend CreateCommunityDto.
 */
export default function BasicInfoFields({
  name, desc, slug, category,
  onNameChange, onDescChange, onSlugChange, onCategoryChange,
}) {
  return (
    <div>
      <div className="section-title">Basic Information</div>
      <div className="section-sub">Tell people what your community is about.</div>

      <div className="fg">
        <div className="f-label">
          Community Name <span className="f-req">*</span>
        </div>
        <input
          className="f-in"
          value={name}
          maxLength={50}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Pro Gamers, Indie Games…"
        />
        <div className="char-count">
          <span>{name.length}</span>/50
        </div>
      </div>

      <div className="fg">
        <div className="f-label">
          Description <span className="f-req">*</span>
        </div>
        <textarea
          className="f-ta"
          value={desc}
          maxLength={200}
          onChange={(e) => onDescChange(e.target.value)}
          placeholder="What will people talk about here? What makes this community unique?"
        ></textarea>
        <div className="char-count">
          <span>{desc.length}</span>/200
        </div>
      </div>

      <div className="fg-row">
        <div>
          <div className="f-label">Community URL</div>
          <input
            className="f-in"
            value={slug}
            maxLength={60}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="pro-gamers"
          />
          <div className="f-desc">
            gameunity.io/c/<span>{slug || 'your-community'}</span>
          </div>
        </div>
      </div>

      <div className="fg">
        <div className="f-label">
          Category <span className="f-req">*</span>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map((cat) => (
            <div
              key={cat}
              className={`cat-item ${category === cat ? 'on' : ''}`}
              onClick={() => onCategoryChange(cat)}
              style={{ cursor: 'pointer' }}
            >
              <div className="cat-lbl">{cat}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
