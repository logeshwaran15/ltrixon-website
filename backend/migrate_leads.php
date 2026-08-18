<?php
// backend/migrate_leads.php
require_once 'connection.php';

try {
    echo "<h3>Migrating Leads Table...</h3>";

    // Add is_read column if it doesn't exist
    $sql = "ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_read TINYINT(1) DEFAULT 0";
    
    $conn->exec($sql);
    echo "<p>✅ 'is_read' column added successfully (or already exists)!</p>";

} catch(PDOException $e) {
    if (strpos($e->getMessage(), "Duplicate column name") !== false) {
        echo "<p>ℹ️ Column already exists, skipping.</p>";
    } else {
        echo "<p style='color:red;'>❌ Error: " . $e->getMessage() . "</p>";
    }
}
?>
