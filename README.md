# 🚗 Vehicle Records Management System

A full-stack enterprise web application for managing vehicle records with complete CRUD operations, database persistence, RESTful API architecture, interactive Postman collection, and a fast, clean, zero-animation React interface.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Backend** | **Java 21 + Spring Boot 3.3.5** | Spring Data JPA, Hibernate, Hibernate Validator, SpringDoc OpenAPI |
| **Frontend** | **React.js 18 + Vite** | Functional Components, Hooks, Zero-Animation Simple CSS |
| **Database** | **MySQL 8.4** | Database: `vehicle_db`, table: `vehicles` |
| **API Architecture** | **REST API** | Standard HTTP status codes (200, 201, 400, 404, 409) |
| **API Testing** | **Postman** | Ready-to-import Postman Collection & Environment JSON files |
| **API Docs** | **Swagger / OpenAPI 3** | Interactive UI at `http://localhost:8080/swagger-ui.html` |

---

## 📁 Project Structure

```
vehicle svc/
├── backend/                               # Spring Boot Application
│   ├── src/main/java/com/vehicle/vehicle_svc/
│   │   ├── config/
│   │   │   ├── CorsConfig.java            # Cross-Origin Resource Sharing settings
│   │   │   └── DataInitializer.java       # Automatic database sample seeder
│   │   ├── controller/
│   │   │   └── VehicleController.java     # REST API Controller (@RestController)
│   │   ├── exception/
│   │   │   ├── DuplicateResourceException.java
│   │   │   ├── ResourceNotFoundException.java
│   │   │   └── GlobalExceptionHandler.java# Centralized REST error handling
│   │   ├── model/
│   │   │   └── Vehicle.java               # JPA Entity mapping to MySQL
│   │   ├── repository/
│   │   │   └── VehicleRepository.java     # Spring Data JPA Repository
│   │   ├── service/
│   │   │   └── VehicleService.java        # Core business & validation logic
│   │   └── VehicleSvcApplication.java     # Spring Boot application entry point
│   ├── src/main/resources/
│   │   └── application.properties         # Database connection configuration
│   ├── src/test/java/                     # Integration tests with MockMvc
│   ├── pom.xml                            # Maven project configuration
│   └── mvnw                               # Maven wrapper script
├── frontend/                              # React.js Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                 # System header with status indicator
│   │   │   ├── StatsBar.jsx               # Fleet metrics & inventory value cards
│   │   │   ├── VehicleTable.jsx           # Clean tabular display with action buttons
│   │   │   ├── VehicleFormModal.jsx       # Modal for Create and Edit operations
│   │   │   ├── VehicleDetailsModal.jsx    # Modal for full vehicle specification
│   │   │   └── DeleteConfirmModal.jsx     # Safe deletion confirmation modal
│   │   ├── services/
│   │   │   └── vehicleService.js          # REST API client
│   │   ├── App.jsx                        # Main state and interaction orchestrator
│   │   ├── index.css                      # Simple, crisp, zero-animation stylesheet
│   │   └── main.jsx                       # React root render
│   ├── package.json
│   └── vite.config.js                     # Vite dev server with proxy to port 8080
├── postman/
│   ├── Vehicle_Management_API.postman_collection.json # 10 pre-built test requests
│   └── Vehicle_Management.postman_environment.json   # Environment variables
├── run-backend.sh                         # Quick script to start Spring Boot
├── run-frontend.sh                        # Quick script to start React app
└── README.md
```

---

## 🗄️ MySQL Database Setup

1. **Database Name:** `vehicle_db`
2. **Default Port:** `3306`
3. **Database User:** `root`
4. **Password:** `12345678` (configured in `backend/src/main/resources/application.properties`)

The application automatically creates the schema on startup using Hibernate:

```sql
CREATE DATABASE IF NOT EXISTS vehicle_db;
```

Entity Fields in table `vehicles`:
- `id` (BIGINT, Primary Key, Auto-increment)
- `vin` (VARCHAR(17), Unique, Not Null)
- `make` (VARCHAR(255), Not Null)
- `model` (VARCHAR(255), Not Null)
- `year` (INT, 1900 - 2100, Not Null)
- `color` (VARCHAR(255))
- `license_plate` (VARCHAR(20), Unique, Not Null)
- `vehicle_type` (VARCHAR(30), Not Null)
- `mileage` (INT, >= 0)
- `price` (DOUBLE, >= 0.0)
- `status` (VARCHAR(30), Not Null: `Available`, `In Service`, `Reserved`, `Sold`)
- `owner_name` (VARCHAR(255))
- `owner_contact` (VARCHAR(255))
- `created_at` (DATETIME(6), Not Null)
- `updated_at` (DATETIME(6))

---

## 🚀 How to Run

### Option 1: 🌐 Run Online (Public Internet URL - Not Localhost!)
Make your full-stack application instantly accessible to anyone on the internet (mobile phones, external PCs, evaluators):
```bash
./run-online.sh
```
This script:
1. Automatically connects and compiles the React frontend into Spring Boot's static resources.
2. Launches Spring Boot as a unified full-stack application on port 8080.
3. Automatically sets up a secure public HTTPS tunnel (via Cloudflare / Localtunnel).
4. Prints your **Public Internet URL** (e.g. `https://xxxx.trycloudflare.com` or `https://xxxx.loca.lt`) and your **Local Wi-Fi LAN URL** (e.g. `http://192.168.x.x:8080`).

### Option 2: 💻 Local Development Start (Two Servers)
Launch both Spring Boot backend (port 8080) and React frontend with Vite HMR (port 3000):
```bash
./start-all.sh
```
Press `Ctrl+C` in the terminal to stop both servers at any time.

### Option 3: Run Services Individually

#### 1. Launch Spring Boot Backend
```bash
./run-backend.sh
```
- Backend starts at: **`http://localhost:8080`**
- Swagger UI available at: **`http://localhost:8080/swagger-ui.html`**

#### 2. Launch React Frontend
```bash
./run-frontend.sh
```
- Frontend starts at: **`http://localhost:3000`**

### Option 4: 🐳 Run with Docker (Cloud / Production)
Run the entire application and MySQL database in isolated containers:
```bash
docker-compose up --build
```
Access at `http://localhost:8080`.


---

## 📡 REST API Reference

| Method | Endpoint | Description | Request Body | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/vehicles` | List vehicles (supports `?search=`, `?status=`, `?type=`) | None | `200 OK` |
| **GET** | `/api/vehicles/{id}` | Get vehicle by primary key ID | None | `200 OK` / `404 Not Found` |
| **GET** | `/api/vehicles/vin/{vin}` | Get vehicle by unique VIN | None | `200 OK` / `404 Not Found` |
| **GET** | `/api/vehicles/summary` | Get fleet metrics and totals | None | `200 OK` |
| **POST** | `/api/vehicles` | Create new vehicle record | JSON `Vehicle` object | `201 Created` / `400 Bad Request` / `409 Conflict` |
| **PUT** | `/api/vehicles/{id}` | Full update of existing record | JSON `Vehicle` object | `200 OK` / `400 Bad Request` / `404 Not Found` |
| **PATCH** | `/api/vehicles/{id}/status` | Quick status change | `{"status": "Sold"}` | `200 OK` / `404 Not Found` |
| **DELETE** | `/api/vehicles/{id}` | Delete vehicle record | None | `200 OK` / `404 Not Found` |

### Sample POST Request Payload:
```json
{
  "vin": "3VW2B7AJ9KM654321",
  "make": "Volkswagen",
  "model": "Jetta GLI",
  "year": 2024,
  "color": "Pure Gray",
  "licensePlate": "KA01-ZX-4321",
  "vehicleType": "Sedan",
  "mileage": 3500,
  "price": 31500.00,
  "status": "Available",
  "ownerName": "Deepak Joshi",
  "ownerContact": "+91 98888 11223"
}
```

---

## 📬 Postman Collection Setup

1. Open **Postman**.
2. Click **Import** (top left).
3. Select the file:
   - `postman/Vehicle_Management_API.postman_collection.json`
   - `postman/Vehicle_Management.postman_environment.json`
4. Select the environment **"Vehicle Management - Localhost"** from the environment dropdown in Postman.
5. Execute requests:
   - **1. GET All Vehicles**
   - **2. GET Filter & Search Vehicles**
   - **3. GET Vehicle by ID**
   - **4. GET Vehicle by VIN**
   - **5. GET Inventory Summary**
   - **6. POST Create New Vehicle** (automatically captures the created ID)
   - **7. PUT Update Vehicle by ID**
   - **8. PATCH Update Vehicle Status**
   - **9. DELETE Vehicle by ID**
   - **10. Validation Failure Test**

---

## 🎨 UI Design & Features

As specifically requested, the interface adheres to a **simple, high-performance, zero-animation** design:
- **No Animations / Transitions:** Completely free of CSS transitions, `@keyframes`, or moving animations (`transition: none !important; animation: none !important;`).
- **Snappy Responsiveness:** Instant modal popups and table rendering without delay or fading.
- **Search & Filters:** Real-time multi-field search (make, model, VIN, plate, owner) + type filter + status filter.
- **Fleet Dashboard:** At-a-glance status counts (Available, In Service, Sold) and valuation.
- **Data Protection:** Explicit confirmation modal before record deletion.
