import React from 'react';

export default function VehicleDetailsModal({ isOpen, onClose, vehicle, onEdit }) {
  if (!isOpen || !vehicle) return null;

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('available')) return 'badge-available';
    if (s.includes('service') || s.includes('maintenance')) return 'badge-in-service';
    if (s.includes('sold')) return 'badge-sold';
    if (s.includes('reserved')) return 'badge-reserved';
    return '';
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatMileage = (miles) => {
    if (miles === null || miles === undefined) return 'N/A';
    return `${Number(miles).toLocaleString()} miles`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            Vehicle Specification: #{vehicle.id}
          </div>
          <button
            type="button"
            className="alert-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">VIN</div>
              <div className="detail-value mono">{vehicle.vin}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">License Plate</div>
              <div className="detail-value mono">{vehicle.licensePlate}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Make &amp; Model</div>
              <div className="detail-value">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Vehicle Type</div>
              <div className="detail-value">{vehicle.vehicleType}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Exterior Color</div>
              <div className="detail-value">{vehicle.color || 'Not Specified'}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Current Status</div>
              <div className="detail-value">
                <span className={`badge ${getStatusBadge(vehicle.status)}`}>{vehicle.status}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Mileage</div>
              <div className="detail-value">{formatMileage(vehicle.mileage)}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Valuation / Price</div>
              <div className="detail-value" style={{ color: '#2563eb' }}>
                {formatPrice(vehicle.price)}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Registered Owner</div>
              <div className="detail-value">{vehicle.ownerName || 'None / Dealership'}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Owner Contact</div>
              <div className="detail-value">{vehicle.ownerContact || 'N/A'}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Record Created</div>
              <div className="detail-value" style={{ fontSize: '13px', color: '#64748b' }}>
                {formatDate(vehicle.createdAt)}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">Last Updated</div>
              <div className="detail-value" style={{ fontSize: '13px', color: '#64748b' }}>
                {formatDate(vehicle.updatedAt)}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onEdit(vehicle);
            }}
          >
            Edit Record
          </button>
        </div>
      </div>
    </div>
  );
}
