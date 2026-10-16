import React from 'react';

/** "Accessibility" tab — font size select and toggle rows for contrast/motion/screen reader/keyboard nav. */
export default function AccessibilityTab({ accessibility, setAccessibility }) {
  const toggle = (key) => setAccessibility(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="view active">
      <div className="settings-card">
        <div className="card-title">♿ Accessibility Preferences</div>
        <div className="card-sub">Adjust settings to make Gameunity easier to use for you.</div>

        <div className="field" style={{ marginBottom: '24px' }}>
          <label>Global Font Size</label>
          <select
            value={accessibility.fontSize}
            onChange={e => setAccessibility({ ...accessibility, fontSize: e.target.value })}
          >
            <option value="medium">Medium (Default)</option>
            <option value="small">Small</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div className="divider"></div>

        {[
          { key: 'contrast',     title: 'High Contrast Mode', desc: 'Increase contrast between text and backgrounds for better readability.' },
          { key: 'reduceMotion', title: 'Reduce Motion',      desc: 'Disable UI animations and smooth scrolling.' },
        ].map(({ key, title, desc }) => (
          <div key={key} className="toggle-row">
            <div className="tr-info">
              <div className="tr-title">{title}</div>
              <div className="tr-desc">{desc}</div>
            </div>
            <div className={`toggle ${accessibility[key] ? 'on' : ''}`} onClick={() => toggle(key)}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
