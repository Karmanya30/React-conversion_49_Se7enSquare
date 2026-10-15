import React from 'react';

/**
 * Step 4: Community rules textarea and welcome message textarea.
 */
export default function CommunityRulesInput({ rules, welcomeMsg, onRulesChange, onWelcomeMsgChange }) {
  return (
    <>
      <div className="fg">
        <div className="f-label">Community Rules</div>
        <textarea
          className="f-ta"
          value={rules}
          onChange={(e) => onRulesChange(e.target.value)}
          placeholder={'1. Be respectful to all members\n2. No spam or self-promotion\n3. Stay on topic\n4. No hate speech or harassment'}
          rows={5}
        ></textarea>
      </div>

      <div className="fg">
        <div className="f-label">Welcome Message</div>
        <textarea
          className="f-ta"
          value={welcomeMsg}
          onChange={(e) => onWelcomeMsgChange(e.target.value)}
          placeholder="Welcome to the community! Introduce yourself in #general and let us know what you're working on…"
          rows={3}
        ></textarea>
      </div>
    </>
  );
}
