<?php
// backend/api_save_lead.php
require_once 'connection.php';

// Allow CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$phone = $data['phone'] ?? '';
$project = $data['project'] ?? 'Demo Request';
$intent = $data['intent'] ?? '';

if (empty($name) || empty($email)) {
    echo json_encode(["success" => false, "message" => "Name and Email are required"]);
    exit();
}

try {
    $stmt = $conn->prepare("INSERT INTO leads (name, email, phone, project, intent) VALUES (:name, :email, :phone, :project, :intent)");
    $result = $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone,
        ':project' => $project,
        ':intent' => $intent
    ]);

    if ($result) {
        echo json_encode(["success" => true, "message" => "Inquiry received! We will contact you soon."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to save inquiry."]);
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Server Error: " . $e->getMessage()]);
}
?>
