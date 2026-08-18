<?php
// backend/api_admin_settings.php
require_once 'connection.php';

// Allow CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

try {
    // Automated Schema Setup: Ensure analytics table exists
    $conn->exec("CREATE TABLE IF NOT EXISTS site_visits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        visit_date DATE NOT NULL,
        visit_time TIME NOT NULL,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_date (visit_date),
        INDEX idx_ip (ip_address)
    )");

    if ($method === 'POST') {
        $action = $data['action'] ?? '';
        
        if ($action === 'CHANGE_PASSWORD') {
            $userkey = $data['userkey'] ?? '';
            $currentPassword = $data['currentPassword'] ?? '';
            $newPassword = $data['newPassword'] ?? '';
            
            if (!$userkey || !$currentPassword || !$newPassword) {
                echo json_encode(["success" => false, "message" => "Missing required fields"]);
                exit();
            }
            
            // Verify current password
            $stmt = $conn->prepare("SELECT password FROM users WHERE userkey = :uk LIMIT 1");
            $stmt->execute([':uk' => $userkey]);
            $user = $stmt->fetch();
            
            if (!$user || $user['password'] !== $currentPassword) {
                echo json_encode(["success" => false, "message" => "Current password incorrect"]);
                exit();
            }
            
            // Update password
            $uStmt = $conn->prepare("UPDATE users SET password = :np WHERE userkey = :uk");
            $uStmt->execute([':np' => $newPassword, ':uk' => $userkey]);
            
            echo json_encode(["success" => true, "message" => "Password updated successfully"]);
            exit();
        }
    }
    
    if ($method === 'GET') {
        // Fetch system metadata
        $pCount = $conn->query("SELECT COUNT(*) FROM projects")->fetchColumn();
        $lCount = $conn->query("SELECT COUNT(*) FROM leads")->fetchColumn();
        
        // Fetch visit stats
        $today = date('Y-m-d');
        $month = date('Y-m');
        
        $todayVisits = $conn->query("SELECT COUNT(DISTINCT ip_address) FROM site_visits WHERE visit_date = '$today'")->fetchColumn();
        $monthVisits = $conn->query("SELECT COUNT(DISTINCT ip_address) FROM site_visits WHERE visit_date LIKE '$month%'")->fetchColumn();
        
        // Simulate "Live" as visitors in the last 5 minutes
        $fiveMinsAgo = date('H:i:s', strtotime('-5 minutes'));
        $liveCount = $conn->query("SELECT COUNT(DISTINCT ip_address) FROM site_visits WHERE visit_date = '$today' AND visit_time >= '$fiveMinsAgo'")->fetchColumn();

        echo json_encode([
            "success" => true,
            "data" => [
                "system_name" => "Ltrixon CRM Core",
                "version" => "2.1.0-stable",
                "status" => "Healthy",
                "db_stats" => [
                    "projects" => $pCount,
                    "leads" => $lCount,
                    "visits_today" => $todayVisits,
                    "visits_month" => $monthVisits,
                    "live_now" => max(1, (int)$liveCount) // Ensure at least 1 (the admin)
                ]
            ]
        ]);
        exit();
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Settings Error: " . $e->getMessage()]);
}
?>
