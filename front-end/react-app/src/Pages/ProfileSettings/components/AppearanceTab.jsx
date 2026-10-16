import React from 'react';

/** "Appearance" tab — theme selector swatches. */
export default function AppearanceTab({ theme, setTheme }) {
  const THEMES = [
    { id: 'dark',  label: 'Dark (Default)',  bg: 'var(--bg-deep)' },
    { id: 'green', label: 'Midnight Green',  bg: '#064e3b' },
  ];

  return (
    <div className="view active">
      <div className="settings-card">
        <div className="card-title">🎨 Theme</div>
        <div className="card-sub">Choose your Gameunity colour theme.</div>
        <div className="theme-grid">
          {THEMES.map(t => (
            <div
              key={t.id}
              className={`theme-opt ${theme === t.id ? 'on' : ''}`}
              onClick={() => setTheme(t.id)}
            >
              <div className="theme-swatch" style={{ background: t.bg }}></div>
              <div className="theme-label">{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
