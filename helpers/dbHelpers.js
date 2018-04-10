const mysql = require(`mysql`);

const connection = mysql.createConnection({
  user: `root`,
  database: `thero`
});

connection.connect();

//create user
const createUser = (user, cb) => {
  connection.query(`SELECT username FROM users WHERE username = ?`, user.username, (err, results) => {
    if (err) {
      return console.error(`Error when trying to query the database to check for dupes when creating a new user: ${err}`);
    }
    
      console.log(`hiting the DB! no user with username ${user.username} currently exits. Hang on! Creating it, results: ${results}`);

      connection.query(`INSERT INTO users SET ?`, user, (err, results) => {
        cb(err, results);
      });
    
  })
}

//check user



//save new search


//retrieve user data (i.e. all saved searches for a given user)


module.exports.createUser = createUser;


// old DB join table sql

// DROP TABLE IF EXISTS `saved_search-place_join`;
		
// CREATE TABLE `saved_search-place_join` (
//   `id` INTEGER NOT NULL AUTO_INCREMENT,
//   `google_id_saved_places` INTEGER NOT NULL,
//   `id_saved_searches` INTEGER NOT NULL,
//   PRIMARY KEY (`id`)
// );

// -- ---
// -- Foreign Keys 
// -- ---

// ALTER TABLE `saved_searches` ADD FOREIGN KEY (id_users) REFERENCES `users` (`id`);
// ALTER TABLE `saved_search-place_join` ADD FOREIGN KEY (google_id_saved_places) REFERENCES `saved_places` (`google_id`);
// ALTER TABLE `saved_search-place_join` ADD FOREIGN KEY (id_saved_searches) REFERENCES `saved_searches` (`id`)