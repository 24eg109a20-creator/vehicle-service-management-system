import React from 'react';

export default function StatsBar({ summary }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-label">Total Vehicles</div>
        <div className="stat-value">{summary.totalVehicles ?? 0}</div>
        <div className="stat-subtext">Total fleet records</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Available for Sale</div>
        <div className="stat-value" style={{ color: '#16a34a' }}>
          {summary.availableVehicles ?? 0}
        </div>
        <div className="stat-subtext">Ready for immediate delivery</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">In Maintenance / Service</div>
        <div className="stat-value" style={{ color: '#d97706' }}>
          {summary.inServiceVehicles ?? 0}
        </div>
        <div className="stat-subtext">Under inspection or repair</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Sold Records</div>
        <div className="stat-value" style={{ color: '#64748b' }}>
          {summary.soldVehicles ?? 0}
        </div>
        <div className="stat-subtext">Completed sales transactions</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Inventory Valuation</div>
        <div className="stat-value" style={{ color: '#2563eb' }}>
          {formatCurrency(summary.totalInventoryValue)}
        </div>
        <div className="stat-subtext">
          Avg: {formatCurrency(summary.averagePrice)}
        </div>
      </div>
    </div>
  );
}
