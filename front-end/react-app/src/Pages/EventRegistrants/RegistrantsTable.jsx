// Data table wrapper rendering column headers, registrant rows, and footer count.
import React from 'react';
import LoadingState from '../../Components/event-management/common/LoadingState';
import EmptyState from '../../Components/event-management/common/EmptyState';
import RegistrantRow from './RegistrantRow';

export default function RegistrantsTable({
  registrants = [],
  loading = false,
  errorMsg = null,
}) {
  return (
    <>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>In-Game ID</th>
              <th>Registered At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingState
                isTableRow={true}
                colSpan={6}
                message="Loading registrants…"
              />
            ) : errorMsg === 'No registrants yet' || (!errorMsg && registrants.length === 0) ? (
              <tr>
                <td colSpan="6">
                  <EmptyState
                    icon="👥"
                    title="No registrants yet"
                    subtitle="Registrants will show up here once players sign up."
                  />
                </td>
              </tr>
            ) : errorMsg ? (
              <tr>
                <td colSpan="6">
                  <EmptyState
                    icon="⚠️"
                    title={errorMsg}
                    subtitle={
                      errorMsg === "You don't have access to this tournament's registrants"
                        ? "Requires community manager, organizer, or admin privileges."
                        : errorMsg === "Event not found"
                        ? "Could not find a tournament matching this ID."
                        : "Could not retrieve registrant details from the server."
                    }
                  />
                </td>
              </tr>
            ) : (
              registrants.map((r, idx) => (
                <RegistrantRow
                  key={r.id || r.registrationId || r.userId || r.username || `reg-${idx}`}
                  registrant={r}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span>
          {loading
            ? 'Loading…'
            : errorMsg === 'No registrants yet' || (!errorMsg && registrants.length === 0)
            ? '0 registrants'
            : errorMsg
            ? errorMsg
            : `${registrants.length} registrant${registrants.length === 1 ? '' : 's'}`}
        </span>
      </div>
    </>
  );
}
