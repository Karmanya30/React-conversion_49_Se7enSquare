// Grid displaying upcoming event cards, loading indicator, and empty state.
import React from 'react';
import LoadingState from '../../Components/event-management/common/LoadingState';
import EmptyState from '../../Components/event-management/common/EmptyState';
import EventCard from './EventCard';

export default function EventsGrid({
  events = [],
  loading = false,
  getCommunity,
  isRegistered,
  onView,
  onRegister,
  onCancel,
  canDelete = false,
  onDelete,
}) {
  return (
    <div className="events-grid" id="upcomingGrid">
      {loading ? (
        <LoadingState message="Loading events…" />
      ) : events.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No upcoming events yet."
          subtitle="Check back soon for new tournaments."
        />
      ) : (
        events.map((ev, idx) => (
          <EventCard
            key={ev.id}
            event={ev}
            index={idx}
            comm={getCommunity ? getCommunity(ev.communityId) : null}
            isRegistered={isRegistered ? isRegistered(ev.id) : false}
            onView={onView}
            onRegister={onRegister}
            onCancel={onCancel}
            canDelete={canDelete}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}
