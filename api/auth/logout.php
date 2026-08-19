<?php
/**
 * POST /api/auth/logout.php
 * Ends the current session.
 *
 * @package api\auth
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../auth.php';

start_session();
$_SESSION = [];
session_destroy();

echo json_encode(['ok' => true]);
