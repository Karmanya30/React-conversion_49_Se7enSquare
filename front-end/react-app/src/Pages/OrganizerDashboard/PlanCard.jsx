// Plan status card showing free vs. premium organizer tier, limits, and upgrade action.
import React from 'react';

export default function PlanCard({
  isPremium = false,
  organizerProfile,
  onUpgrade,
}) {
  return (
    <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '15px',
            }}
          >
            {isPremium ? '🏆 Premium Organizer' : '🆓 Free Organizer'}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-3, #888)',
              marginTop: '2px',
            }}
          >
            {isPremium
              ? 'Unlimited tournaments & participants.'
              : `Limited to ${organizerProfile?.limits?.maxActiveTournaments || 1} active tournament, ${organizerProfile?.limits?.maxParticipants || 64} participants.`}
          </div>
        </div>
        {!isPremium && (
          <button className="btn-primary" onClick={onUpgrade}>
            Upgrade to Premium
          </button>
        )}
      </div>
    </div>
  );
}
