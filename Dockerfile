# ==============================================================================
# Multi-stage Dockerfile: React Frontend + Spring Boot Backend (Single Container)
# ==============================================================================

# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Spring Boot Application
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B
COPY backend/src ./src
# Copy built frontend assets into Spring Boot static directory
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static
RUN mvn clean package -DskipTests -B

# Stage 3: Lightweight Production JRE Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
