<?php
/**
 * POST /api/campaigns/create.php
 * Body: { name }
 * Creates a campaign owned by the logged-in user (as DM) with a fresh
 * random invite code.
 *
 * @package api\campaigns
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/invite_code.php';

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
    echo json_encode(['error' => 'A campaign name is required.']);
    exit();
}

$pdo = get_db();
$code = generate_unique_invite_code($pdo);

$stmt = $pdo->prepare('INSERT INTO campaigns (name, dm_user_id, invite_code) VALUES (?, ?, ?)');
$stmt->execute([$name, $userId, $code]);

echo json_encode([
    'id' => (int) $pdo->lastInsertId(),
    'name' => $name,
    'dm_user_id' => $userId,
    'invite_code' => $code,
]);
