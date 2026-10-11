<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$db = get_db();

if ($method === 'GET') {
    $category = $_GET['category'] ?? '';
    if (!empty($category) && $category !== 'all') {
        $stmt = $db->prepare("SELECT * FROM gallery WHERE LOWER(category) = LOWER(?) ORDER BY id DESC");
        $stmt->execute([$category]);
    } else {
        $stmt = $db->query("SELECT * FROM gallery ORDER BY id DESC");
    }
    $items = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $items, 'db' => get_db_info()]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

if ($method === 'POST') {
    $title = trim($input['title'] ?? '');
    $category = trim($input['category'] ?? 'Maha Protima');
    $year_tag = trim($input['year_tag'] ?? '2025–2026');
    $desc_text = trim($input['desc_text'] ?? '');
    $img_url = trim($input['img_url'] ?? '');

    if (empty($title) || empty($img_url)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Title and image URL are required.']);
        exit;
    }

    $stmt = $db->prepare("INSERT INTO gallery (title, category, year_tag, desc_text, img_url) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$title, $category, $year_tag, $desc_text, $img_url]);
    $new_id = $db->lastInsertId();

    echo json_encode([
        'success' => true,
        'message' => 'Gallery post added successfully.',
        'data' => [
            'id' => (int)$new_id,
            'title' => $title,
            'category' => $category,
            'year_tag' => $year_tag,
            'desc_text' => $desc_text,
            'img_url' => $img_url
        ]
    ]);
    exit;
}

if ($method === 'PUT') {
    $id = (int)($input['id'] ?? ($_GET['id'] ?? 0));
    $title = trim($input['title'] ?? '');
    $category = trim($input['category'] ?? '');
    $year_tag = trim($input['year_tag'] ?? '');
    $desc_text = trim($input['desc_text'] ?? '');
    $img_url = trim($input['img_url'] ?? '');

    if ($id <= 0 || empty($title) || empty($img_url)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Valid ID, title, and image URL are required.']);
        exit;
    }

    $stmt = $db->prepare("UPDATE gallery SET title = ?, category = ?, year_tag = ?, desc_text = ?, img_url = ? WHERE id = ?");
    $stmt->execute([$title, $category, $year_tag, $desc_text, $img_url, $id]);

    echo json_encode([
        'success' => true,
        'message' => 'Gallery post updated successfully.',
        'data' => [
            'id' => $id,
            'title' => $title,
            'category' => $category,
            'year_tag' => $year_tag,
            'desc_text' => $desc_text,
            'img_url' => $img_url
        ]
    ]);
    exit;
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? ($input['id'] ?? 0));
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Valid ID is required.']);
        exit;
    }

    $stmt = $db->prepare("DELETE FROM gallery WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true, 'message' => 'Gallery post deleted successfully.']);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
