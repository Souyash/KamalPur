<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$db = get_db();

if ($method === 'GET') {
    try {
        $category = $_GET['category'] ?? '';
        if (!empty($category) && $category !== 'all') {
            $stmt = $db->prepare("SELECT * FROM gallery WHERE LOWER(category) = LOWER(?) ORDER BY id DESC");
            $stmt->execute([$category]);
        } else {
            $stmt = $db->query("SELECT * FROM gallery ORDER BY id DESC");
        }
        $items = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $items, 'db' => get_db_info()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Query error: ' . $e->getMessage()]);
    }
    exit;
}

$raw_input = file_get_contents('php://input');
$json_input = json_decode($raw_input, true);
$input = is_array($json_input) ? $json_input : ($_POST ?? []);

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

    // Automatically decode & save base64 uploads as permanent file assets
    $img_url = save_image_from_input($img_url, 'uploads');

    try {
        $stmt = $db->prepare("INSERT INTO gallery (title, category, year_tag, desc_text, img_url) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$title, $category, $year_tag, $desc_text, $img_url]);
        $new_id = (int)$db->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => 'Gallery post added successfully.',
            'data' => [
                'id' => $new_id,
                'title' => $title,
                'category' => $category,
                'year_tag' => $year_tag,
                'desc_text' => $desc_text,
                'img_url' => $img_url
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to save to database: ' . $e->getMessage()]);
    }
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

    $img_url = save_image_from_input($img_url, 'uploads');

    try {
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
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to update database: ' . $e->getMessage()]);
    }
    exit;
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? ($input['id'] ?? 0));
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Valid ID is required.']);
        exit;
    }

    try {
        $sel = $db->prepare("SELECT img_url FROM gallery WHERE id = ?");
        $sel->execute([$id]);
        $row = $sel->fetch();
        if ($row && !empty($row['img_url'])) {
            $imgPath = $row['img_url'];
            if (strpos($imgPath, 'assets/uploads/') === 0) {
                $fullPath = __DIR__ . '/../' . $imgPath;
                if (file_exists($fullPath)) {
                    @unlink($fullPath);
                }
            }
        }

        $stmt = $db->prepare("DELETE FROM gallery WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(['success' => true, 'message' => 'Gallery post and associated image deleted successfully.']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to delete from database: ' . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed.']);

