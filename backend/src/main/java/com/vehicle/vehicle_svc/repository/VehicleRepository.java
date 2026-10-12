package com.vehicle.vehicle_svc.repository;

import com.vehicle.vehicle_svc.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByVin(String vin);

    Optional<Vehicle> findByLicensePlate(String licensePlate);

    boolean existsByVin(String vin);

    boolean existsByLicensePlate(String licensePlate);

    @Query("SELECT v FROM Vehicle v WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           " LOWER(v.make) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(v.model) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(v.vin) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(v.licensePlate) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " COALESCE(LOWER(v.color), '') LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " COALESCE(LOWER(v.ownerName), '') LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR :status = '' OR LOWER(v.status) = LOWER(:status)) AND " +
           "(:vehicleType IS NULL OR :vehicleType = '' OR LOWER(v.vehicleType) = LOWER(:vehicleType)) " +
           "ORDER BY v.id DESC")
    List<Vehicle> searchAndFilter(
            @Param("query") String query,
            @Param("status") String status,
            @Param("vehicleType") String vehicleType
    );

    long countByStatusIgnoreCase(String status);
}
