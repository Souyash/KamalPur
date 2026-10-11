<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
    exit;
}

$file = $_FILES['photo'] ?? ($_FILES['file'] ?? ($_FILES['image'] ?? null));
if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No image file uploaded or upload error occurred.']);
    exit;
}
$allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $allowed)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid image format. Allowed: JPG, PNG, WEBP, GIF.']);
    exit;
}

// Ensure upload directory exists
$upload_dir = __DIR__ . '/../assets/uploads';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

$filename = 'img_' . uniqid() . '.' . $ext;
$dest = $upload_dir . '/' . $filename;

if (move_uploaded_file($file['tmp_name'], $dest)) {
    $relative_path = 'assets/uploads/' . $filename;
    echo json_encode([
        'success' => true,
        'message' => 'Image uploaded successfully.',
        'url' => $relative_path
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to save uploaded file to disk.']);
}

