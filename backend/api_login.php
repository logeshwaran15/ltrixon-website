<?php
// Allow CORS for React frontend (Must be at the very top)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'connection.php';

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Missing credentials"]);
    exit();
}

try {
    $stmt = $conn->prepare("SELECT userkey, password FROM users WHERE username = :username LIMIT 1");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    
    $user = $stmt->fetch();

    if ($user && $password === $user['password']) {
        // Login successful
        echo json_encode([
            "success" => true, 
            "message" => "Login successful",
            "session_token" => bin2hex(random_bytes(16)), // Simple token for frontend auth
            "userkey" => $user['userkey']
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid username or password"]);
    }
} catch (PDOException $e) {
    error_log("Login Error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Server error during login."]);
}
?>
