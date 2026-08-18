<?php
/**
 * Mama AI: Dynamic OpenAI-powered lead generation chat handler.
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once 'connection.php';
session_start();

// Helper to load .env
function loadEnv($path) {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}
loadEnv(__DIR__ . '/.env');

$apiKey = $_ENV['OPENAI_API_KEY'] ?? '';
$input = json_decode(file_get_contents('php://input'), true);
$userMessage = isset($input['message']) ? trim($input['message']) : '';

if (!$apiKey) {
    echo json_encode(['text' => 'OpenAI API Key missing. Please check .env file.']);
    exit;
}

// Initialize session state
if (!isset($_SESSION['history'])) {
    $_SESSION['history'] = [];
    $_SESSION['lead_data'] = [
        'name' => '',
        'email' => '',
        'phone' => '',
        'project' => '',
        'intent' => 'INFO'
    ];
}

// System Instruction for Mama AI
$systemPrompt = "You are 'Mama AI', a smart, friendly, and professional AI sales + support assistant for Ltrixon, a modern software development company.

Your goal:
- Help users clearly and quickly
- Understand their needs
- Guide them toward services
- Convert them into customers
- Collect customer details step-by-step
- Escalate to human when needed

🌍 LANGUAGE:
- Always use clear, simple English
- Friendly, human-like tone
- Short responses (2–4 lines max)
- Avoid robotic or long paragraphs

🎯 CONVERSATION FLOW:
1. Greeting: 'Hi 👋 Welcome to Ltrixon! What are you planning to build?'
2. Understand Needs (Website, Mobile App, or Software? Business or personal?).
3. Qualification (Budget? Timeline?).
4. LEAD COLLECTION (ONE-BY-ONE):
   - 'May I know your name?'
   - 'Please share your email'
   - 'Your phone number?'
   - 'Can you describe your project?'

🧠 SMART RULES:
- If user already gave info → DO NOT ask again
- Detect automatically: Email, Phone number, Name
- Continue collecting missing details only

🚨 HUMAN HANDOFF:
- If user says: talk to human, call me, urgent, meeting
- Reply: 'Sure 👍 I will connect you with our expert team.'

📌 STRICT OUTPUT FORMAT:
At the END of every response, ALWAYS return ONLY a valid JSON object:
{
  \"reply\": \"your message to user\",
  \"data\": {
    \"name\": \"\",
    \"email\": \"\",
    \"phone\": \"\",
    \"project\": \"\"
  },
  \"intent\": \"INFO | LEAD | SUPPORT | HUMAN\",
  \"qualified\": true/false
}

RULES:
- Fill fields ONLY if user provides them
- qualified = true ONLY IF: name + (phone OR email) available";

// Add user message to history
$_SESSION['history'][] = ['role' => 'user', 'content' => $userMessage];

// Prepare the OpenAI API call
$url = "https://api.openai.com/v1/chat/completions";

$data = [
    'model' => 'gpt-4o-mini',
    'messages' => array_merge(
        [['role' => 'system', 'content' => $systemPrompt]],
        $_SESSION['history']
    ),
    'response_format' => ['type' => 'json_object']
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($httpCode !== 200) {
    echo json_encode(['text' => "Error calling OpenAI API (Status $httpCode). " . $response]);
    exit;
}

$result = json_decode($response, true);
$responseText = $result['choices'][0]['message']['content'] ?? '{}';
$parsedData = json_decode($responseText, true);

$botText = $parsedData['reply'] ?? "Sorry, I couldn't process that.";
$leadData = $parsedData['data'] ?? [];
$qualified = $parsedData['qualified'] ?? false;
$intent = $parsedData['intent'] ?? 'INFO';

// Update session lead data
$_SESSION['lead_data'] = array_merge($_SESSION['lead_data'], $leadData);
$_SESSION['lead_data']['intent'] = $intent;

// Add bot assistant message to history
$_SESSION['history'][] = ['role' => 'assistant', 'content' => $responseText];

// Save to MySQL if qualified and not already saved
if ($qualified && isset($conn)) {
    $stmt = $conn->prepare("INSERT INTO leads (name, email, phone, project, intent) VALUES (?, ?, ?, ?, ?)");
    try {
        $stmt->execute([
            $_SESSION['lead_data']['name'],
            $_SESSION['lead_data']['email'],
            $_SESSION['lead_data']['phone'],
            $_SESSION['lead_data']['project'],
            $_SESSION['lead_data']['intent']
        ]);
    } catch (Exception $e) {
        error_log($e->getMessage());
    }
}

echo json_encode([
    'text' => $botText,
    'data' => $_SESSION['lead_data'],
    'qualified' => $qualified
]);
?>
