<?php
/**
 * GET /api/campaigns/list.php
 * Returns campaigns the logged-in user DMs, plus the campaign (if any) each
 * of their own characters is currently linked to.
 *
 * @package api\campaigns
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../auth.php';

$userId = require_auth();
$pdo = get_db();

$dmOf = $pdo->prepare(
    'SELECT id, name, invite_code, created_at FROM campaigns WHERE dm_user_id = ? ORDER BY created_at DESC'
);
$dmOf->execute([$userId]);

$linked = $pdo->prepare(
    'SELECT c.id AS character_id, c.name AS character_name, camp.id AS campaign_id,
            camp.name AS campaign_name, camp.invite_code
     FROM characters c
     JOIN campaigns camp ON camp.id = c.campaign_id
     WHERE c.user_id = ?'
);
$linked->execute([$userId]);

echo json_encode([
    'dm_campaigns' => $dmOf->fetchAll(),
    'linked_characters' => $linked->fetchAll(),
]);
