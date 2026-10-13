import React from 'react';

/**
 * Reusable accessible toggle switch for AutoMod and settings.
 */
export default function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="toggle-slider"></span>
    </label>
  );
}
