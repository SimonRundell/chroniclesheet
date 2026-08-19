<?php
/**
 * Shared CORS handling, included first by every API endpoint.
 *
 * Reflects the request Origin back when it's localhost on any port (so the
 * Vite dev server is accepted regardless of which port it picks) or one of
 * the deployed codemonkey.design hosts, and enables credentialed requests
 * so the PHP session cookie used for auth is sent by the browser on
 * cross-origin XHR/fetch calls.
 *
 * @package api
 */

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

$allowedOriginPatterns = [
    '#^https?://localhost(:\d+)?$#',
    '#^https?://127\.0\.0\.1(:\d+)?$#',
    '#^https://([a-z0-9-]+\.)*codemonkey\.design$#',
];

foreach ($allowedOriginPatterns as $pattern) {
    if (preg_match($pattern, $origin)) {
        header("Access-Control-Allow-Origin: {$origin}");
        header('Access-Control-Allow-Credentials: true');
        break;
    }
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
