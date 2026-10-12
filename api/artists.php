<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$db = get_db();

if ($method === 'GET') {
    try {
        $stmt = $db->query("SELECT * FROM artists ORDER BY id ASC");
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
    $name = trim($input['name'] ?? '');
    $craft = trim($input['craft'] ?? '');
    $region = trim($input['region'] ?? 'Ranaghat, Nadia');
    $era_tag = trim($input['era_tag'] ?? '2020 – Present');
    $avatar_initials = trim($input['avatar_initials'] ?? '');
    if (empty($avatar_initials) && !empty($name)) {
        $parts = explode(' ', $name);
        $avatar_initials = strtoupper(substr($parts[0], 0, 1) . (isset($parts[1]) ? substr($parts[1], 0, 1) : ''));
    }
    $bio = trim($input['bio'] ?? '');
    $tradition = trim($input['tradition'] ?? '');
    $accolades = trim($input['accolades'] ?? '');
    $creations = trim($input['creations'] ?? '');
    $philosophy = trim($input['philosophy'] ?? '');
    $img_url = save_image_from_input($input['img_url'] ?? '', 'uploads');

    if (empty($name) || empty($craft)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Artist name and craft are required.']);
        exit;
    }

    try {
        $stmt = $db->prepare("INSERT INTO artists (name, craft, region, era_tag, avatar_initials, bio, tradition, accolades, creations, philosophy, img_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$name, $craft, $region, $era_tag, $avatar_initials, $bio, $tradition, $accolades, $creations, $philosophy, $img_url]);
        $new_id = (int)$db->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => 'Artist profile created successfully.',
            'data' => [
                'id' => $new_id,
                'name' => $name,
                'craft' => $craft,
                'region' => $region,
                'era_tag' => $era_tag,
                'avatar_initials' => $avatar_initials,
                'bio' => $bio,
                'tradition' => $tradition,
                'accolades' => $accolades,
                'creations' => $creations,
                'philosophy' => $philosophy,
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
    $name = trim($input['name'] ?? '');
    $craft = trim($input['craft'] ?? '');
    $region = trim($input['region'] ?? '');
    $era_tag = trim($input['era_tag'] ?? '');
    $avatar_initials = trim($input['avatar_initials'] ?? 'AR');
    $bio = trim($input['bio'] ?? '');
    $tradition = trim($input['tradition'] ?? '');
    $accolades = trim($input['accolades'] ?? '');
    $creations = trim($input['creations'] ?? '');
    $philosophy = trim($input['philosophy'] ?? '');
    $img_url = save_image_from_input($input['img_url'] ?? '', 'uploads');

    if ($id <= 0 || empty($name) || empty($craft)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Valid ID, artist name, and craft are required.']);
        exit;
    }

    try {
        $stmt = $db->prepare("UPDATE artists SET name = ?, craft = ?, region = ?, era_tag = ?, avatar_initials = ?, bio = ?, tradition = ?, accolades = ?, creations = ?, philosophy = ?, img_url = ? WHERE id = ?");
        $stmt->execute([$name, $craft, $region, $era_tag, $avatar_initials, $bio, $tradition, $accolades, $creations, $philosophy, $img_url, $id]);

        echo json_encode([
            'success' => true,
            'message' => 'Artist profile updated successfully.',
            'data' => [
                'id' => $id,
                'name' => $name,
                'craft' => $craft,
                'region' => $region,
                'era_tag' => $era_tag,
                'avatar_initials' => $avatar_initials,
                'bio' => $bio,
                'tradition' => $tradition,
                'accolades' => $accolades,
                'creations' => $creations,
                'philosophy' => $philosophy,
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
        $stmt = $db->prepare("DELETE FROM artists WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(['success' => true, 'message' => 'Artist profile deleted successfully.']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to delete from database: ' . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed.']);

