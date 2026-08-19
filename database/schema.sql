-- D&D Character Sheet App - database schema
-- Portable across MySQL 8+ and MariaDB 10.2+ (InnoDB, utf8mb4, JSON columns).
--
-- Import with:
--   mysql -u root -p < schema.sql
-- or via phpMyAdmin / HeidiSQL against an existing empty database.

CREATE DATABASE IF NOT EXISTS dnd_charactersheet
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE dnd_charactersheet;

-- ---------------------------------------------------------------------------
-- users: every account is both a potential player and a potential DM.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(32)  NOT NULL,
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name  VARCHAR(64)  NOT NULL,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_users_username (username),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- campaigns: a DM-owned group that characters can be linked to via invite code.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaigns (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    dm_user_id  INT UNSIGNED NOT NULL,
    invite_code VARCHAR(8)   NOT NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_campaigns_invite_code (invite_code),
    KEY idx_campaigns_dm_user_id (dm_user_id),
    CONSTRAINT fk_campaigns_dm_user
        FOREIGN KEY (dm_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- characters: the full 5e-SRD-shaped sheet. Free-text JSON fields (spells,
-- inventory, features) are filled in by the player - no SRD content is
-- bundled with the app, avoiding any WotC copyright concerns.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS characters (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id      INT UNSIGNED NOT NULL,
    campaign_id  INT UNSIGNED NULL,

    -- Identity
    name         VARCHAR(100) NOT NULL,
    avatar_filename VARCHAR(255) NULL,
    race         VARCHAR(64)  NOT NULL DEFAULT '',
    class        VARCHAR(64)  NOT NULL DEFAULT '',
    subclass     VARCHAR(64)  NOT NULL DEFAULT '',
    background   VARCHAR(64)  NOT NULL DEFAULT '',
    alignment    VARCHAR(32)  NOT NULL DEFAULT '',
    level        TINYINT UNSIGNED NOT NULL DEFAULT 1,
    experience_points INT UNSIGNED NOT NULL DEFAULT 0,

    -- Ability scores
    ability_str  TINYINT UNSIGNED NOT NULL DEFAULT 10,
    ability_dex  TINYINT UNSIGNED NOT NULL DEFAULT 10,
    ability_con  TINYINT UNSIGNED NOT NULL DEFAULT 10,
    ability_int  TINYINT UNSIGNED NOT NULL DEFAULT 10,
    ability_wis  TINYINT UNSIGNED NOT NULL DEFAULT 10,
    ability_cha  TINYINT UNSIGNED NOT NULL DEFAULT 10,
    proficiency_bonus TINYINT UNSIGNED NOT NULL DEFAULT 2,
    inspiration  TINYINT(1) NOT NULL DEFAULT 0,

    -- Combat
    armor_class       TINYINT UNSIGNED NOT NULL DEFAULT 10,
    initiative_bonus  TINYINT NOT NULL DEFAULT 0,
    speed             TINYINT UNSIGNED NOT NULL DEFAULT 30,
    hp_max            SMALLINT UNSIGNED NOT NULL DEFAULT 10,
    hp_current        SMALLINT NOT NULL DEFAULT 10,
    hp_temp           SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    hit_dice          VARCHAR(16) NOT NULL DEFAULT '1d8',
    death_save_successes TINYINT UNSIGNED NOT NULL DEFAULT 0,
    death_save_failures  TINYINT UNSIGNED NOT NULL DEFAULT 0,
    passive_perception   TINYINT UNSIGNED NOT NULL DEFAULT 10,

    -- Proficiencies / resources (free-form, player-editable JSON)
    skills                      JSON NOT NULL DEFAULT (JSON_OBJECT()),
    saving_throw_proficiencies  JSON NOT NULL DEFAULT (JSON_ARRAY()),
    currency                    JSON NOT NULL DEFAULT (JSON_OBJECT('cp',0,'sp',0,'ep',0,'gp',0,'pp',0)),
    spell_slots                 JSON NOT NULL DEFAULT (JSON_OBJECT()),
    spells                      JSON NOT NULL DEFAULT (JSON_ARRAY()),
    inventory                   JSON NOT NULL DEFAULT (JSON_ARRAY()),
    features                    JSON NOT NULL DEFAULT (JSON_ARRAY()),

    notes        TEXT NOT NULL,

    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    KEY idx_characters_user_id (user_id),
    KEY idx_characters_campaign_id (campaign_id),
    CONSTRAINT fk_characters_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_characters_campaign
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
