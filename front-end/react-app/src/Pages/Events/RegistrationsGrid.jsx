// Grid displaying confirmed event tickets or an empty state.
import React from 'react';
import EmptyState from '../../Components/event-management/common/EmptyState';
import RegistrationTicket from './RegistrationTicket';

export default function RegistrationsGrid({
  registrations = [],
  allEvents = [],
  getCommunity,
  onBrowseEvents,
  onCancel,
}) {
  return (
    <div className="reg-list" id="regGrid">
      {registrations.length === 0 ? (
        <EmptyState
          icon="🎟"
          title="No registrations yet"
          subtitle="Explore upcoming events and register to see them here."
          actionText="Browse Events"
          onAction={onBrowseEvents}
        />
      ) : (
        registrations.map((reg, idx) => (
          <RegistrationTicket
            key={reg.id || reg.eventId || `reg-${idx}`}
            registration={reg}
            event={allEvents.find((e) => Number(e.id) === Number(reg.eventId))}
            comm={getCommunity ? getCommunity(reg.communityId) : null}
            index={idx}
            onCancel={onCancel}
          />
        ))
      )}
    </div>
  );
}
