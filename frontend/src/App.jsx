import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsBar from './components/StatsBar';
import VehicleTable from './components/VehicleTable';
import VehicleFormModal from './components/VehicleFormModal';
import VehicleDetailsModal from './components/VehicleDetailsModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { vehicleService } from './services/vehicleService';

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [summary, setSummary] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    soldVehicles: 0,
    inServiceVehicles: 0,
    reservedVehicles: 0,
    totalInventoryValue: 0,
    averagePrice: 0,
    typeBreakdown: {},
  });

  const [loading, setLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const [notification, setNotification] = useState(null);

  // Search & Filter state
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewVehicle, setViewVehicle] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce search input by 250ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  // Auto-dismiss notification after 6 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [listData, summaryData] = await Promise.all([
        vehicleService.getAll({
          search: debouncedSearch,
          status: statusFilter,
          type: typeFilter,
        }),
        vehicleService.getSummary(),
      ]);

      setVehicles(listData);
      setSummary(summaryData);
      setBackendConnected(true);
    } catch (err) {
      console.error('Error fetching data:', err);
      setBackendConnected(false);
      showNotification('error', `Backend connection error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, typeFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setSelectedVehicle(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsFormModalOpen(true);
  };

  const handleOpenViewModal = (vehicle) => {
    setViewVehicle(vehicle);
    setIsDetailsModalOpen(true);
  };

  const handleOpenDeleteModal = (vehicle) => {
    setVehicleToDelete(vehicle);
    setIsDeleteModalOpen(true);
  };

  const handleSaveVehicle = async (vehicleData) => {
    if (selectedVehicle && selectedVehicle.id) {
      // Update (PUT)
      await vehicleService.update(selectedVehicle.id, vehicleData);
      showNotification('success', `Vehicle #${selectedVehicle.id} updated successfully.`);
    } else {
      // Create (POST)
      const created = await vehicleService.create(vehicleData);
      showNotification('success', `New vehicle created successfully with ID #${created.id}.`);
    }
    await loadData();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await vehicleService.updateStatus(id, newStatus);
      showNotification('success', `Vehicle #${id} status changed to "${newStatus}".`);
      await loadData();
    } catch (err) {
      showNotification('error', `Failed to update status: ${err.message}`);
    }
  };

  const handleConfirmDelete = async (id) => {
    setDeleting(true);
    try {
      await vehicleService.delete(id);
      showNotification('success', `Vehicle #${id} deleted from database.`);
      setIsDeleteModalOpen(false);
      setVehicleToDelete(null);
      await loadData();
    } catch (err) {
      showNotification('error', `Delete failed: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setStatusFilter('');
    setTypeFilter('');
  };

  return (
    <div>
      <Navbar isBackendConnected={backendConnected} />

      <main className="container">
        {/* Static Notification banner */}
        {notification && (
          <div className={`alert alert-${notification.type}`}>
            <span>{notification.message}</span>
            <button
              type="button"
              className="alert-close"
              onClick={clearNotification}
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {/* Fleet Metrics Summary */}
        <StatsBar summary={summary} />

        {/* Toolbar & Filter Controls */}
        <div className="toolbar-card">
          <div className="toolbar-controls">
            <div className="filter-group">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search make, model, VIN, plate, owner, color..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>

              <select
                className="select-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Available">Available</option>
                <option value="In Service">In Service</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
              </select>

              <select
                className="select-control"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
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

              {(searchInput || statusFilter || typeFilter) && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleResetFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={loadData}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleOpenAddModal}
              >
                + Add Vehicle Record
              </button>
            </div>
          </div>
        </div>

        {/* Main Records Table */}
        <VehicleTable
          vehicles={vehicles}
          onView={handleOpenViewModal}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onStatusChange={handleStatusChange}
        />
      </main>

      {/* Modals */}
      <VehicleFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveVehicle}
        vehicle={selectedVehicle}
      />

      <VehicleDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        vehicle={viewVehicle}
        onEdit={handleOpenEditModal}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        vehicle={vehicleToDelete}
        loading={deleting}
      />
    </div>
  );
}
