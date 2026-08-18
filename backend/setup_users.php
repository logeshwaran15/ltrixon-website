<?php
require_once 'connection.php';

try {
    echo "<h3>Setting up Admin Users Table...</h3>";

    // 1. Create the `users` table
    $sql = "
    CREATE TABLE IF NOT EXISTS users (
        userkey VARCHAR(32) PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    $conn->exec($sql);
    echo "<p>✅ 'users' table created successfully (or already exists).</p>";

    // 2. Check if a default admin exists, if not create one
    $stmt = $conn->query("SELECT COUNT(*) FROM users WHERE username = 'admin'");
    if ($stmt->fetchColumn() == 0) {
        
        $userkey = md5(uniqid(rand(), true));
        $username = 'admin';
        $password = 'password123';
        
        $insertStmt = $conn->prepare("INSERT INTO users (userkey, username, password) VALUES (:userkey, :username, :pass)");
        $insertStmt->execute([
            ':userkey' => $userkey,
            ':username' => $username,
            ':pass' => $password
        ]);
        
        echo "<p>✅ Default Admin User created!</p>";
        echo "<p><strong>Username:</strong> admin<br><strong>Password:</strong> password123</p>";
        echo "<p><i>(Please change this password when you log into the admin panel!)</i></p>";
    } else {
        echo "<p>ℹ️ Admin user already exists. Skipping creation.</p>";
    }

} catch(PDOException $e) {
    echo "<p style='color:red;'>❌ Error: " . $e->getMessage() . "</p>";
}
?>
