<?php
/**
 * POST /api/characters/remove_avatar.php?id=123
 * Deletes the character's avatar file and clears the reference. Only the
 * owning player may do this.
 *
 * @package api\characters
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../auth.php';

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

if ($characterRow['avatar_filename']) {
    $path = __DIR__ . '/../uploads/avatars/' . basename($characterRow['avatar_filename']);
    if (is_file($path)) {
        @unlink($path);
    }
}

$pdo->prepare('UPDATE characters SET avatar_filename = NULL WHERE id = ?')->execute([$id]);

echo json_encode(['ok' => true]);
