<?php
require_once 'connection.php';

try {
    echo "<h3>Setting up Projects Table...</h3>";

    $sql = "
    CREATE TABLE IF NOT EXISTS projects (
        projectkey VARCHAR(32) PRIMARY KEY,
        client_name VARCHAR(100) NOT NULL,
        client_email VARCHAR(100),
        client_phone VARCHAR(20),
        project_name VARCHAR(150) NOT NULL,
        domain_url VARCHAR(255),
        domain_expiry_date DATE,
        total_amount DECIMAL(10,2) DEFAULT 0.00,
        status ENUM('active', 'completed', 'canceled') DEFAULT 'active',
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(32),
        modified_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        modified_by VARCHAR(32)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    $conn->exec($sql);
    echo "<p>✅ 'projects' table created successfully!</p>";

} catch(PDOException $e) {
    echo "<p style='color:red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>
