<?php
/**
 * GET /api/auth/me.php
 * Returns the currently logged-in user, or 401 if not authenticated.
 *
 * @package api\auth
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../auth.php';

$userId = require_auth();

$pdo = get_db();
$stmt = $pdo->prepare('SELECT id, username, email, display_name, created_at FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated.']);
    exit();
}

echo json_encode($user);
