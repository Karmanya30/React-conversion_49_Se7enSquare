import React from 'react';

/**
 * Banner image preview and file upload button.
 * Preserves separate backgroundColor and backgroundImage to avoid shorthand override.
 */
export default function BannerUpload({ banner, onUpload }) {
  return (
    <div className="banner-upload">
      <div
        className="current-banner"
        style={{
          backgroundImage: banner ? `url(${banner})` : 'none',
          backgroundColor: banner ? 'transparent' : 'rgba(255,255,255,0.05)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          color: '#aaa',
        }}
      >
        {!banner && 'No Banner Uploaded'}
      </div>
      <label
        className="btn btn-muted"
        style={{ cursor: 'pointer', marginTop: '8px', display: 'inline-block' }}
      >
        Upload Banner
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.webp"
          hidden
          onChange={onUpload}
        />
      </label>
    </div>
  );
}
