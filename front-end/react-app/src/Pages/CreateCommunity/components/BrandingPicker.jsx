import React from 'react';
import { ICONS, BANNERS } from '../../../Components/platform/data/createCommunityOptions';

/**
 * Step 2: Icon emoji selector, banner gradient picker, tags and website inputs.
 */
export default function BrandingPicker({
  icon, banner, tags, website,
  onIconChange, onBannerChange, onTagsChange, onWebsiteChange,
}) {
  return (
    <div>
      <div className="section-title">Appearance</div>
      <div className="section-sub">Make your community visually recognisable.</div>

      <div className="fg">
        <div className="f-label">Community Icon</div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div
            style={{
              fontSize: '36px', width: '64px', height: '64px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)', borderRadius: '16px',
            }}
          >
            {icon}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {ICONS.map((ico) => (
              <div
                key={ico}
                className={`cat-item ${icon === ico ? 'on' : ''}`}
                onClick={() => onIconChange(ico)}
                style={{ cursor: 'pointer', padding: '10px 14px', fontSize: '20px' }}
              >
                {ico}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fg">
        <div className="f-label">Banner Style</div>
        <div className="banner-picker" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {BANNERS.map((b, i) => (
            <div
              key={i}
              className={`bp-item ${banner === b ? 'on' : ''}`}
              onClick={() => onBannerChange(b)}
              style={{
                background: b, width: '80px', height: '40px',
                borderRadius: '8px', cursor: 'pointer',
                border: banner === b ? '2px solid #fff' : '2px solid transparent',
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="fg-row">
        <div>
          <div className="f-label">Community Tags</div>
          <input
            className="f-in"
            value={tags}
            onChange={(e) => onTagsChange(e.target.value)}
            placeholder="e.g. FPS, streaming, competitive"
          />
        </div>
        <div>
          <div className="f-label">Website (optional)</div>
          <input
            className="f-in"
            value={website}
            onChange={(e) => onWebsiteChange(e.target.value)}
            placeholder="https://yoursite.com"
          />
        </div>
      </div>
    </div>
  );
}
