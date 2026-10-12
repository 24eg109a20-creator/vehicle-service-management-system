package com.vehicle.vehicle_svc.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "VIN is required")
    @Size(min = 11, max = 17, message = "VIN must be between 11 and 17 characters")
    @Column(name = "vin", nullable = false, unique = true, length = 17)
    private String vin;

    @NotBlank(message = "Make is required")
    @Column(name = "make", nullable = false)
    private String make;

    @NotBlank(message = "Model is required")
    @Column(name = "model", nullable = false)
    private String model;

    @NotNull(message = "Year is required")
    @Min(value = 1900, message = "Year must be greater than or equal to 1900")
    @Max(value = 2100, message = "Year must be valid")
    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "color")
    private String color;

    @NotBlank(message = "License plate is required")
    @Column(name = "license_plate", nullable = false, unique = true, length = 20)
    private String licensePlate;

    @NotBlank(message = "Vehicle type is required")
    @Column(name = "vehicle_type", nullable = false, length = 30)
    private String vehicleType;

    @Min(value = 0, message = "Mileage cannot be negative")
    @Column(name = "mileage")
    private Integer mileage;

    @DecimalMin(value = "0.0", message = "Price cannot be negative")
    @Column(name = "price")
    private Double price;

    @NotBlank(message = "Status is required")
    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "owner_name")
    private String ownerName;

    @Column(name = "owner_contact")
    private String ownerContact;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Vehicle() {
    }

    public Vehicle(String vin, String make, String model, Integer year, String color,
                   String licensePlate, String vehicleType, Integer mileage, Double price,
                   String status, String ownerName, String ownerContact) {
        this.vin = vin;
        this.make = make;
        this.model = model;
        this.year = year;
        this.color = color;
        this.licensePlate = licensePlate;
        this.vehicleType = vehicleType;
        this.mileage = mileage;
        this.price = price;
        this.status = status;
        this.ownerName = ownerName;
        this.ownerContact = ownerContact;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null || this.status.isBlank()) {
            this.status = "Available";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVin() {
        return vin;
    }

    public void setVin(String vin) {
        this.vin = vin != null ? vin.toUpperCase().trim() : null;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate != null ? licensePlate.toUpperCase().trim() : null;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public Integer getMileage() {
        return mileage;
    }

    public void setMileage(Integer mileage) {
        this.mileage = mileage;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getOwnerContact() {
        return ownerContact;
    }

    public void setOwnerContact(String ownerContact) {
        this.ownerContact = ownerContact;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
