import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Panel 4: Report submitted confirmation screen.
 */
export default function SuccessStep({ refId, resetForm }) {
  const navigate = useNavigate();

  return (
    <div className="panel active" id="panel4">
      <div className="panel-card">
        <div className="success-screen">
          <div className="success-circle">✓</div>
          <div className="success-title">Report Submitted</div>
          <div className="success-sub">
            Your report has been received and will be reviewed by a moderator within <strong>24 hours</strong>. We take all reports seriously and will take appropriate action if the content violates our community guidelines.
          </div>
          <div className="success-ref">
            Report ID: <span id="successRefId">{refId}</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
            <button className="btn-done" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </button>
            <button
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'var(--text-secondary,#aaa)',
                borderRadius: '8px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
              }}
              onClick={resetForm}
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
