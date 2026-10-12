package com.vehicle.vehicle_svc.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@Tag(name = "Health Check API", description = "Endpoints for service and database health status")
public class HealthController {

    private final DataSource dataSource;

    @Autowired
    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping({"/health", "/api/health"})
    @Operation(summary = "Service Health Check", description = "Checks application status and database connectivity")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "vehicle-svc");
        status.put("timestamp", Instant.now().toString());

        try (Connection connection = dataSource.getConnection()) {
            boolean valid = connection.isValid(2);
            status.put("database", valid ? "CONNECTED" : "UNREACHABLE");
            status.put("databaseProduct", connection.getMetaData().getDatabaseProductName());
        } catch (Exception e) {
            status.put("database", "DISCONNECTED");
            status.put("databaseError", e.getMessage());
            return ResponseEntity.status(503).body(status);
        }

        return ResponseEntity.ok(status);
    }
}
