<?php
/**
 * POST /api/campaigns/leave.php
 * Body: { character_id }
 * Unlinks one of the logged-in user's own characters from its campaign.
 *
 * @package api\campaigns
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
$body = read_json_body();
$characterId = (int) ($body['character_id'] ?? 0);

$pdo = get_db();
$char = $pdo->prepare('SELECT id, user_id FROM characters WHERE id = ?');
$char->execute([$characterId]);
$characterRow = $char->fetch();

if (!$characterRow || (int) $characterRow['user_id'] !== $userId) {
    http_response_code(403);
    echo json_encode(['error' => 'That character does not belong to you.']);
    exit();
}

$pdo->prepare('UPDATE characters SET campaign_id = NULL WHERE id = ?')->execute([$characterId]);
echo json_encode(['ok' => true]);
