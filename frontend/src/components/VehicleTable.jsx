import React from 'react';

const STANDARD_STATUSES = ['Available', 'In Service', 'Reserved', 'Sold'];

export default function VehicleTable({
  vehicles,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('available')) return 'badge-available';
    if (s.includes('service') || s.includes('maintenance')) return 'badge-in-service';
    if (s.includes('sold')) return 'badge-sold';
    if (s.includes('reserved')) return 'badge-reserved';
    return '';
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (miles) => {
    if (miles === null || miles === undefined) return '-';
    return `${Number(miles).toLocaleString()} mi`;
  };

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No Vehicle Records Found</div>
          <div className="empty-desc">
            No records match the selected search criteria or the database is empty.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="records-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>VIN</th>
            <th>Vehicle Description</th>
            <th>Type</th>
            <th>Plate</th>
            <th>Mileage</th>
            <th>Price</th>
            <th>Status</th>
            <th>Owner</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => {
            const hasCustomStatus = v.status && !STANDARD_STATUSES.includes(v.status);
            return (
              <tr key={v.id}>
                <td>#{v.id}</td>
                <td>
                  <span className="mono">{v.vin}</span>
                </td>
                <td>
                  <strong>{v.year} {v.make} {v.model}</strong>
                  {v.color && <div style={{ fontSize: '12px', color: '#64748b' }}>{v.color}</div>}
                </td>
                <td>{v.vehicleType}</td>
                <td>
                  <span className="mono" style={{ padding: '2px 6px', background: '#e2e8f0', borderRadius: '3px' }}>
                    {v.licensePlate}
                  </span>
                </td>
                <td>{formatMileage(v.mileage)}</td>
                <td>
                  <strong>{formatPrice(v.price)}</strong>
                </td>
                <td>
                  <select
                    value={v.status}
                    onChange={(e) => onStatusChange(v.id, e.target.value)}
                    className={`badge ${getStatusBadge(v.status)}`}
                    style={{
                      border: '1px solid currentColor',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {STANDARD_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                    {hasCustomStatus && (
                      <option value={v.status}>{v.status}</option>
                    )}
                  </select>
                </td>
                <td>
                  {v.ownerName ? (
                    <div>
                      <div>{v.ownerName}</div>
                      {v.ownerContact && (
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{v.ownerContact}</div>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: '#94a3b8' }}>-</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      title="View Details"
                      onClick={() => onView(v)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      title="Edit Record"
                      onClick={() => onEdit(v)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      title="Delete Record"
                      onClick={() => onDelete(v)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ padding: '10px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '13px', color: '#64748b' }}>
        Showing <strong>{vehicles.length}</strong> vehicle records
      </div>
    </div>
  );
}
