<?php
require_once 'connection.php';

try {
    $sqls = [
        "ALTER TABLE projects ADD COLUMN username VARCHAR(100) NULL",
        "ALTER TABLE projects ADD COLUMN password VARCHAR(255) NULL",
        "ALTER TABLE projects ADD COLUMN ssl_expiry_date DATE NULL",
        "ALTER TABLE projects ADD COLUMN server_expiry_date DATE NULL",
        "ALTER TABLE projects ADD COLUMN client_address TEXT NULL",
        "ALTER TABLE projects ADD COLUMN project_description TEXT NULL"
    ];

    foreach ($sqls as $sql) {
        try {
            $conn->exec($sql);
            echo "Successfully executed: $sql\n";
        } catch (PDOException $e) {
            echo "Skipped/Error on ($sql): " . $e->getMessage() . "\n";
        }
    }
    echo "Migration completed.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
