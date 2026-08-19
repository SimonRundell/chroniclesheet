<?php
/**
 * GET /api/campaigns/characters.php?campaign_id=123
 * DM-only. Returns the live combat-relevant state of every character linked
 * to the campaign, meant to be polled every few seconds during a session.
 *
 * @package api\campaigns
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../auth.php';

$userId = require_auth();
$campaignId = (int) ($_GET['campaign_id'] ?? 0);

$pdo = get_db();
$camp = $pdo->prepare('SELECT id, dm_user_id FROM campaigns WHERE id = ?');
$camp->execute([$campaignId]);
$campaignRow = $camp->fetch();

if (!$campaignRow || (int) $campaignRow['dm_user_id'] !== $userId) {
    http_response_code(403);
    echo json_encode(['error' => 'You do not DM this campaign.']);
    exit();
}

$stmt = $pdo->prepare(
    'SELECT id, name, avatar_filename, race, class, level, armor_class, initiative_bonus, speed,
            hp_max, hp_current, hp_temp, death_save_successes, death_save_failures,
            passive_perception, inspiration, updated_at
     FROM characters WHERE campaign_id = ? ORDER BY name'
);
$stmt->execute([$campaignId]);
$rows = $stmt->fetchAll();

foreach ($rows as &$row) {
    $row['inspiration'] = (bool) $row['inspiration'];
}

echo json_encode($rows);
