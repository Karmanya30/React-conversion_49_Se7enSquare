// Data table wrapper rendering column headers, tournament rows, loading/empty states, and count.
import React from 'react';
import LoadingState from '../../Components/event-management/common/LoadingState';
import EmptyState from '../../Components/event-management/common/EmptyState';
import TournamentRow from './TournamentRow';

export default function TournamentsTable({
  tournaments = [],
  loading = false,
  currentFilter = 'all',
  getCommunityName,
  regCountByEvent = {},
  onEdit,
  onPromote,
  onViewRegistrants,
  onDelete,
  onHostTournament,
}) {
  return (
    <>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tournament</th>
              <th>Community</th>
              <th>Date</th>
              <th>Status</th>
              <th>Registrations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingState
                isTableRow={true}
                colSpan={6}
                message="Loading tournaments…"
              />
            ) : tournaments.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    icon="🏆"
                    title={`No tournaments ${currentFilter === 'all' ? 'yet' : 'in this filter'}`}
                    subtitle='Click "+ Host Tournament" to create one.'
                    actionText={currentFilter === 'all' ? '+ Host Tournament' : null}
                    onAction={onHostTournament}
                  />
                </td>
              </tr>
            ) : (
              tournaments.map((e) => (
                <TournamentRow
                  key={e.id}
                  event={e}
                  communityName={getCommunityName ? getCommunityName(e.communityId) : `Community #${e.communityId}`}
                  regCount={regCountByEvent[e.id] ?? e.attendees ?? 0}
                  onEdit={onEdit}
                  onPromote={onPromote}
                  onViewRegistrants={onViewRegistrants}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span>
          Showing {tournaments.length} tournament{tournaments.length === 1 ? '' : 's'}
        </span>
      </div>
    </>
  );
}
