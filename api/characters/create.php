<?php
/**
 * POST /api/characters/create.php
 * Body: { name, race?, class?, ... } - only "name" is required, everything
 * else falls back to the schema's sensible level-1 defaults.
 *
 * @package api\characters
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/fields.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit();
}

$userId = require_auth();
$body = read_json_body();
$name = trim($body['name'] ?? '');

if ($name === '') {
    http_response_code(422);
    echo json_encode(['error' => 'A character name is required.']);
    exit();
}

$pdo = get_db();
$stmt = $pdo->prepare('INSERT INTO characters (user_id, name, notes) VALUES (?, ?, ?)');
$stmt->execute([$userId, $name, '']);
$id = (int) $pdo->lastInsertId();

$get = $pdo->prepare('SELECT * FROM characters WHERE id = ?');
$get->execute([$id]);

echo json_encode(decode_character_row($get->fetch()));
