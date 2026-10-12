package com.vehicle.vehicle_svc.service;

import com.vehicle.vehicle_svc.exception.DuplicateResourceException;
import com.vehicle.vehicle_svc.exception.ResourceNotFoundException;
import com.vehicle.vehicle_svc.model.Vehicle;
import com.vehicle.vehicle_svc.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    @Autowired
    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional(readOnly = true)
    public List<Vehicle> getAllVehicles(String query, String status, String vehicleType) {
        if ((query != null && !query.isBlank()) ||
            (status != null && !status.isBlank()) ||
            (vehicleType != null && !vehicleType.isBlank())) {
            return vehicleRepository.searchAndFilter(
                    query != null ? query.trim() : null,
                    status != null ? status.trim() : null,
                    vehicleType != null ? vehicleType.trim() : null
            );
        }
        return vehicleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public Vehicle getVehicleByVin(String vin) {
        return vehicleRepository.findByVin(vin.toUpperCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with VIN: " + vin));
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        String vin = vehicle.getVin().toUpperCase().trim();
        String plate = vehicle.getLicensePlate().toUpperCase().trim();

        if (vehicleRepository.existsByVin(vin)) {
            throw new DuplicateResourceException("Vehicle with VIN '" + vin + "' already exists.");
        }
        if (vehicleRepository.existsByLicensePlate(plate)) {
            throw new DuplicateResourceException("Vehicle with license plate '" + plate + "' already exists.");
        }

        vehicle.setVin(vin);
        vehicle.setLicensePlate(plate);
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle updatedData) {
        Vehicle existing = getVehicleById(id);

        String newVin = updatedData.getVin().toUpperCase().trim();
        String newPlate = updatedData.getLicensePlate().toUpperCase().trim();

        Optional<Vehicle> otherWithVin = vehicleRepository.findByVin(newVin);
        if (otherWithVin.isPresent() && !otherWithVin.get().getId().equals(id)) {
            throw new DuplicateResourceException("Another vehicle with VIN '" + newVin + "' already exists.");
        }

        Optional<Vehicle> otherWithPlate = vehicleRepository.findByLicensePlate(newPlate);
        if (otherWithPlate.isPresent() && !otherWithPlate.get().getId().equals(id)) {
            throw new DuplicateResourceException("Another vehicle with license plate '" + newPlate + "' already exists.");
        }

        existing.setVin(newVin);
        existing.setMake(updatedData.getMake().trim());
        existing.setModel(updatedData.getModel().trim());
        existing.setYear(updatedData.getYear());
        existing.setColor(updatedData.getColor() != null ? updatedData.getColor().trim() : null);
        existing.setLicensePlate(newPlate);
        existing.setVehicleType(updatedData.getVehicleType().trim());
        existing.setMileage(updatedData.getMileage());
        existing.setPrice(updatedData.getPrice());
        existing.setStatus(updatedData.getStatus().trim());
        existing.setOwnerName(updatedData.getOwnerName() != null ? updatedData.getOwnerName().trim() : null);
        existing.setOwnerContact(updatedData.getOwnerContact() != null ? updatedData.getOwnerContact().trim() : null);

        return vehicleRepository.save(existing);
    }

    public Vehicle updateStatus(Long id, String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status cannot be empty.");
        }
        Vehicle vehicle = getVehicleById(id);
        vehicle.setStatus(status.trim());
        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Long id) {
        Vehicle vehicle = getVehicleById(id);
        vehicleRepository.delete(vehicle);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getInventorySummary() {
        List<Vehicle> all = vehicleRepository.findAll();
        long totalCount = all.size();
        long availableCount = 0;
        long soldCount = 0;
        long inServiceCount = 0;
        long reservedCount = 0;
        double totalValue = 0.0;

        Map<String, Long> typeCounts = new HashMap<>();

        for (Vehicle v : all) {
            String s = v.getStatus() != null ? v.getStatus().toLowerCase() : "";
            if (s.contains("available")) availableCount++;
            else if (s.contains("sold")) soldCount++;
            else if (s.contains("service") || s.contains("maintenance")) inServiceCount++;
            else if (s.contains("reserved")) reservedCount++;

            if (v.getPrice() != null && v.getPrice() > 0) {
                totalValue += v.getPrice();
            }

            String type = v.getVehicleType() != null ? v.getVehicleType() : "Unknown";
            typeCounts.put(type, typeCounts.getOrDefault(type, 0L) + 1L);
        }

        double averagePrice = totalCount > 0 ? (totalValue / totalCount) : 0.0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalVehicles", totalCount);
        summary.put("availableVehicles", availableCount);
        summary.put("soldVehicles", soldCount);
        summary.put("inServiceVehicles", inServiceCount);
        summary.put("reservedVehicles", reservedCount);
        summary.put("totalInventoryValue", totalValue);
        summary.put("averagePrice", Math.round(averagePrice * 100.0) / 100.0);
        summary.put("typeBreakdown", typeCounts);

        return summary;
    }
}
