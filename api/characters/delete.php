<?php
/**
 * DELETE /api/characters/delete.php?id=123
 * Only the owning player may delete a character.
 *
 * @package api\characters
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit();
}

$userId = require_auth();
$id = (int) ($_GET['id'] ?? 0);

$pdo = get_db();
$owner = $pdo->prepare('SELECT user_id FROM characters WHERE id = ?');
$owner->execute([$id]);
$row = $owner->fetch();

if (!$row) {
    http_response_code(404);
    echo json_encode(['error' => 'Character not found.']);
    exit();
}

if ((int) $row['user_id'] !== $userId) {
    http_response_code(403);
    echo json_encode(['error' => 'Only the owning player can delete this character.']);
    exit();
}

$pdo->prepare('DELETE FROM characters WHERE id = ?')->execute([$id]);
echo json_encode(['ok' => true]);
