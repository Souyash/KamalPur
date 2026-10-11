<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$db = get_db();

if ($method === 'GET') {
    $stmt = $db->query("SELECT * FROM donations ORDER BY date DESC");
    $items = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $items, 'db' => get_db_info()]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

if ($method === 'POST') {
    $id = trim($input['id'] ?? ('#KAS-2026-' . rand(1000, 9999)));
    $name = trim($input['name'] ?? 'Devotee');
    $phone = trim($input['phone'] ?? '');
    $email = trim($input['email'] ?? '');
    $amount = (float)($input['amount'] ?? 501);
    $address = trim($input['address'] ?? 'Ranaghat');
    $purpose = trim($input['purpose'] ?? 'Sharodotsav Durga Puja Chanda');
    $pan = trim($input['pan'] ?? '');
    $utr = trim($input['utr'] ?? 'WhatsApp Redirection');
    $status = trim($input['status'] ?? 'pending');
    $date = $input['date'] ?? date('Y-m-d H:i:s');

    $stmt = $db->prepare("INSERT INTO donations (id, name, phone, email, amount, address, purpose, pan, utr, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$id, $name, $phone, $email, $amount, $address, $purpose, $pan, $utr, $status, $date]);

    echo json_encode(['success' => true, 'message' => 'Donation logged successfully.', 'data' => compact('id', 'name', 'phone', 'amount', 'purpose', 'status', 'date')]);
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
        $stmt = $db->prepare("UPDATE donations SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
    }

    echo json_encode(['success' => true, 'message' => 'Donation record updated.']);
    exit;
}

if ($method === 'DELETE') {
    $id = trim($_GET['id'] ?? ($input['id'] ?? ''));
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Valid ID is required.']);
        exit;
    }

    $stmt = $db->prepare("DELETE FROM donations WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true, 'message' => 'Donation record deleted.']);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
