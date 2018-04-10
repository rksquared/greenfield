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


CREATE TABLE saved_searches (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  id_users INTEGER NOT NULL,
  search_address VARCHAR(255) NOT NULL,
  create_time DATETIME NOT NULL,
  search_lat DECIMAL,
  search_long DECIMAL,
  rating DECIMAL,
  FOREIGN KEY (id_users)
        REFERENCES users(id)
        ON DELETE CASCADE 
);


CREATE TABLE saved_places (
  google_id INTEGER NOT NULL PRIMARY KEY,
  place_name VARCHAR(100) NOT NULL,
  place_address VARCHAR(255) NOT NULL,
  rating DECIMAL,
  price_level DECIMAL,
  thumbnail VARCHAR(500),
  category_icon VARCHAR(500),
  place_lat DECIMAL,
  place_long DECIMAL,
  travel_dist DECIMAL
);

CREATE TABLE search_to_place_join (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  google_id_saved_places INTEGER NOT NULL,
  id_saved_searches INTEGER NOT NULL,
  FOREIGN KEY (google_id_saved_places)
        REFERENCES saved_places(google_id)
        ON DELETE CASCADE,
  FOREIGN KEY (id_saved_searches)
        REFERENCES saved_searches(id)
        ON DELETE CASCADE
);