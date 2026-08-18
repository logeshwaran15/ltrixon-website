-- Ltrixon Database Schema
-- Database: ltrixon (create this if not exists)

CREATE TABLE IF NOT EXISTS users (
    userkey VARCHAR(32) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserting default admin data
INSERT INTO users (userkey, username, password, email) 
VALUES ('b4f1c9e2d3a5b6c7e8f9a0b1c2d3e4f5', 'admin', 'password123', 'admin@ltrixon.com')
ON DUPLICATE KEY UPDATE username=username;

