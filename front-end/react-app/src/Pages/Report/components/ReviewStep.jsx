import React from 'react';

/**
 * Panel 3: Review summary, confirmation checkbox, and report submission.
 */
export default function ReviewStep({
  selectedTarget,
  selectedReason,
  additionalContext,
  confirmed,
  setConfirmed,
  submitting,
  setStep,
  submitReport,
}) {
  return (
    <div className="panel active" id="panel3">
      <div className="panel-card">
        <div className="panel-title">Review your report</div>
        <div className="panel-sub">
          Check the details below before submitting. Once sent, a moderator will review this report and take action within 24 hours.
        </div>
        <div className="review-section">
          <div className="review-row">
            <div className="review-key">Report Type</div>
            <div className="review-val" id="rvType">
              {selectedTarget?.type === 'message'
                ? 'Message Report'
                : selectedTarget?.type === 'community'
                ? 'Community Report'
                : 'User Report'}
            </div>
          </div>
          <div className="review-row">
            <div className="review-key">Reporting</div>
            <div className="review-val red" id="rvTarget">
              {selectedTarget?.name || selectedTarget?.text || `${selectedTarget?.type} #${selectedTarget?.id}`}
            </div>
          </div>
          <div className="review-row">
            <div className="review-key">Violation Reason</div>
            <div className="review-val red" id="rvReason">🚫 {selectedReason}</div>
          </div>
          <div className="review-row">
            <div className="review-key">Additional Context</div>
            <div className="review-val" id="rvContext">{additionalContext || 'None provided'}</div>
          </div>
          <div className="review-row">
            <div className="review-key">Anonymous</div>
            <div className="review-val green">✓ Yes — your identity is protected</div>
          </div>
        </div>
        <div className="confirm-row">
          <input
            id="confirmCheck"
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          <label htmlFor="confirmCheck">
            I confirm that this report is <strong>accurate and made in good faith</strong>. I understand that submitting false or malicious reports is a violation of Gameunity's Terms of Service and may result in action against my account.
          </label>
        </div>
        <div className="btn-row">
          <button className="btn-back" onClick={() => setStep(2)}>
            ← Back
          </button>
          <button
            className="btn-next"
            disabled={!confirmed || submitting}
            id="submitBtn"
            onClick={submitReport}
          >
            {submitting ? 'Submitting…' : '🚩 Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
}
