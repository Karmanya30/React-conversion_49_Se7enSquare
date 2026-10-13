import React from 'react';
import ToggleSwitch from '../../../Components/platform/common/ToggleSwitch';

/**
 * Configuration page composing AutoMod settings switches, numerical limits, and policy items.
 */
export default function ConfigTab({
  config,
  onUpdateConfig,
  policies,
  newPolicyText,
  setNewPolicyText,
  onAddPolicy,
  onDeletePolicy,
}) {
  return (
    <div className="admin-page active" id="page-config">
      <div className="config-grid">
        <div className="card">
          <div className="card-header">
            <h3 style={{ margin: 0 }}>AutoMod &amp; System Settings</h3>
          </div>
          <div className="config-item">
            <label>AutoMod Engine Enabled</label>
            <ToggleSwitch
              checked={config.autoModEnabled}
              onChange={(e) =>
                onUpdateConfig('autoModEnabled', e.target.checked, `AutoMod ${e.target.checked ? 'enabled' : 'disabled'}`)
              }
            />
          </div>
          <div className="config-item">
            <label>Allow Public Registration</label>
            <ToggleSwitch
              checked={config.allowPublicRegistration}
              onChange={(e) =>
                onUpdateConfig('allowPublicRegistration', e.target.checked, `Public registration ${e.target.checked ? 'opened' : 'closed'}`)
              }
            />
          </div>
          <div className="config-item">
            <label>Auto-Delete Toxic Messages</label>
            <ToggleSwitch
              checked={config.autoDeleteToxic}
              onChange={(e) =>
                onUpdateConfig('autoDeleteToxic', e.target.checked, `Toxic auto-delete ${e.target.checked ? 'enabled' : 'disabled'}`)
              }
            />
          </div>
          <div className="config-item">
            <label>Shadowban Bad Actors Automatically</label>
            <ToggleSwitch
              checked={config.shadowbanBadActors}
              onChange={(e) =>
                onUpdateConfig('shadowbanBadActors', e.target.checked, `Shadowban engine ${e.target.checked ? 'enabled' : 'disabled'}`)
              }
            />
          </div>
          <div className="config-item">
            <label>Max Communities / User</label>
            <input
              type="number"
              className="config-input"
              value={config.maxCommunitiesPerUser}
              onChange={(e) => onUpdateConfig('maxCommunitiesPerUser', parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="config-item">
            <label>Max Channels / Community</label>
            <input
              type="number"
              className="config-input"
              value={config.maxChannelsPerCommunity}
              onChange={(e) => onUpdateConfig('maxChannelsPerCommunity', parseInt(e.target.value) || 1)}
            />
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-3,#9ca3af)', marginTop: '12px' }}>
            System configurations take effect immediately platform-wide.
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 style={{ margin: 0 }}>Moderation Policies</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
            {policies.map((pol, idx) => (
              <div key={idx} className="policy-item">
                <span>• {pol}</span>
                <button
                  className="policy-del"
                  onClick={() => onDeletePolicy(idx)}
                  title="Delete policy"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={onAddPolicy} className="add-policy-row">
            <input
              type="text"
              className="config-input"
              placeholder="Add new platform policy..."
              value={newPolicyText}
              onChange={(e) => setNewPolicyText(e.target.value)}
            />
            <button
              type="submit"
              className="btn-sm"
              style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
