<?php
/**
 * Whitelist of player-editable character columns and their value types,
 * shared by create.php and update.php so both stay in sync with the schema.
 *
 * @package api\characters
 */

/** @return array<string, string> Map of column name => 'string'|'int'|'bool'|'json'. */
function character_field_types(): array
{
    return [
        'name' => 'string', 'race' => 'string', 'class' => 'string', 'subclass' => 'string',
        'background' => 'string', 'alignment' => 'string',
        'level' => 'int', 'experience_points' => 'int',
        'ability_str' => 'int', 'ability_dex' => 'int', 'ability_con' => 'int',
        'ability_int' => 'int', 'ability_wis' => 'int', 'ability_cha' => 'int',
        'proficiency_bonus' => 'int', 'inspiration' => 'bool',
        'armor_class' => 'int', 'initiative_bonus' => 'int', 'speed' => 'int',
        'hp_max' => 'int', 'hp_current' => 'int', 'hp_temp' => 'int', 'hit_dice' => 'string',
        'death_save_successes' => 'int', 'death_save_failures' => 'int', 'passive_perception' => 'int',
        'skills' => 'json', 'saving_throw_proficiencies' => 'json', 'currency' => 'json',
        'spell_slots' => 'json', 'spells' => 'json', 'inventory' => 'json', 'features' => 'json',
        'notes' => 'string',
    ];
}

/**
 * Casts a raw request value to the type expected by its column, ready for a
 * bound PDO parameter.
 *
 * @param mixed  $value
 * @param string $type
 * @return mixed
 */
function cast_character_field($value, string $type)
{
    switch ($type) {
        case 'int':
            return (int) $value;
        case 'bool':
            return $value ? 1 : 0;
        case 'json':
            return json_encode($value ?? []);
        default:
            return (string) $value;
    }
}

/**
 * Decodes a character row fetched from the DB, turning its JSON columns
 * back into arrays/objects for the API response.
 *
 * @param array $row
 * @return array
 */
function decode_character_row(array $row): array
{
    foreach (character_field_types() as $column => $type) {
        if ($type === 'json' && isset($row[$column])) {
            $row[$column] = json_decode($row[$column], true);
        }
    }
    $row['inspiration'] = (bool) ($row['inspiration'] ?? false);
    return $row;
}
