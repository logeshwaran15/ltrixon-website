<?php
// backend/api_projects.php
require_once 'connection.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $action = isset($_GET['action']) ? $_GET['action'] : 'all';
        
        if ($action === 'expiring') {
            // Fetch domains expiring in less than 30 days
            $stmt = $conn->query("SELECT * FROM projects WHERE domain_expiry_date IS NOT NULL AND status != 'canceled' AND DATEDIFF(domain_expiry_date, CURDATE()) BETWEEN 0 AND 30 ORDER BY domain_expiry_date ASC");
            $projects = $stmt->fetchAll();
        } else {
            $stmt = $conn->query("SELECT * FROM projects ORDER BY created_on DESC");
            $projects = $stmt->fetchAll();
        }
        
        echo json_encode(["success" => true, "data" => $projects]);
        
    } elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $projectkey = md5(uniqid(rand(), true));
        $client_name = $data['client_name'] ?? '';
        $client_email = $data['client_email'] ?? '';
        $client_phone = $data['client_phone'] ?? '';
        $project_name = $data['project_name'] ?? '';
        $domain_url = $data['domain_url'] ?? '';
        $domain_expiry_date = !empty($data['domain_expiry_date']) ? $data['domain_expiry_date'] : null;
        $total_amount = $data['total_amount'] ?? 0;
        $status = $data['status'] ?? 'active';
        $created_by = $data['userkey'] ?? 'admin';
        
        $username = $data['username'] ?? null;
        $password = $data['password'] ?? null;
        $ssl_expiry_date = !empty($data['ssl_expiry_date']) ? $data['ssl_expiry_date'] : null;
        $server_expiry_date = !empty($data['server_expiry_date']) ? $data['server_expiry_date'] : null;
        $client_address = $data['client_address'] ?? null;
        $project_description = $data['project_description'] ?? null;
        
        $sql = "INSERT INTO projects (projectkey, client_name, client_email, client_phone, project_name, domain_url, domain_expiry_date, total_amount, status, created_by, username, password, ssl_expiry_date, server_expiry_date, client_address, project_description) 
                VALUES (:projectkey, :client_name, :client_email, :client_phone, :project_name, :domain_url, :domain_expiry_date, :total_amount, :status, :created_by, :username, :password, :ssl_expiry_date, :server_expiry_date, :client_address, :project_description)";
        
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':projectkey' => $projectkey,
            ':client_name' => $client_name,
            ':client_email' => $client_email,
            ':client_phone' => $client_phone,
            ':project_name' => $project_name,
            ':domain_url' => $domain_url,
            ':domain_expiry_date' => $domain_expiry_date,
            ':total_amount' => $total_amount,
            ':status' => $status,
            ':created_by' => $created_by,
            ':username' => $username,
            ':password' => $password,
            ':ssl_expiry_date' => $ssl_expiry_date,
            ':server_expiry_date' => $server_expiry_date,
            ':client_address' => $client_address,
            ':project_description' => $project_description
        ]);
        
        echo json_encode(["success" => true, "message" => "Project created successfully", "projectkey" => $projectkey]);
        
    } elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $projectkey = $data['projectkey'] ?? '';
        if (!$projectkey) {
            echo json_encode(["success" => false, "message" => "Missing projectkey"]);
            exit();
        }
        
        $client_name = $data['client_name'] ?? '';
        $client_email = $data['client_email'] ?? '';
        $client_phone = $data['client_phone'] ?? '';
        $project_name = $data['project_name'] ?? '';
        $domain_url = $data['domain_url'] ?? '';
        $domain_expiry_date = !empty($data['domain_expiry_date']) ? $data['domain_expiry_date'] : null;
        $total_amount = $data['total_amount'] ?? 0;
        $status = $data['status'] ?? 'active';
        $modified_by = $data['userkey'] ?? 'admin';
        
        $username = $data['username'] ?? null;
        $password = $data['password'] ?? null;
        $ssl_expiry_date = !empty($data['ssl_expiry_date']) ? $data['ssl_expiry_date'] : null;
        $server_expiry_date = !empty($data['server_expiry_date']) ? $data['server_expiry_date'] : null;
        $client_address = $data['client_address'] ?? null;
        $project_description = $data['project_description'] ?? null;
        
        $sql = "UPDATE projects SET 
                client_name = :client_name,
                client_email = :client_email,
                client_phone = :client_phone,
                project_name = :project_name,
                domain_url = :domain_url,
                domain_expiry_date = :domain_expiry_date,
                total_amount = :total_amount,
                status = :status,
                modified_by = :modified_by,
                username = :username,
                password = :password,
                ssl_expiry_date = :ssl_expiry_date,
                server_expiry_date = :server_expiry_date,
                client_address = :client_address,
                project_description = :project_description
                WHERE projectkey = :projectkey";
                
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':client_name' => $client_name,
            ':client_email' => $client_email,
            ':client_phone' => $client_phone,
            ':project_name' => $project_name,
            ':domain_url' => $domain_url,
            ':domain_expiry_date' => $domain_expiry_date,
            ':total_amount' => $total_amount,
            ':status' => $status,
            ':modified_by' => $modified_by,
            ':username' => $username,
            ':password' => $password,
            ':ssl_expiry_date' => $ssl_expiry_date,
            ':server_expiry_date' => $server_expiry_date,
            ':client_address' => $client_address,
            ':project_description' => $project_description,
            ':projectkey' => $projectkey
        ]);
        
        echo json_encode(["success" => true, "message" => "Project updated successfully"]);
        
    } elseif ($method === 'DELETE') {
        $projectkey = $_GET['projectkey'] ?? '';
        if (!$projectkey) {
            echo json_encode(["success" => false, "message" => "Missing projectkey"]);
            exit();
        }
        
        $stmt = $conn->prepare("DELETE FROM projects WHERE projectkey = :projectkey");
        $stmt->execute([':projectkey' => $projectkey]);
        
        echo json_encode(["success" => true, "message" => "Project deleted successfully"]);
    }
    
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database Error: " . $e->getMessage()]);
}
?>
