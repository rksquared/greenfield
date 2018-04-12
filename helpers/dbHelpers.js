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
        if (err) { return console.error(`Error in selecting saved destinations: ${err}`); }

        console.log('results from querying saved destinations for matches with userId', JSON.stringify(destinations));

        let destinationIDs = destinations.map((dest) => {
          return dest.id;
        });

        console.log(`destination IDs: ${destinationIDs}`);


        const getAllFavorites = (destinationIDs, callback) => {
          let faves = [];
          Promise.all(destinationIDs.map((eachDest, topLevelMapIdx) => {
            return new Promise((resolve, reject) => {
              connection.query(`SELECT google_id_saved_places, travel_time, distance FROM destination_to_place WHERE id_saved_destination= ${eachDest}; `, (err, matches) => {
                if (err) { return console.error(`Error selecting placeIds with the from join table: ${err}`); }

                // console.log(`Results from retrieving matching placeIds from join table: ${JSON.stringify(matches)}`);

                let googlePlaceIDs = matches.map((match) => {
                  return match.google_id_saved_places;
                });

                // console.log(`mapped google place ids: ${googlePlaceIDs}, typeof: ${Array.isArray(googlePlaceIDs)}`);

                let bulkPlaceQuery = googlePlaceIDs.map((google_id) => {
                  return `SELECT * FROM saved_places WHERE google_id= '${google_id}'; `;
                }).join('');

                // console.log(`BULK QUERY from mapped google_ids: ${bulkPlaceQuery}`);

                let travelTimeInfo = matches.map((match) => {
                  return [match.destination, match.travel_time];
                });


                resolve(new Promise((resolve, reject) => {
                  console.log('bet you this runs when we thing it should')

                  connection.query(bulkPlaceQuery, (err, places) => {
                    if (err) { return console.error(`Error selecting places with the filtered google_id from saved_places: ${err}`); }

                    // console.log(`Success! All matching place objects for ${eachDest}: ${JSON.stringify(places)}`);

                    let { dest_address, create_time, dest_lat, dest_long, rating } = destinations[topLevelMapIdx];


                    let fave = {
                      address: dest_address,
                      createdAd: create_time,
                      lat: dest_lat,
                      long: dest_long,
                      rating: rating,
                      places: places.map((place, idx) => {
                        place = place.join('');
                        place['travel_time'] = travelTimeInfo[idx][1];
                        place['distance'] = travelTimeInfo[idx][0];
                        return place;
                      })
                    };
                    console.log('what are pushing to fave', fave)

                    // faves.push(fave);
                    resolve(fave);

                    // console.log('faves on each map iteration', faves

                  });


                }))
              });

                }); 
              
            })).then((vals) => {
              console.log('is faves anything?', vals)
              callback(vals)
            })
          
          
        }

        getAllFavorites(destinationIDs, (results) => {

          // console.log('results correctly composed FINALLY', results);
          cb(err, results);
            // .then((res) => {
            //   cb(err, res);
            // })
            // .catch((err) => {
            //   cb(err);
            // })

          // cb(err, results);
        });


      //   let joinQuery = destinationIDs.map((destination) => {
      //     return `SELECT google_id_saved_places, travel_time, distance FROM destination_to_place WHERE id_saved_destination= ${destination}; `;
      //   }).join('');

      //   console.log(`JOIN QUERY from mapped destination ids: ${joinQuery}`);

      //   connection.query(joinQuery, (err, matches) => {
      //     if (err) {return console.error(`Error selecting placeIds with the from join table: ${err}`);}

      //     console.log(`Results from retrieving matching placeIds from join table: ${JSON.stringify(matches)}`);

      //     let googlePlaceIDs = matches.map((destMatch) => {
      //       return destMatch.map((match) => {
      //         console.log(`match.google_id_saved_places: ${match.google_id_saved_places}, typeof ${typeof match.google_id_saved_places}`)
      //         return match.google_id_saved_places;
      //       });
      //     });

      //     console.log(`mapped google place ids: ${googlePlaceIDs}, typeof: ${Array.isArray(googlePlaceIDs)}`);

      //     let bulkPlaceQuery = googlePlaceIDs.map((dest, idx) => {
      //       return dest.map((google_id) => {
      //         console.log(`each google id: ${google_id}`);
      //         return `SELECT * FROM saved_places WHERE google_id= '${google_id}'; `;
      //       }).join('')
      //     }).join('');

      //     console.log(`BULK QUERY from mapped google_ids: ${bulkPlaceQuery}`);

      //     let travelTimeInfo = matches.map((destMatch) => {
      //         return destMatch.map((match) => {
      //           return [match.destination, match.travel_time];
      //         });
      //     });


      //     connection.query(bulkPlaceQuery, (err, places) => {
      //       if (err) {return console.error(`Error selecting places with the filtered google_id from saved_places: ${err}`);}
  
      //       console.log(`Success! All matching place objects: ${JSON.stringify(places)}`);

      //       let faves = destinations.reduce((userData, {dest_address, create_time, dest_lat, dest_long, rating}, idx) => {
      //         let fave = {
      //           address: dest_address,
      //           createdAd: create_time,
      //           lat: dest_lat,
      //           long: dest_long,
      //           rating: rating,
      //           places: places,
      //           travel_time: travelTimeInfo[idx][1],
      //           distance: travelTimeInfo[idx][0]
      //         }

      //         userData.push(fave);

      //         return userData;
      //       }, []);
            
      //       cb(err, faves);
      //     });

      //   });

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
  
  const storePlaces = ` INSERT IGNORE INTO saved_places (type, google_id, place_name, place_address, rating, price_level, thumbnail, category_icon, place_lat, place_long) VALUES ?`;
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
          bulkJoinFKIDs.push([result[0].id, placeIDs[idx], places[idx].distance, places[idx].travel_time]);
        })

        console.log('mapped out bulkJoin IDs', bulkJoinFKIDs);

        connection.query(`INSERT INTO destination_to_place (id_saved_destination, google_id_saved_places, distance, travel_time) VALUES ?;`, [bulkJoinFKIDs], (err, results) => {
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
      if (!(key === "travel_time" || key === "distance")) {
        // console.log(`keys in bulk insertion formatting: ${key}`);
        row.push(place[key]);
      }
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
