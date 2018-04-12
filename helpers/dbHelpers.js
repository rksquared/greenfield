const mysql = require(`mysql`);

const connection = mysql.createConnection({
  multipleStatements: true,
  user: `root`,
  database: `thero`
});

connection.connect();


const checkUser = (user, cb) => {
  connection.query(`SELECT * FROM users WHERE username = ?`, user.username, (err, results) => {
    if (err) {
      return console.error(`Error when trying to query the database to check for dupes when creating a new user: ${err}`);
    }

    console.log(`Hitting the DB! User with username ${user.username} currently ${results ? `does exist, retrieving faves` : `doesn't exist. Hang on! Issuing redirect`}; raw results: ${JSON.stringify(results)}`);   
    
    if (results.length === 0) {
      createUser(user, cb);
      
    }
    else {
      console.log('checking for faves!');

      let userId = results[0].id;

      connection.query(`SELECT * FROM saved_destinations WHERE id_users= ${userId}`, (err, destinations) => {
        if (err) {return console.error(`Error in selecting saved destinations: ${err}`);}

        console.log('results from querying saved destinations for matches with userId', JSON.stringify(destinations));

        let destinationIDs = destinations.map((dest) => {
          return dest.id;
        });

        connection.query(`SELECT google_id_saved_places FROM destination_to_place WHERE id_saved_destination= ?`, [destinationIDs], (err, placeIDs) => {
          if (err) {return console.error(`Error selecting placeIds with the from join table: ${err}`);}

          console.log(`Results from retrieving matching placeIds from join table: ${JSON.stringify(placeIDs)}`);

          let googlePlaceIDs = placeIDs.map((match) => {
            console.log(`match.google_id_saved_places: ${match.google_id_saved_places}, typeof ${typeof match.google_id_saved_places}`)
            return match.google_id_saved_places;
          });

          console.log(`mapped google place ids: ${googlePlaceIDs}, typeof: ${Array.isArray(googlePlaceIDs)}`);

          connection.query(`SELECT * FROM saved_places WHERE google_id= ?`, googlePlaceIDs, (err, places) => {
            if (err) {return console.error(`Error selecting places with the filtered google_id from join table: ${err}`);}
  
            console.log(`Success! All matching place objects: ${JSON.stringify(places)}`);

            let faves = destinations.reduce((userData, {dest_address, create_time, dest_lat, dest_long, rating}, idx) => {
              let fave = {
                address: dest_address,
                createdAd: create_time,
                lat: dest_lat,
                long: dest_long,
                rating: rating,
                places: places
              }

              userData.push(fave);

              return userData;
            }, []);
            
            cb(err, faves);
          });

        });

      });


    }
  });
}


const createUser = (user, cb) => {
  connection.query(`INSERT INTO users SET ?`, user, (err, results) => {
    if (err) {return console.error(`error creating new user: ${err}`);}
    
    console.log(`success! new user ${user.username} created!`)
    cb(err, results);
  });
}


//save new search
const saveDestination = (destination, places, cb) => {

//format date from JS UTC to MYSQL DATETIME
  function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
  }


  Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
  };

  const storeDestination = `INSERT INTO saved_destinations SET id_users= (SELECT id FROM users WHERE username= '${destination.username}'), dest_address= '${destination.address}', create_time= '${destination.create_time.toMysqlFormat()}';`;
  
  const storePlaces = ` INSERT IGNORE INTO saved_places (type, google_id, place_name, place_address, rating, price_level, thumbnail, category_icon, place_lat, place_long, radius, travel_dist) VALUES ?`;
  // console.log(`date reformat: ${destination.create_time.toMysqlFormat()} typeof: ${typeof destination.create_time.toMysqlFormat()}`)
  // console.log(`multi-line SQL statement: ${storeDestination + storePlaces}`);
  connection.query((storeDestination + storePlaces), [placesInsertionQuery(places)], (err, results) => {
    if (err) {
      return console.error(`Error saving destination: ${err}`);
    } 
      console.log('result from store to saved_places and saved_destinations', results);
      connection.query(`SELECT id FROM saved_destinations WHERE dest_address= '${destination.address}' AND create_time= '${destination.create_time.toMysqlFormat()}'`, (err, result) => {
        if (err) {return console.error(`error in selecting ID for destination join: ${err}`);}
        let placeIDs = bulkJoinPlaceIds(places);
        let bulkJoinFKIDs = [];
        
        console.log('result from select ID from desintation table query: ', result[0].id);
        
        places.forEach((place, idx) => {
          bulkJoinFKIDs.push([result[0].id, placeIDs[idx]]);
        })

        console.log('mapped out bulkJoin IDs', bulkJoinFKIDs);

        connection.query(`INSERT INTO destination_to_place (id_saved_destination, google_id_saved_places) VALUES ?;`, [bulkJoinFKIDs], (err, results) => {
          if (err) {return console.error(`Error saving destination/places in join table: ${err}`);}
          cb(err, results);
        });

      } )
  });

  // connection.query(storePlaces, [placesInsertionQuery(places)], (err, results) => {
  //   cb(err, results);
  // })
}

const placesInsertionQuery = (places) => {

  const bulkInsertParams = places.reduce((formattedArr, place) => {
    let row = [];
    
    for (key in place) {
      row.push(place[key]);
    }

    formattedArr.push(row);
    
    return formattedArr;
  }, []);

  // console.log(`bulkInsertParams ${bulkInsertParams}`);

  return bulkInsertParams;
}

const bulkJoinPlaceIds = (places) => {
  let placeIds = places.map((place) => {
    return place.google_id;
  });

  console.log('place ids after mapping:', placeIds);
  return placeIds;
}

module.exports.createUser = createUser;
module.exports.saveDestination = saveDestination;
module.exports.checkUser = checkUser;
