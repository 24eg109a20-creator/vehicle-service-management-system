import React from 'react';

export default function Navbar({ isBackendConnected }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div>
          <div className="brand-title">
            <span>🚗</span>
            <span>Vehicle Records Management</span>
          </div>
          <div className="brand-subtitle">
            Enterprise Fleet &amp; Inventory CRUD Operations System
          </div>
        </div>

        <div className="tech-badges">
          <span className="tech-pill">Java 21</span>
          <span className="tech-pill">Spring Boot 3</span>
          <span className="tech-pill">MySQL 8.4</span>
          <span className="tech-pill">React.js</span>
          <span className="tech-pill">REST API</span>
          <span className={`tech-pill ${isBackendConnected ? 'active' : ''}`}>
            {isBackendConnected ? '● Backend Online' : '○ Backend Connecting...'}
          </span>
        </div>
      </div>
    </header>
  );
}
