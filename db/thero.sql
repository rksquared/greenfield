DROP DATABASE IF EXISTS thero;
CREATE DATABASE thero;

USE thero;

CREATE TABLE users (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(60) NOT NULL UNIQUE,
  password VARCHAR(20) NOT NULL,
  bank VARCHAR(60),
  grocery_store VARCHAR(60),
  coffee_shop VARCHAR(60),
  gym_membership VARCHAR(60),
  laundromat VARCHAR(60),
  dry_cleaner VARCHAR(60),
  hair_care VARCHAR(60),
  convenience_store VARCHAR(60),
  public_transit VARCHAR(60)
);


CREATE TABLE saved_destinations (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_users INTEGER NOT NULL,
  dest_address VARCHAR(255) NOT NULL,
  create_time DATETIME NOT NULL,
  dest_lat DECIMAL,
  dest_long DECIMAL,
  rating DECIMAL,
  FOREIGN KEY (id_users)
        REFERENCES users(id)
        ON DELETE CASCADE 
);


CREATE TABLE saved_places (
  type VARCHAR(255) NOT NULL,
  google_id VARCHAR(255) NOT NULL PRIMARY KEY,
  place_name VARCHAR(100) NOT NULL,
  place_address VARCHAR(255) NOT NULL,
  rating DECIMAL,
  price_level VARCHAR(140),
  thumbnail VARCHAR(500),
  category_icon VARCHAR(500),
  place_lat DECIMAL,
  place_long DECIMAL,
  radius INTEGER,
  travel_dist DECIMAL
);

CREATE TABLE destination_to_place (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  google_id_saved_places VARCHAR(255),
  id_saved_destination INTEGER,
  FOREIGN KEY (google_id_saved_places)
      REFERENCES saved_places(google_id)
      ON DELETE CASCADE,
  FOREIGN KEY (id_saved_destination)
      REFERENCES saved_destinations(id)
      ON DELETE CASCADE
);