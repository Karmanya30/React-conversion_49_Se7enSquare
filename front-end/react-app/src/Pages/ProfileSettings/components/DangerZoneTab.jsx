import React from 'react';

/** "Danger Zone" tab — appeal link, deactivate, and logout actions. */
export default function DangerZoneTab({ navigate, onShowToast, onLogout }) {
  return (
    <div className="view active">
      <div className="danger-zone">
        <div className="dz-title">⚠️ Danger Zone</div>
        <div className="dz-sub">These actions are permanent and cannot be undone.</div>

        <div className="dz-item">
          <div>
            <div className="dz-label">Appeal Moderation Action</div>
            <div className="dz-desc">Submit an appeal if your account was unfairly warned, muted, or banned.</div>
          </div>
          <button className="btn-appeal" onClick={() => navigate('/appeal')}>Submit Appeal</button>
        </div>

        <div className="dz-item">
          <div>
            <div className="dz-label">Deactivate Account</div>
            <div className="dz-desc">Temporarily hide your profile and pause notifications.</div>
          </div>
          <button
            className="btn-danger"
            onClick={() => onShowToast("⚠️ Account deactivation isn't available yet. Contact an admin.")}
          >
            Deactivate
          </button>
        </div>

        <div className="dz-item">
          <div>
            <div className="dz-label">Log Out</div>
            <div className="dz-desc">Sign out of your session on this device.</div>
          </div>
          <button type="button" className="btn-danger" onClick={onLogout}>Log Out</button>
        </div>
      </div>
    </div>
  );
}
