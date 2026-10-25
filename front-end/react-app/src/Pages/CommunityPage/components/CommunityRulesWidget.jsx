import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Rules tab: numbered community rules list with enforcement sidebar.
 */
export default function CommunityRulesWidget({ community, rules }) {
  const navigate = useNavigate();

  return (
    <div className="tab-content active" id="tab-rules">
      <div className="rules-layout">
        <div className="rules-main" id="rulesMain">
          {rules.map((rule, i) => (
            <div key={i} className="rule-item" style={{ display: 'flex', gap: '16px', padding: '16px', background: 'var(--bg-card,#151d2f)', borderRadius: '10px', marginBottom: '10px', border: '1px solid var(--border,rgba(255,255,255,0.06))' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#818cf8', flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ color: 'var(--text-secondary,#ccc)', fontSize: '14px', lineHeight: '1.5' }}>{rule}</div>
            </div>
          ))}
        </div>
        <div className="rules-aside">
          <div className="rules-note">
            <div className="rules-note-title">✓ Safe Community</div>
            <div className="rules-note-text">
              {community.name} has zero tolerance for hate speech, harassment, or discrimination. Violations result in immediate action.
            </div>
          </div>
          <div className="section-card">
            <div className="sc-title">⚖️ Enforcement</div>
            <div className="enforcement-list">
              {['⚠️ 1st offense: Warning', '🔇 2nd offense: 24h mute', '🚫 3rd offense: Temp ban', '⛔ Severe: Permanent ban'].map((item, i) => (
                <div key={i} className={`enforcement-item${i === 3 ? ' enforcement-item--severe' : ''}`}>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="section-card">
            <div className="sc-title">📬 Report a Problem</div>
            <div className="report-text">Use the report button on any message or contact a moderator directly.</div>
            <button
              className="report-btn"
              onClick={() => navigate('/report')}
            >
              🚩 Report a Violation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
