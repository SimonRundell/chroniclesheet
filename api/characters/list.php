<?php
/**
 * GET /api/characters/list.php
 * Returns a summary list of the logged-in user's own characters.
 *
 * @package api\characters
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../auth.php';

$userId = require_auth();
$pdo = get_db();

$stmt = $pdo->prepare(
    'SELECT id, name, avatar_filename, race, class, level, hp_current, hp_max, armor_class, campaign_id, updated_at
     FROM characters WHERE user_id = ? ORDER BY updated_at DESC'
);
$stmt->execute([$userId]);

echo json_encode($stmt->fetchAll());
