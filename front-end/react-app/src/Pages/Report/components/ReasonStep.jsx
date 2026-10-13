import React from 'react';
import { REASONS } from '../../../Components/platform/data/reportReasons';

/**
 * Panel 2: Select report violation reason and optional additional context.
 */
export default function ReasonStep({
  selectedReason,
  setSelectedReason,
  additionalContext,
  setAdditionalContext,
  setStep,
  goStep,
}) {
  return (
    <div className="panel active" id="panel2">
      <div className="panel-card">
        <div className="panel-title">Why are you reporting this?</div>
        <div className="panel-sub">
          Choose the reason that best describes the violation. You can add additional context below.
        </div>
        <div className="reason-list">
          {REASONS.map((r) => (
            <div
              key={r.id}
              className={`reason-opt${selectedReason === r.label ? ' selected' : ''}`}
              onClick={() => setSelectedReason(r.label)}
            >
              <div className="reason-radio"></div>
              <div className="reason-icon">{r.icon}</div>
              <div className="reason-body">
                <div className="reason-title">{r.label}</div>
                <div className="reason-desc">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="additional-field">
          <label>Additional Context (Optional)</label>
          <textarea
            id="additionalContext"
            maxLength={500}
            placeholder="Describe the issue in more detail…"
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
          />
          <div className="char-count" id="charCount">{additionalContext.length}/500</div>
        </div>
        <div className="btn-row">
          <button className="btn-back" onClick={() => setStep(1)}>
            ← Back
          </button>
          <button className="btn-next" onClick={() => goStep(3)}>
            Review Report →
          </button>
        </div>
      </div>
    </div>
  );
}
