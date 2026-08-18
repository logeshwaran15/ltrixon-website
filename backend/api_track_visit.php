<?php
// backend/api_track_visit.php
require_once 'connection.php';

// Allow CORS from any origin for tracking
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Create table if not exists
    $conn->exec("CREATE TABLE IF NOT EXISTS site_visits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        visit_date DATE NOT NULL,
        visit_time TIME NOT NULL,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $ip = $_SERVER['REMOTE_ADDR'];
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $today = date('Y-m-d');
    $time = date('H:i:s');

    // To prevent "duplicate counts" for the same user in a single day, we check if IP already visited today
    $stmt = $conn->prepare("SELECT id FROM site_visits WHERE ip_address = :ip AND visit_date = :today LIMIT 1");
    $stmt->execute([':ip' => $ip, ':today' => $today]);
    $exists = $stmt->fetch();

    if (!$exists) {
        $ins = $conn->prepare("INSERT INTO site_visits (ip_address, visit_date, visit_time, user_agent) VALUES (:ip, :today, :time, :ua)");
        $ins->execute([
            ':ip' => $ip,
            ':today' => $today,
            ':time' => $time,
            ':ua' => $ua
        ]);
        echo json_encode(["success" => true, "message" => "Unique visit logged"]);
    } else {
        echo json_encode(["success" => true, "message" => "Returning visitor"]);
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Tracking Error: " . $e->getMessage()]);
}
?>
