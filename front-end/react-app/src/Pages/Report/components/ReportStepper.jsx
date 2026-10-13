import React from 'react';
import { STEPS } from '../../../Components/platform/data/reportReasons';

/**
 * 3-step progress bar matching commit 0cc099a.
 */
export default function ReportStepper({ step, submitted }) {
  if (submitted) return null;

  return (
    <div className="stepper" id="stepper">
      {STEPS.map((s) => (
        <div
          key={s.num}
          className={`step${step === s.num ? ' active' : step > s.num ? ' done' : ''}`}
          id={`s${s.num}`}
        >
          <div className="step-circle">{step > s.num ? '✓' : s.num}</div>
          <div className="step-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
