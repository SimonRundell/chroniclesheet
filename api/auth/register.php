<?php
/**
 * POST /api/auth/register.php
 * Body: { username, email, password, display_name }
 * Creates a new user account and logs them in.
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
$username = trim($body['username'] ?? '');
$email = trim($body['email'] ?? '');
$password = (string) ($body['password'] ?? '');
$displayName = trim($body['display_name'] ?? '') ?: $username;

if ($username === '' || $email === '' || strlen($password) < 8) {
    http_response_code(422);
    echo json_encode(['error' => 'Username, email and a password of at least 8 characters are required.']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['error' => 'Please enter a valid email address.']);
    exit();
}

$pdo = get_db();

$existing = $pdo->prepare('SELECT id FROM users WHERE username = ? OR email = ?');
$existing->execute([$username, $email]);
if ($existing->fetch()) {
    http_response_code(409);
    echo json_encode(['error' => 'That username or email is already registered.']);
    exit();
}

$stmt = $pdo->prepare(
    'INSERT INTO users (username, email, password_hash, display_name) VALUES (?, ?, ?, ?)'
);
$stmt->execute([$username, $email, password_hash($password, PASSWORD_DEFAULT), $displayName]);
$userId = (int) $pdo->lastInsertId();

start_session();
session_regenerate_id(true);
$_SESSION['user_id'] = $userId;

echo json_encode([
    'id' => $userId,
    'username' => $username,
    'email' => $email,
    'display_name' => $displayName,
]);
