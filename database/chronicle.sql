/*
 Navicat Premium Dump SQL

 Source Server         : LOCALHOST
 Source Server Type    : MySQL
 Source Server Version : 120302 (12.3.2-MariaDB-log)
 Source Host           : localhost:3306
 Source Schema         : dnd_charactersheet

 Target Server Type    : MySQL
 Target Server Version : 120302 (12.3.2-MariaDB-log)
 File Encoding         : 65001

 Date: 18/08/2026 20:24:11
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for campaigns
-- ----------------------------
DROP TABLE IF EXISTS `campaigns`;
CREATE TABLE `campaigns`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dm_user_id` int UNSIGNED NOT NULL,
  `invite_code` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uq_campaigns_invite_code`(`invite_code` ASC) USING BTREE,
  INDEX `idx_campaigns_dm_user_id`(`dm_user_id` ASC) USING BTREE,
  CONSTRAINT `fk_campaigns_dm_user` FOREIGN KEY (`dm_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of campaigns
-- ----------------------------

-- ----------------------------
-- Table structure for characters
-- ----------------------------
DROP TABLE IF EXISTS `characters`;
CREATE TABLE `characters`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL,
  `campaign_id` int UNSIGNED NULL DEFAULT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar_filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `race` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `class` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `subclass` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `background` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `alignment` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `level` tinyint UNSIGNED NOT NULL DEFAULT 1,
  `experience_points` int UNSIGNED NOT NULL DEFAULT 0,
  `ability_str` tinyint UNSIGNED NOT NULL DEFAULT 10,
  `ability_dex` tinyint UNSIGNED NOT NULL DEFAULT 10,
  `ability_con` tinyint UNSIGNED NOT NULL DEFAULT 10,
  `ability_int` tinyint UNSIGNED NOT NULL DEFAULT 10,
  `ability_wis` tinyint UNSIGNED NOT NULL DEFAULT 10,
  `ability_cha` tinyint UNSIGNED NOT NULL DEFAULT 10,
  `proficiency_bonus` tinyint UNSIGNED NOT NULL DEFAULT 2,
  `inspiration` tinyint(1) NOT NULL DEFAULT 0,
  `armor_class` tinyint UNSIGNED NOT NULL DEFAULT 10,
  `initiative_bonus` tinyint NOT NULL DEFAULT 0,
  `speed` tinyint UNSIGNED NOT NULL DEFAULT 30,
  `hp_max` smallint UNSIGNED NOT NULL DEFAULT 10,
  `hp_current` smallint NOT NULL DEFAULT 10,
  `hp_temp` smallint UNSIGNED NOT NULL DEFAULT 0,
  `hit_dice` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1d8',
  `death_save_successes` tinyint UNSIGNED NOT NULL DEFAULT 0,
  `death_save_failures` tinyint UNSIGNED NOT NULL DEFAULT 0,
  `passive_perception` tinyint UNSIGNED NOT NULL DEFAULT 10,
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `saving_throw_proficiencies` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `currency` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `spell_slots` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `spells` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `inventory` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_characters_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_characters_campaign_id`(`campaign_id` ASC) USING BTREE,
  CONSTRAINT `fk_characters_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `fk_characters_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of characters
-- ----------------------------
INSERT INTO `characters` VALUES (1, 1, NULL, 'CanonFodder', '20260818_175853_88799bca.webp', '', '', '', '', '', 1, 0, 12, 10, 10, 10, 10, 10, 2, 0, 10, 0, 30, 10, 10, 0, '1d8', 0, 0, 10, '{}', '[]', '{\"cp\":100,\"sp\":2500,\"ep\":100,\"gp\":50,\"pp\":10}', '{\"1\":{\"max\":1,\"used\":0},\"2\":{\"max\":1,\"used\":0}}', '[{\"name\":\"Big Gulp\",\"level\":2,\"prepared\":true,\"notes\":\"\"},{\"name\":\"Little Gulp\",\"level\":1,\"prepared\":true,\"notes\":\"\"}]', '[{\"name\":\"Shield Lvl 1\",\"qty\":1,\"weight\":5,\"notes\":\"\"},{\"name\":\"\",\"qty\":1,\"weight\":0,\"notes\":\"\"}]', '[]', '', '2026-08-18 17:39:28', '2026-08-18 18:58:53');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uq_users_username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `uq_users_email`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'CanonFodder', 'simon@rundell.org.uk', '$2y$10$9R/7k/eDx9zWZqHQWBsJreKlS3duobutkA6vQPs6NN03p912nt8Sq', 'CanonFodder', '2026-08-18 17:39:16');

SET FOREIGN_KEY_CHECKS = 1;
