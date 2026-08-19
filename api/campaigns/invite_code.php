<?php
/**
 * Invite code generation helper, shared by create.php and regenerate_code.php.
 *
 * @package api\campaigns
 */

/**
 * Generates an 8-character uppercase alphanumeric code guaranteed to be
 * unique among existing campaigns.
 *
 * @param PDO $pdo
 * @return string
 */
function generate_unique_invite_code(PDO $pdo): string
{
    $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I to avoid ambiguity
    $check = $pdo->prepare('SELECT id FROM campaigns WHERE invite_code = ?');

    do {
        $code = '';
        for ($i = 0; $i < 8; $i++) {
            $code .= $alphabet[random_int(0, strlen($alphabet) - 1)];
        }
        $check->execute([$code]);
    } while ($check->fetch());

    return $code;
}
