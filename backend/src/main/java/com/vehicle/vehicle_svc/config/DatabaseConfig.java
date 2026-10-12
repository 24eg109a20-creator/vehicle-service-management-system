package com.vehicle.vehicle_svc.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url}")
    private String configuredUrl;

    @Value("${spring.datasource.username:}")
    private String configuredUsername;

    @Value("${spring.datasource.password:}")
    private String configuredPassword;

    @Value("${spring.datasource.driver-class-name:}")
    private String configuredDriver;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();

        String rawUrl = configuredUrl.trim();
        String username = configuredUsername;
        String password = configuredPassword;
        String driver = configuredDriver;

        // Seamlessly convert standard cloud URI (postgres:// or postgresql://) to JDBC format
        if (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://")) {
            try {
                URI uri = new URI(rawUrl);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    password = parts[1];
                }
                int port = uri.getPort() != -1 ? uri.getPort() : 5432;
                String path = uri.getPath();
                if (path != null && path.startsWith("/")) {
                    path = path.substring(1);
                }
                rawUrl = String.format("jdbc:postgresql://%s:%d/%s", uri.getHost(), port, path);
                driver = "org.postgresql.Driver";
                log.info("Converted cloud PostgreSQL URI to JDBC URL: jdbc:postgresql://{}:{}/{}", uri.getHost(), port, path);
            } catch (Exception e) {
                log.warn("Could not parse cloud PostgreSQL URI: {}. Proceeding with raw URL.", e.getMessage());
            }
        }

        config.setJdbcUrl(rawUrl);
        if (username != null && !username.isBlank()) {
            config.setUsername(username);
        }
        if (password != null && !password.isBlank()) {
            config.setPassword(password);
        }
        if (driver != null && !driver.isBlank()) {
            config.setDriverClassName(driver);
        }

        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        return new HikariDataSource(config);
    }
}
