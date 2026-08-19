<?php
/**
 * GET /api/characters/get.php?id=123
 * Returns a full character sheet. Viewable by its owner, or by the DM of
 * the campaign it is currently linked to.
 *
 * @package api\characters
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../auth.php';
require_once __DIR__ . '/fields.php';

$userId = require_auth();
$id = (int) ($_GET['id'] ?? 0);

$pdo = get_db();
$stmt = $pdo->prepare(
    'SELECT c.*, camp.dm_user_id FROM characters c
     LEFT JOIN campaigns camp ON camp.id = c.campaign_id
     WHERE c.id = ?'
);
$stmt->execute([$id]);
$row = $stmt->fetch();

if (!$row) {
    http_response_code(404);
    echo json_encode(['error' => 'Character not found.']);
    exit();
}

$isOwner = (int) $row['user_id'] === $userId;
$isCampaignDm = $row['dm_user_id'] !== null && (int) $row['dm_user_id'] === $userId;

if (!$isOwner && !$isCampaignDm) {
    http_response_code(403);
    echo json_encode(['error' => 'You do not have access to this character.']);
    exit();
}

unset($row['dm_user_id']);
echo json_encode(decode_character_row($row) + ['is_owner' => $isOwner]);
