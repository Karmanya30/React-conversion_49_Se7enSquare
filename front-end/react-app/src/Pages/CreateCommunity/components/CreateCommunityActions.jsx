import React from 'react';

/**
 * Bottom bar actions: Back / Continue / Create Community buttons.
 * Includes double-submission guard via the `submitting` prop.
 * Also renders the standalone channel flow Create Channel button.
 */
export default function CreateCommunityActions({
  activeTab, currentStep,
  submitting,
  onPrev, onNext,
  onCreateChannel,
}) {
  return (
    <div className="bottom-bar">
      {activeTab === 'community' ? (
        <>
          <div className="bb-step">Step {currentStep} of 4</div>
          <div className="bb-acts">
            {currentStep > 1 && (
              <button className="btn-ghost" onClick={onPrev}>
                ← Back
              </button>
            )}
            <button
              className="btn-primary"
              onClick={onNext}
              disabled={submitting}
              style={submitting ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
            >
              {currentStep === 4 ? (submitting ? 'Creating…' : 'Create Community') : 'Continue →'}
            </button>
          </div>
        </>
      ) : (
        <div className="bb-acts" style={{ marginLeft: 'auto' }}>
          <button className="btn-primary" onClick={onCreateChannel}>
            Create Channel
          </button>
        </div>
      )}
    </div>
  );
}
