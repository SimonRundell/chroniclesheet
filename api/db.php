<?php
/**
 * PDO connection factory, configured from api/.config.json.
 *
 * @package api
 */

/**
 * Returns a shared PDO connection to the app database.
 *
 * @return PDO
 */
function get_db(): PDO
{
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $configPath = __DIR__ . '/.config.json';
    if (!file_exists($configPath)) {
        http_response_code(500);
        echo json_encode(['error' => 'Missing api/.config.json - copy api/.config.sample.json and fill in DB credentials.']);
        exit();
    }

    $config = json_decode(file_get_contents($configPath), true);
    $db = $config['db'];

    $dsn = "mysql:host={$db['host']};dbname={$db['name']};charset=utf8mb4";
    $pdo = new PDO($dsn, $db['user'], $db['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    return $pdo;
}
