// Form component for creating new events and tournaments.
import React from 'react';

export default function CreateEventForm({
  form,
  setForm,
  formErrors = {},
  eventType,
  setEventType,
  communities = [],
  coverPreview,
  fileInputRef,
  onImageUpload,
  onSaveDraft,
  onLoadDraft,
  draftSaved,
  onSubmit,
}) {
  return (
    <div className="form-card">
      <div className="form-section-title">✦ Create a New Event</div>

      <div className="field">
        <label>Event Title *</label>
        <input
          id="evTitle"
          type="text"
          placeholder="e.g. MOBA Deep Dive Workshop"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        {formErrors.title && (
          <div className="error-msg" id="err-title">
            {formErrors.title}
          </div>
        )}
      </div>

      <div className="field">
        <label>Description *</label>
        <textarea
          id="evDesc"
          rows={3}
          placeholder="Tell attendees what to expect…"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />
        {formErrors.description && (
          <div className="error-msg" id="err-desc">
            {formErrors.description}
          </div>
        )}
      </div>

      <div className="field-row">
        <div className="field">
          <label>Date *</label>
          <input
            id="evDate"
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          />
          {formErrors.date && (
            <div className="error-msg" id="err-date">
              {formErrors.date}
            </div>
          )}
        </div>
        <div className="field">
          <label>Time *</label>
          <input
            id="evTime"
            type="time"
            value={form.time}
            onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
          />
          {formErrors.time && (
            <div className="error-msg" id="err-time">
              {formErrors.time}
            </div>
          )}
        </div>
      </div>

      <div className="field">
        <label>Event Type</label>
        <div className="type-toggle">
          {['Online', 'In-Person', 'Hybrid'].map((t) => (
            <div
              key={t}
              className={`type-opt${eventType === t ? ' on' : ''}`}
              onClick={() => setEventType(t)}
            >
              {t === 'Online' ? '🌐' : t === 'In-Person' ? '📍' : '🔀'} {t}
            </div>
          ))}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label>Community *</label>
          <select
            id="evCommunity"
            value={form.community}
            onChange={(e) =>
              setForm((f) => ({ ...f, community: e.target.value }))
            }
          >
            <option value="">Select community</option>
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {formErrors.community && (
            <div className="error-msg" id="err-community">
              {formErrors.community}
            </div>
          )}
        </div>
        <div className="field">
          <label>Max Attendees *</label>
          <input
            id="evMax"
            type="number"
            min={1}
            value={form.capacity}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                capacity: parseInt(e.target.value, 10) || 50,
              }))
            }
          />
          {formErrors.capacity && (
            <div className="error-msg" id="err-max">
              {formErrors.capacity}
            </div>
          )}
        </div>
      </div>

      <div className="field">
        <label>Category *</label>
        <select
          id="evCategory"
          value={form.category}
          onChange={(e) =>
            setForm((f) => ({ ...f, category: e.target.value }))
          }
        >
          <option value="Hackathon">🏆 Hackathon</option>
          <option value="Workshop">🎓 Workshop</option>
          <option value="AMA">🎙 AMA / Talk</option>
          <option value="Tournament">🎮 Gaming / Tournament</option>
          <option value="Discussion">📖 Discussion</option>
          <option value="Social">🎉 Social / Meetup</option>
        </select>
      </div>

      <div className="field">
        <label>Cover Image (Optional)</label>
        <div
          id="uploadArea"
          className="upload-area"
          tabIndex={0}
          role="button"
          aria-label="Upload cover image"
          onClick={() => fileInputRef.current?.click()}
        >
          {coverPreview ? (
            <div id="uploadPreview" className="upload-preview">
              <img
                src={coverPreview}
                alt="Cover preview"
                style={{
                  width: '100%',
                  maxHeight: '160px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            </div>
          ) : (
            <div id="uploadDefault">
              <div className="upload-icon">🖼</div>
              <div className="upload-text" id="uploadText">
                Drag &amp; drop or click to upload
              </div>
              <div className="upload-sub">
                Using default gaming banner if empty
              </div>
            </div>
          )}
        </div>
        <input
          id="evCover"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onImageUpload}
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          id="saveDraftBtn"
          className="btn-draft"
          onClick={onSaveDraft}
        >
          {draftSaved ? '✓ Saved!' : 'Save Draft'}
        </button>
        <button
          type="button"
          id="loadDraftBtn"
          className="btn-draft"
          onClick={onLoadDraft}
        >
          Load Last Draft
        </button>
        <button
          type="button"
          id="publishEventBtn"
          className="btn-publish"
          onClick={onSubmit}
        >
          Request Approval
        </button>
      </div>
    </div>
  );
}
