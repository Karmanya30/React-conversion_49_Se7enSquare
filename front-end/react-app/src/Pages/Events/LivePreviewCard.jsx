// Real-time preview card mirroring the event creation form inputs.
import React from 'react';

export default function LivePreviewCard({ form, eventType, formatDate }) {
  return (
    <div className="preview-card-wrap">
      <div className="preview-label">Live Preview</div>
      <div className="preview-card">
        <div className="preview-banner">📅</div>
        <div className="preview-body">
          <div className="preview-title" id="prevTitle">
            {form.title || 'Your event title'}
          </div>
          <div className="preview-meta">
            <div className="preview-meta-row" id="prevDate">
              {form.date && form.time
                ? `🗓 ${formatDate ? formatDate(form.date) : form.date} at ${form.time}`
                : '🗓 Select a date and time'}
            </div>
            <div className="preview-meta-row">
              🌐 {eventType} · ⚡ Community
            </div>
            <div className="preview-meta-row">
              🏆 {form.category || 'General'} · 🆓 Free
            </div>
          </div>
        </div>
      </div>
      <div className="tips-card">
        <div className="tips-title">✦ Tips for great events</div>
        <div className="tip-row">
          <div className="tip-dot"></div>
          Use a clear, descriptive title that states what attendees will learn or do.
        </div>
        <div className="tip-row">
          <div className="tip-dot"></div>
          Add a cover image — events with images get 3× more registrations.
        </div>
        <div className="tip-row">
          <div className="tip-dot"></div>
          Set a max capacity to create urgency and manage expectations.
        </div>
        <div className="tip-row">
          <div className="tip-dot"></div>
          Post in relevant channels to announce your event after publishing.
        </div>
      </div>
    </div>
  );
}
