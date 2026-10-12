import React from 'react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, vehicle, loading }) {
  if (!isOpen || !vehicle) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: '#dc2626' }}>
            Confirm Delete
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
          <p style={{ marginBottom: '12px' }}>
            Are you sure you want to permanently delete the following vehicle record?
          </p>

          <div
            style={{
              padding: '12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
            }}
          >
            <div>
              <strong>#{vehicle.id} - {vehicle.year} {vehicle.make} {vehicle.model}</strong>
            </div>
            <div className="mono" style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              VIN: {vehicle.vin} | Plate: {vehicle.licensePlate}
            </div>
          </div>

          <p style={{ marginTop: '12px', fontSize: '13px', color: '#b91c1c' }}>
            This operation will remove the record directly from the MySQL database.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(vehicle.id)}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Vehicle'}
          </button>
        </div>
      </div>
    </div>
  );
}
