<?php
// backend/api_metadata.php
require_once 'connection.php';

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
    // Ensure table exists
    $conn->exec("CREATE TABLE IF NOT EXISTS site_metadata (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_name VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(255),
        description TEXT,
        keywords TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");

    if ($method === 'GET') {
        $stmt = $conn->query("SELECT * FROM site_metadata");
        $results = $stmt->fetchAll();
        
        // Seed default if empty
        if (empty($results)) {
            $conn->exec("INSERT INTO site_metadata (page_name, title, description, keywords) VALUES 
                ('home', 'Ltrixon | Creative Agency', 'Modern web design and development services.', 'web design, ltrixon, development'),
                ('about', 'About Ltrixon', 'Learn more about our creative journey.', 'about, agency, mission')
            ");
            $results = $conn->query("SELECT * FROM site_metadata")->fetchAll();
        }
        
        echo json_encode(["success" => true, "data" => $results]);
        exit();
    }

    if ($method === 'POST') {
        $id = $data['id'] ?? null;
        $title = $data['title'] ?? '';
        $description = $data['description'] ?? '';
        $keywords = $data['keywords'] ?? '';

        if (!$id) {
            echo json_encode(["success" => false, "message" => "Missing metadata ID"]);
            exit();
        }

        $stmt = $conn->prepare("UPDATE site_metadata SET title = :title, description = :desc, keywords = :key WHERE id = :id");
        $stmt->execute([
            ':title' => $title,
            ':desc' => $description,
            ':key' => $keywords,
            ':id' => $id
        ]);

        echo json_encode(["success" => true, "message" => "SEO Metadata updated successfully"]);
        exit();
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Metadata Error: " . $e->getMessage()]);
}
?>
