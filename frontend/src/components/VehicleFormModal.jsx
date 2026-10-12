import React, { useState, useEffect } from 'react';

const INITIAL_FORM = {
  vin: '',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  color: '',
  licensePlate: '',
  vehicleType: 'Sedan',
  mileage: '',
  price: '',
  status: 'Available',
  ownerName: '',
  ownerContact: '',
};

export default function VehicleFormModal({ isOpen, onClose, onSave, vehicle }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vin: vehicle.vin || '',
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        color: vehicle.color || '',
        licensePlate: vehicle.licensePlate || '',
        vehicleType: vehicle.vehicleType || 'Sedan',
        mileage: vehicle.mileage !== null && vehicle.mileage !== undefined ? vehicle.mileage : '',
        price: vehicle.price !== null && vehicle.price !== undefined ? vehicle.price : '',
        status: vehicle.status || 'Available',
        ownerName: vehicle.ownerName || '',
        ownerContact: vehicle.ownerContact || '',
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setErrors({});
  }, [vehicle, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.vin.trim()) {
      errs.vin = 'VIN is required';
    } else if (formData.vin.trim().length < 11 || formData.vin.trim().length > 17) {
      errs.vin = 'VIN must be between 11 and 17 characters';
    }

    if (!formData.make.trim()) errs.make = 'Make is required';
    if (!formData.model.trim()) errs.model = 'Model is required';
    if (!formData.year) errs.year = 'Year is required';
    else if (formData.year < 1900 || formData.year > 2100) {
      errs.year = 'Year must be between 1900 and 2100';
    }

    if (!formData.licensePlate.trim()) errs.licensePlate = 'License plate is required';
    if (!formData.vehicleType) errs.vehicleType = 'Vehicle type is required';
    if (!formData.status) errs.status = 'Status is required';

    if (formData.price && Number(formData.price) < 0) {
      errs.price = 'Price cannot be negative';
    }
    if (formData.mileage && Number(formData.mileage) < 0) {
      errs.mileage = 'Mileage cannot be negative';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        year: Number(formData.year),
        mileage: formData.mileage !== '' ? Number(formData.mileage) : null,
        price: formData.price !== '' ? Number(formData.price) : null,
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      if (err.errors && Object.keys(err.errors).length > 0) {
        setErrors(err.errors);
      } else {
        setErrors({ general: err.message || 'Operation failed' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isEdit = Boolean(vehicle && vehicle.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {isEdit ? `Edit Vehicle Record #${vehicle.id}` : 'Add New Vehicle Record'}
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

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.general && (
              <div className="alert alert-error" style={{ marginBottom: '16px' }}>
                <span>{errors.general}</span>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  VIN (Vehicle Identification Number) <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="vin"
                  className="form-control mono"
                  placeholder="e.g. 1HGCR2F83HA123456"
                  value={formData.vin}
                  onChange={handleChange}
                  maxLength={17}
                />
                {errors.vin && <span className="form-error">{errors.vin}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  License Plate <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="licensePlate"
                  className="form-control mono"
                  placeholder="e.g. MH01-AB-1234"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  maxLength={20}
                />
                {errors.licensePlate && (
                  <span className="form-error">{errors.licensePlate}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Make <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="make"
                  className="form-control"
                  placeholder="e.g. Toyota"
                  value={formData.make}
                  onChange={handleChange}
                />
                {errors.make && <span className="form-error">{errors.make}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Model <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  className="form-control"
                  placeholder="e.g. Camry"
                  value={formData.model}
                  onChange={handleChange}
                />
                {errors.model && <span className="form-error">{errors.model}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Manufacturing Year <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  className="form-control"
                  placeholder="2024"
                  min="1900"
                  max="2100"
                  value={formData.year}
                  onChange={handleChange}
                />
                {errors.year && <span className="form-error">{errors.year}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Type <span className="required">*</span></label>
                <select
                  name="vehicleType"
                  className="form-control"
                  value={formData.vehicleType}
                  onChange={handleChange}
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Truck">Truck</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Van">Van</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Electric">Electric</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Color</label>
                <input
                  type="text"
                  name="color"
                  className="form-control"
                  placeholder="e.g. Silver Metallic"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status <span className="required">*</span></label>
                <select
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Available">Available</option>
                  <option value="In Service">In Service</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Mileage (miles)</label>
                <input
                  type="number"
                  name="mileage"
                  className="form-control"
                  placeholder="e.g. 15000"
                  min="0"
                  value={formData.mileage}
                  onChange={handleChange}
                />
                {errors.mileage && <span className="form-error">{errors.mileage}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Price ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  className="form-control"
                  placeholder="e.g. 28500.00"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                />
                {errors.price && <span className="form-error">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Owner / Customer Name</label>
                <input
                  type="text"
                  name="ownerName"
                  className="form-control"
                  placeholder="e.g. John Doe"
                  value={formData.ownerName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Owner Contact Number</label>
                <input
                  type="text"
                  name="ownerContact"
                  className="form-control"
                  placeholder="e.g. +1 555-0199"
                  value={formData.ownerContact}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
