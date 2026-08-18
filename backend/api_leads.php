<?php
// backend/api_leads.php
require_once 'connection.php';

// Allow CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

try {
    if ($method === 'DELETE') {
        $id = $_GET['id'] ?? '';
        if (!$id) {
            echo json_encode(["success" => false, "message" => "Missing lead ID"]);
            exit();
        }
        
        $stmt = $conn->prepare("DELETE FROM leads WHERE id = :id");
        $stmt->execute([':id' => $id]);
        
        echo json_encode(["success" => true, "message" => "Lead deleted successfully"]);
        exit();
    }

    if ($method === 'POST') {
        $action = $data['action'] ?? '';
        $id = $data['id'] ?? '';
        
        if ($action === 'MARK_READ' && $id) {
            $stmt = $conn->prepare("UPDATE leads SET is_read = 1 WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(["success" => true, "message" => "Lead marked as read"]);
            exit();
        }
    }
    
    // Default GET behavior
    // Basic session verification (Optional: Add more robust token checking)
    // For now, we fetch all leads ordered by most recent
    $stmt = $conn->query("SELECT * FROM leads ORDER BY created_at DESC");
    $leads = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "data" => $leads
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false, 
        "message" => "Failed to fetch leads: " . $e->getMessage()
    ]);
}
?>
