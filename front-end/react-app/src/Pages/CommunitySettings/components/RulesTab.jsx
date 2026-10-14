import React from 'react';

/**
 * Tab 4: Rules textarea editor with newline placeholder string.
 */
export default function RulesTab({ rules, onRulesChange }) {
  return (
    <section className="settings-tab section active">
      <div className="settings-card">
        <div className="settings-card-title">Community Rules</div>
        <div className="settings-field">
          <label>
            One rule per line — shown to members on the Rules tab of the community page.
          </label>
          <textarea
            className="settings-textarea"
            rows="10"
            value={rules}
            onChange={(e) => onRulesChange(e.target.value)}
            placeholder={"Be respectful to other members\nStay on topic in each channel\nNo spam or self-promotion"}
          ></textarea>
        </div>
      </div>
    </section>
  );
}
