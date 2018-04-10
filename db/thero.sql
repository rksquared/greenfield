-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'users'
-- 
-- ---

DROP TABLE IF EXISTS `users`;
		
CREATE TABLE `users` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `username` VARCHAR(60) NOT NULL DEFAULT 'NULL',
  `password` VARCHAR(20) NOT NULL DEFAULT 'NULL',
  `bank` VARCHAR(60) NOT NULL DEFAULT 'NULL',
  `grocery_store` VARCHAR(60) NOT NULL DEFAULT 'NULL',
  `coffee_shop` VARCHAR(60) NOT NULL DEFAULT 'NULL',
  `gym_membership` VARCHAR(60) NOT NULL DEFAULT 'NULL',
  `laundromat` VARCHAR(60) NOT NULL DEFAULT 'NULL',
  `dry_cleaner` VARCHAR(60) NOT NULL DEFAULT 'NULL',
  `hair_care` VARCHAR(60) NOT NULL DEFAULT 'NULL',
  `convenience_store` VARCHAR(60) NOT NULL DEFAULT 'NULL',
  `public_transit` VARCHAR(80) NOT NULL DEFAULT 'NULL',
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'saved_searches'
-- 
-- ---

DROP TABLE IF EXISTS `saved_searches`;
		
CREATE TABLE `saved_searches` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `id_users` INTEGER NULL DEFAULT NULL,
  `search_address_nat` VARCHAR(255) NULL DEFAULT NULL,
  `create_time` DATETIME NULL DEFAULT NULL,
  `search_latitude` DECIMAL NULL DEFAULT NULL,
  `search_longitude` DECIMAL NULL DEFAULT NULL,
  `travelhero_rating` DECIMAL NOT NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'saved_places'
-- 
-- ---

DROP TABLE IF EXISTS `saved_places`;
		
CREATE TABLE `saved_places` (
  `google_id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `place_name` VARCHAR(100) NULL DEFAULT NULL,
  `place_address_nat` VARCHAR(255) NULL DEFAULT NULL,
  `rating` DECIMAL NOT NULL DEFAULT NULL,
  `price_level` DECIMAL NOT NULL DEFAULT NULL,
  `thumbnail_link` VARCHAR(500) NULL DEFAULT NULL,
  `category_icon_link` VARCHAR(255) NULL DEFAULT NULL,
  `place_longitude` DECIMAL NULL DEFAULT NULL,
  `place_latitude` DECIMAL NULL DEFAULT NULL,
  `travel_distance` DECIMAL NOT NULL DEFAULT NULL,
  PRIMARY KEY (`google_id`)
);

-- ---
-- Table 'saved_search-place_join'
-- 
-- ---

DROP TABLE IF EXISTS `saved_search-place_join`;
		
CREATE TABLE `saved_search-place_join` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `google_id_saved_places` INTEGER NULL DEFAULT NULL,
  `id_saved_searches` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `saved_searches` ADD FOREIGN KEY (id_users) REFERENCES `users` (`id`);
ALTER TABLE `saved_search-place_join` ADD FOREIGN KEY (google_id_saved_places) REFERENCES `saved_places` (`google_id`);
ALTER TABLE `saved_search-place_join` ADD FOREIGN KEY (id_saved_searches) REFERENCES `saved_searches` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `saved_searches` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `saved_places` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `saved_search-place_join` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `users` (`id`,`username`,`password`,`bank`,`grocery_store`,`coffee_shop`,`gym_membership`,`laundromat`,`dry_cleaner`,`hair_care`,`convenience_store`,`public_transit`) VALUES
-- ('','','','','','','','','','','','');
-- INSERT INTO `saved_searches` (`id`,`id_users`,`search_address_nat`,`create_time`,`search_latitude`,`search_longitude`,`travelhero_rating`) VALUES
-- ('','','','','','','');
-- INSERT INTO `saved_places` (`google_id`,`place_name`,`place_address_nat`,`rating`,`price_level`,`thumbnail_link`,`category_icon_link`,`place_longitude`,`place_latitude`,`travel_distance`) VALUES
-- ('','','','','','','','','','');
-- INSERT INTO `saved_search-place_join` (`id`,`google_id_saved_places`,`id_saved_searches`) VALUES
-- ('','','');