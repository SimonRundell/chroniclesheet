<?php
/**
 * Session helpers shared by every endpoint that requires a logged-in user.
 *
 * @package api
 */

/**
 * Starts the app's PHP session using the configured cookie name, if not
 * already started.
 *
 * @return void
 */
function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $configPath = __DIR__ . '/.config.json';
    $sessionName = 'dnd_sheet_session';
    if (file_exists($configPath)) {
        $config = json_decode(file_get_contents($configPath), true);
        $sessionName = $config['session_name'] ?? $sessionName;
    }

    session_name($sessionName);
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'samesite' => 'Lax',
        'httponly' => true,
        'secure' => false,
    ]);
    session_start();
}

/**
 * Returns the currently logged-in user's id, or null if not authenticated.
 *
 * @return int|null
 */
function current_user_id(): ?int
{
    start_session();
    return $_SESSION['user_id'] ?? null;
}

/**
 * Ends the request with a 401 JSON error unless a user is logged in.
 *
 * @return int The logged-in user's id.
 */
function require_auth(): int
{
    $userId = current_user_id();
    if ($userId === null) {
        http_response_code(401);
        echo json_encode(['error' => 'Not authenticated.']);
        exit();
    }
    return $userId;
}

/**
 * Reads and JSON-decodes the raw request body.
 *
 * @return array
 */
function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}
