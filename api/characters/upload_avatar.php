<?php
/**
 * POST /api/characters/upload_avatar.php?id=123
 * multipart/form-data, field name "avatar".
 * Stores an uploaded avatar image under api/uploads/avatars/ using a
 * generated unique filename (never the client's original filename) and
 * records it against the character. Only the owning player may do this.
 *
 * Accepted formats: JPEG, PNG, GIF (including animated), WebP, BMP. The
 * real file content is sniffed via finfo rather than trusting the
 * client-supplied extension or Content-Type.
 *
 * @package api\characters
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../auth.php';

const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_AVATAR_MIME_TYPES = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/gif' => 'gif',
    'image/webp' => 'webp',
    'image/bmp' => 'bmp',
];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit();
}

$userId = require_auth();
$id = (int) ($_GET['id'] ?? 0);

$pdo = get_db();
$char = $pdo->prepare('SELECT user_id, avatar_filename FROM characters WHERE id = ?');
$char->execute([$id]);
$characterRow = $char->fetch();

if (!$characterRow) {
    http_response_code(404);
    echo json_encode(['error' => 'Character not found.']);
    exit();
}

if ((int) $characterRow['user_id'] !== $userId) {
    http_response_code(403);
    echo json_encode(['error' => 'Only the owning player can change this character\'s avatar.']);
    exit();
}

if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] === UPLOAD_ERR_NO_FILE) {
    http_response_code(422);
    echo json_encode(['error' => 'No avatar file was uploaded.']);
    exit();
}

$upload = $_FILES['avatar'];

if ($upload['error'] !== UPLOAD_ERR_OK) {
    http_response_code(422);
    echo json_encode(['error' => 'Upload failed.']);
    exit();
}

if ($upload['size'] > MAX_AVATAR_BYTES) {
    http_response_code(422);
    echo json_encode(['error' => 'Avatar must be 5 MB or smaller.']);
    exit();
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $upload['tmp_name']);
finfo_close($finfo);

if (!isset(ALLOWED_AVATAR_MIME_TYPES[$mimeType])) {
    http_response_code(422);
    echo json_encode(['error' => 'Unsupported image format. Use JPEG, PNG, GIF, WebP or BMP.']);
    exit();
}

$extension = ALLOWED_AVATAR_MIME_TYPES[$mimeType];
$filename = date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $extension;
$uploadsDir = __DIR__ . '/../uploads/avatars';
$destination = $uploadsDir . '/' . $filename;

if (!move_uploaded_file($upload['tmp_name'], $destination)) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not save the uploaded file.']);
    exit();
}

$previousFilename = $characterRow['avatar_filename'];

$pdo->prepare('UPDATE characters SET avatar_filename = ? WHERE id = ?')->execute([$filename, $id]);

if ($previousFilename) {
    $previousPath = $uploadsDir . '/' . basename($previousFilename);
    if (is_file($previousPath)) {
        @unlink($previousPath);
    }
}

echo json_encode(['avatar_filename' => $filename]);
