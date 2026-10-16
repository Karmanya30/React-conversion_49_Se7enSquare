// Modal dialog for hosting a new tournament or editing an existing one.
import React from 'react';
import StatusBadge from '../../Components/event-management/common/StatusBadge';
import { EVENT_STATUSES } from '../../Components/event-management/utils/constants';

export default function TournamentModal({
  isOpen = false,
  onClose,
  modalMode = 'create',
  formData,
  setFormData,
  communities = [],
  onSubmit,
}) {
  if (!isOpen) return null;

  const isCancelled = formData.status === EVENT_STATUSES.CANCELLED;

  return (
    <div
      className="modal-overlay"
      style={{ display: 'flex' }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div className="modal-container">
        <div className="modal-header">
          <h3>
            {modalMode === 'create' ? 'Host a Tournament' : 'Edit Tournament'}
          </h3>
          <button className="modal-x" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Tournament Title</label>
              <input
                className="form-input"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                maxLength={60}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                className="form-input"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                maxLength={220}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Community</label>
              <select
                className="form-input"
                value={formData.communityId}
                onChange={(e) =>
                  setFormData({ ...formData, communityId: e.target.value })
                }
              >
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                className="form-input"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                placeholder="6:00 PM"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Max Participants</label>
              <input
                className="form-input"
                type="number"
                min="1"
                value={formData.maxAttendees}
                onChange={(e) =>
                  setFormData({ ...formData, maxAttendees: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Entry Fee (₹)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                value={formData.entryFee}
                onChange={(e) =>
                  setFormData({ ...formData, entryFee: e.target.value })
                }
              />
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-3, #666)',
                  marginTop: '4px',
                }}
              >
                0 = free tournament. A 15% platform commission is logged per paid
                registration.
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Prize Pool (₹)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                value={formData.prizePool}
                onChange={(e) =>
                  setFormData({ ...formData, prizePool: e.target.value })
                }
              />
            </div>

            {modalMode === 'edit' && (
              <div className="form-group">
                <label className="form-label">Status</label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginTop: '6px',
                  }}
                >
                  <StatusBadge
                    variant="badge"
                    status={formData.status || EVENT_STATUSES.PENDING}
                  />
                  {!isCancelled ? (
                    <select
                      className="form-input"
                      style={{ width: 'auto', padding: '6px 12px' }}
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value={formData.status}>
                        Keep {formData.status}
                      </option>
                      <option value={EVENT_STATUSES.CANCELLED}>
                        Cancel tournament
                      </option>
                    </select>
                  ) : (
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-3, #888)',
                      }}
                    >
                      (Tournament is cancelled)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {modalMode === 'create' ? 'Create Tournament' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
