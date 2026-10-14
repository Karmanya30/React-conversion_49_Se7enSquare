import React from 'react';
import BannerUpload from './BannerUpload';

/**
 * Tab 1: Community Name, Description, and Banner Upload.
 */
export default function BasicInfoTab({ community, onFieldChange, onBannerUpload }) {
  return (
    <section className="settings-tab section active">
      <div className="settings-card">
        <div className="settings-card-title">Basic Information</div>

        <div className="settings-field">
          <label>Community Name *</label>
          <input
            type="text"
            className="settings-input"
            value={community.name}
            onChange={(e) => onFieldChange('name', e.target.value)}
            required
          />
        </div>

        <div className="settings-field">
          <label>Description</label>
          <textarea
            className="settings-textarea"
            rows="4"
            value={community.description}
            onChange={(e) => onFieldChange('description', e.target.value)}
            required
          ></textarea>
        </div>

        <div className="settings-field">
          <label>Community Banner</label>
          <BannerUpload banner={community.banner} onUpload={onBannerUpload} />
        </div>
      </div>
    </section>
  );
}
