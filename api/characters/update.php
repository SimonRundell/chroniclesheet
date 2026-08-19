<?php
/**
 * PUT /api/characters/update.php?id=123
 * Body: any subset of the editable character fields (see fields.php).
 * Only the owning player may update a character - a DM's view is read-only.
 *
 * @package api\characters
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/fields.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit();
}

$userId = require_auth();
$id = (int) ($_GET['id'] ?? 0);
$body = read_json_body();

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
    echo json_encode(['error' => 'Only the owning player can edit this character.']);
    exit();
}

$fieldTypes = character_field_types();
$setClauses = [];
$params = [];

foreach ($fieldTypes as $column => $type) {
    if (array_key_exists($column, $body)) {
        $setClauses[] = "{$column} = ?";
        $params[] = cast_character_field($body[$column], $type);
    }
}

if (empty($setClauses)) {
    http_response_code(422);
    echo json_encode(['error' => 'No editable fields were provided.']);
    exit();
}

$params[] = $id;
$sql = 'UPDATE characters SET ' . implode(', ', $setClauses) . ' WHERE id = ?';
$pdo->prepare($sql)->execute($params);

$get = $pdo->prepare('SELECT * FROM characters WHERE id = ?');
$get->execute([$id]);

echo json_encode(decode_character_row($get->fetch()));
