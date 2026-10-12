package com.vehicle.vehicle_svc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vehicle.vehicle_svc.model.Vehicle;
import com.vehicle.vehicle_svc.repository.VehicleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllVehicles() throws Exception {
        mockMvc.perform(get("/api/vehicles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", not(empty())));
    }

    @Test
    void testSearchAndFilterVehicles() throws Exception {
        mockMvc.perform(get("/api/vehicles?search=Honda&status=Available&type=Sedan"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void testGetInventorySummary() throws Exception {
        mockMvc.perform(get("/api/vehicles/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalVehicles", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.typeBreakdown").isMap());
    }

    @Test
    void testCreateVehicleValidationFailure() throws Exception {
        Vehicle invalidVehicle = new Vehicle(); // missing required fields
        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidVehicle)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.vin").exists())
                .andExpect(jsonPath("$.errors.make").exists());
    }

    @Test
    void testCreateVehicleDuplicateVinFailure() throws Exception {
        Vehicle existing = vehicleRepository.findAll().get(0);

        Vehicle duplicateVinVehicle = new Vehicle(
                existing.getVin(),
                "Chevrolet",
                "Malibu",
                2022,
                "White",
                "UNIQUE-PLATE-999",
                "Sedan",
                10000,
                20000.0,
                "Available",
                "Tester",
                "123"
        );

        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateVinVehicle)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error", is("Conflict")));
    }

    @Test
    void testFullCrudLifecycle() throws Exception {
        String testVin = "LIFECYCLE1234567";
        String testPlate = "LIFE-1234";

        vehicleRepository.findByVin(testVin).ifPresent(vehicleRepository::delete);

        // 1. CREATE
        Vehicle newVehicle = new Vehicle(
                testVin,
                "Mazda",
                "CX-5",
                2023,
                "Soul Red",
                testPlate,
                "SUV",
                11000,
                29500.0,
                "Available",
                "Kavita Rao",
                "+91 98760 12345"
        );

        String createResp = mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newVehicle)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.vin", is(testVin)))
                .andReturn().getResponse().getContentAsString();

        Vehicle created = objectMapper.readValue(createResp, Vehicle.class);
        Long id = created.getId();

        // 2. READ by ID & by VIN
        mockMvc.perform(get("/api/vehicles/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.model", is("CX-5")));

        mockMvc.perform(get("/api/vehicles/vin/" + testVin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.make", is("Mazda")));

        // 3. UPDATE (PUT)
        created.setModel("CX-5 Turbo");
        created.setPrice(32000.0);
        mockMvc.perform(put("/api/vehicles/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.model", is("CX-5 Turbo")))
                .andExpect(jsonPath("$.price", is(32000.0)));

        // 4. PATCH status
        mockMvc.perform(patch("/api/vehicles/" + id + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "Sold"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("Sold")));

        // 5. DELETE
        mockMvc.perform(delete("/api/vehicles/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));

        // Verify it no longer exists
        mockMvc.perform(get("/api/vehicles/" + id))
                .andExpect(status().isNotFound());
    }
}
