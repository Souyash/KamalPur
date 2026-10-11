<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$db = get_db();

if ($method === 'GET') {
    $stmt = $db->query("SELECT * FROM members ORDER BY date DESC");
    $items = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $items, 'db' => get_db_info()]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

if ($method === 'POST') {
    $id = trim($input['id'] ?? ('#MEM-2026-' . rand(1000, 9999)));
    $name = trim($input['name'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $city = trim($input['city'] ?? 'Ranaghat');
    $interest = trim($input['interest'] ?? 'Puja & Cultural Wing');
    $message = trim($input['message'] ?? '');
    $status = trim($input['status'] ?? 'pending');
    $date = $input['date'] ?? date('Y-m-d H:i:s');

    if (empty($name) || empty($phone)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Name and phone are required.']);
        exit;
    }

    $stmt = $db->prepare("INSERT INTO members (id, name, phone, city, interest, message, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$id, $name, $phone, $city, $interest, $message, $status, $date]);

    echo json_encode(['success' => true, 'message' => 'Member application registered.', 'data' => compact('id', 'name', 'phone', 'city', 'interest', 'status', 'date')]);
    exit;
}

if ($method === 'PUT') {
    $id = trim($input['id'] ?? ($_GET['id'] ?? ''));
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Valid ID is required.']);
        exit;
    }

    if (isset($input['status'])) {
        $status = $input['status'];
        $stmt = $db->prepare("UPDATE members SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
    }

    echo json_encode(['success' => true, 'message' => 'Member status updated.']);
    exit;
}

if ($method === 'DELETE') {
    $id = trim($_GET['id'] ?? ($input['id'] ?? ''));
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Valid ID is required.']);
        exit;
    }

    $stmt = $db->prepare("DELETE FROM members WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true, 'message' => 'Member application removed.']);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
