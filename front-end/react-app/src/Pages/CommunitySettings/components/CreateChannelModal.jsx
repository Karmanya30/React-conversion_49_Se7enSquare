import React from 'react';

/**
 * Modal dialog for creating a new channel.
 */
export default function CreateChannelModal({
  isOpen,
  onClose,
  channelName,
  setChannelName,
  channelType,
  setChannelType,
  onCreateChannel,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-bg"
      style={{ display: 'flex' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <div className="modal-title">Create New Channel</div>
        <form onSubmit={onCreateChannel}>
          <div className="modal-field">
            <label>Channel Name *</label>
            <input
              type="text"
              placeholder="e.g. highlights"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              required
            />
          </div>
          <div className="modal-field">
            <label>Channel Type</label>
            <select value={channelType} onChange={(e) => setChannelType(e.target.value)}>
              <option value="Text">Text</option>
              <option value="Voice">Voice</option>
              <option value="Announcement">Announcement</option>
            </select>
          </div>
          <div className="modal-btns">
            <button type="button" className="btn btn-muted" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Channel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
