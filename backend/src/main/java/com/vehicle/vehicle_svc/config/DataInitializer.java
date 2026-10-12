package com.vehicle.vehicle_svc.config;

import com.vehicle.vehicle_svc.model.Vehicle;
import com.vehicle.vehicle_svc.repository.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(VehicleRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                List<Vehicle> sampleVehicles = List.of(
                        new Vehicle(
                                "1HGCR2F83HA123456",
                                "Honda",
                                "Accord",
                                2022,
                                "Modern Steel",
                                "MH01-AB-1234",
                                "Sedan",
                                24500,
                                27500.0,
                                "Available",
                                "Rahul Sharma",
                                "+91 98765 43210"
                        ),
                        new Vehicle(
                                "1FTFW1E84KFA98765",
                                "Ford",
                                "F-150",
                                2023,
                                "Oxford White",
                                "DL03-CD-5678",
                                "Truck",
                                14200,
                                44900.0,
                                "In Service",
                                "Amit Verma",
                                "+91 91234 56789"
                        ),
                        new Vehicle(
                                "5YJ3E1EB9NF112233",
                                "Tesla",
                                "Model 3",
                                2024,
                                "Solid Black",
                                "KA05-EF-9012",
                                "Electric",
                                8500,
                                38990.0,
                                "Available",
                                "Priya Nair",
                                "+91 99887 76655"
                        ),
                        new Vehicle(
                                "4T1B11HK5KU334455",
                                "Toyota",
                                "Camry",
                                2021,
                                "Celestial Silver",
                                "TN07-GH-3456",
                                "Sedan",
                                39000,
                                23800.0,
                                "Sold",
                                "Suresh Kumar",
                                "+91 97654 32109"
                        ),
                        new Vehicle(
                                "WAUZZZF27NA556677",
                                "Audi",
                                "Q5",
                                2023,
                                "Navarra Blue",
                                "TS09-IJ-7890",
                                "SUV",
                                19800,
                                48500.0,
                                "Reserved",
                                "Ananya Roy",
                                "+91 98321 09876"
                        )
                );

                repository.saveAll(sampleVehicles);
                System.out.println(">>> Sample vehicles seeded into MySQL database successfully!");
            }
        };
    }
}
