package com.vehicle.vehicle_svc.controller;

import com.vehicle.vehicle_svc.model.Vehicle;
import com.vehicle.vehicle_svc.service.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
@Tag(name = "Vehicle Management API", description = "REST APIs for CRUD operations on vehicle records")
public class VehicleController {

    private final VehicleService vehicleService;

    @Autowired
    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    @Operation(summary = "Get all vehicles", description = "Retrieve list of all vehicles with optional search query and filters")
    public ResponseEntity<List<Vehicle>> getAllVehicles(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type) {
        List<Vehicle> vehicles = vehicleService.getAllVehicles(search, status, type);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get vehicle by ID", description = "Fetch a single vehicle record by its unique database ID")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        Vehicle vehicle = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(vehicle);
    }

    @GetMapping("/vin/{vin}")
    @Operation(summary = "Get vehicle by VIN", description = "Fetch a vehicle record using its Vehicle Identification Number")
    public ResponseEntity<Vehicle> getVehicleByVin(@PathVariable String vin) {
        Vehicle vehicle = vehicleService.getVehicleByVin(vin);
        return ResponseEntity.ok(vehicle);
    }

    @GetMapping("/summary")
    @Operation(summary = "Get inventory summary", description = "Calculate totals, status counts, and inventory values")
    public ResponseEntity<Map<String, Object>> getInventorySummary() {
        Map<String, Object> summary = vehicleService.getInventorySummary();
        return ResponseEntity.ok(summary);
    }

    @PostMapping
    @Operation(summary = "Create vehicle", description = "Add a new vehicle record to the database")
    public ResponseEntity<Vehicle> createVehicle(@Valid @RequestBody Vehicle vehicle) {
        Vehicle created = vehicleService.createVehicle(vehicle);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update vehicle", description = "Update an existing vehicle's details by ID")
    public ResponseEntity<Vehicle> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody Vehicle vehicle) {
        Vehicle updated = vehicleService.updateVehicle(id, vehicle);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update vehicle status", description = "Quickly update the status of a vehicle")
    public ResponseEntity<Vehicle> updateVehicleStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        Vehicle updated = vehicleService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete vehicle", description = "Remove a vehicle record by ID")
    public ResponseEntity<Map<String, Object>> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Vehicle record with ID " + id + " was deleted successfully.");
        return ResponseEntity.ok(response);
    }
}
