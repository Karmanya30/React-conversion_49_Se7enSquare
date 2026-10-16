// Table row presentation component for an individual event registrant.
import React from 'react';
import StatusBadge from '../../Components/event-management/common/StatusBadge';

export default function RegistrantRow({ registrant }) {
  const formattedDate = registrant.registeredAt
    ? new Date(registrant.registeredAt).toLocaleString()
    : '—';

  return (
    <tr>
      <td>
        <div className="row-name">{registrant.fullName || '—'}</div>
      </td>
      <td>@{registrant.username}</td>
      <td>{registrant.email || '—'}</td>
      <td>{registrant.phone || '—'}</td>
      <td>
        <StatusBadge
          variant="badge"
          status="active"
          label={registrant.inGameId || '—'}
        />
      </td>
      <td>{formattedDate}</td>
    </tr>
  );
}
