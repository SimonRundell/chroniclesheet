<?php
/**
 * POST /api/campaigns/join.php
 * Body: { character_id, invite_code }
 * Links one of the logged-in user's own characters to the campaign matching
 * the invite code, making it visible to that campaign's DM.
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
$inviteCode = strtoupper(trim($body['invite_code'] ?? ''));

if ($characterId === 0 || $inviteCode === '') {
    http_response_code(422);
    echo json_encode(['error' => 'A character and an invite code are required.']);
    exit();
}

$pdo = get_db();

$char = $pdo->prepare('SELECT id, user_id FROM characters WHERE id = ?');
$char->execute([$characterId]);
$characterRow = $char->fetch();

if (!$characterRow || (int) $characterRow['user_id'] !== $userId) {
    http_response_code(403);
    echo json_encode(['error' => 'That character does not belong to you.']);
    exit();
}

$camp = $pdo->prepare('SELECT id, name, dm_user_id FROM campaigns WHERE invite_code = ?');
$camp->execute([$inviteCode]);
$campaignRow = $camp->fetch();

if (!$campaignRow) {
    http_response_code(404);
    echo json_encode(['error' => 'No campaign matches that invite code.']);
    exit();
}

$pdo->prepare('UPDATE characters SET campaign_id = ? WHERE id = ?')
    ->execute([$campaignRow['id'], $characterId]);

echo json_encode([
    'campaign_id' => (int) $campaignRow['id'],
    'campaign_name' => $campaignRow['name'],
]);
