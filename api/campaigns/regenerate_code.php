<?php
/**
 * POST /api/campaigns/regenerate_code.php
 * Body: { campaign_id }
 * Issues a fresh invite code for a campaign the logged-in user DMs
 * (invalidating the old one).
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
$campaignId = (int) ($body['campaign_id'] ?? 0);

$pdo = get_db();
$camp = $pdo->prepare('SELECT id, dm_user_id FROM campaigns WHERE id = ?');
$camp->execute([$campaignId]);
$campaignRow = $camp->fetch();

if (!$campaignRow || (int) $campaignRow['dm_user_id'] !== $userId) {
    http_response_code(403);
    echo json_encode(['error' => 'You do not DM this campaign.']);
    exit();
}

$code = generate_unique_invite_code($pdo);
$pdo->prepare('UPDATE campaigns SET invite_code = ? WHERE id = ?')->execute([$code, $campaignId]);

echo json_encode(['invite_code' => $code]);
