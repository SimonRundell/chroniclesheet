<?php
/**
 * POST /api/auth/login.php
 * Body: { username, password }
 * Body may also accept email in place of username.
 *
 * @package api\auth
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit();
}

$body = read_json_body();
$identifier = trim($body['username'] ?? $body['email'] ?? '');
$password = (string) ($body['password'] ?? '');

if ($identifier === '' || $password === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Username/email and password are required.']);
    exit();
}

$pdo = get_db();
$stmt = $pdo->prepare('SELECT id, username, email, display_name, password_hash FROM users WHERE username = ? OR email = ?');
$stmt->execute([$identifier, $identifier]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Incorrect username/email or password.']);
    exit();
}

start_session();
session_regenerate_id(true);
$_SESSION['user_id'] = (int) $user['id'];

unset($user['password_hash']);
echo json_encode($user);
