const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const google = require('../helpers/google.js');
const {createUser, saveDestination, checkUser} = require(`../helpers/dbHelpers.js`);
const port = 3000;
const utils = require('../helpers/utils.js');
let app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../react-client/dist'));

app.post('/places', (req, res) => {
  const userQuery = req.body.params;

  //format query differently based on whether it came from user or from DB
  const formattedQuery = userQuery.newPrefs ? utils.mapReactObj(userQuery.newPrefs) : userQuery.savedPrefs;

  google.convertAddressToLatLon(userQuery.address)
    .then((coords) => { // use lat/lng to chain the next API call
      return google.getPlaces(coords, formattedQuery); //have to map object into array
    })
    .then((places) => {
      console.log('places inside index.js is', places)

      if (places.length) {

        // let formattedPlaces = places.map((placeCat) => {
        //   return placeCat !== undefined ? placeCat.map((place) => {
        //     let formattedPlace = {
        //       "type": place.type,
        //       "google_id": place.google_id,
        //       "place_name": place.place_name,
        //       "place_address": place.place_address,
        //       "rating": place.rating,
        //       "price_level": place.price_level,
        //       "thumbnail": place.thumbnail,
        //       "category_icon": place.category_icon,
        //       "place_lat": place.place_lat,
        //       "place_long": place.place_long,
        //       "distance": place.distance,
        //       "travel_time": place.travel_time
        //     };

        //     return formattedPlace;
        //   }) : placeCat;
        // });

        let flattened = [];
        let formattedPlaces = places.map((placeCat) => {

          if (placeCat !== undefined) {
            return placeCat.map((place) => {
              let formattedPlace = {
                "type": place.type,
                "google_id": place.google_id,
                "place_name": place.place_name,
                "place_address": place.place_address,
                "rating": place.rating,
                "price_level": place.price_level,
                "thumbnail": place.thumbnail,
                "category_icon": place.category_icon,
                "place_lat": place.place_lat,
                "place_long": place.place_long,
                "distance": place.distance,
                "travel_time": place.travel_time
              };

              flattened.push(formattedPlace);

            });
          }
          console.log('flattened?', flattened[0]);
          return;
        });

        const testDestination = {
          "username": "brian",
          "address": "369 Lexington Avenue",
          "create_time": new Date()
        };

        console.log('correctly flattening api results?', JSON.stringify(flattened[0]));

        saveDestination(testDestination, flattened, (err, results) => {
          console.log('in the saveDestination callback');
          if (err) {
            console.log('err is', err);
            res.send('boo');
          } 
            console.log('results are', results);
            res.send(results);
        });

        // res.send(formattedPlaces);
      }
      else res.send('No results, please try again'); //no results so need to try again
    })
    .catch((err) => { //send error code and message asking user to try again
      console.log('err searching:', err);
      res.status(500).send(err);
    })
});

//TO FILL IN

app.get('/', function (req, res) {
  console.log(req)
  // include controller for database query 
  res.send('recieved username')
});

app.post('/login', (req, res) => {
  console.log(req.body.user);
  //req.body.user is the username
  //needs to check DB
  //mock user preferences
  const prefs = [
    {type: 'bank', query: 'chase'},
    {type: 'supermarket'},
    {type: 'restaurant', query:'coffee'},
    {type: 'gym', query: 'equinox'}
  ];
  const blank = [];
  res.send(prefs);
  // res.status(400).send({
  //   message: 'error!'
  // });
})

app.post('/preferences', function (req, res) {
  // console.log(req)
  // include controller for database query 
  // res.send('recieved preferences')
  console.log(req.body);
  let userPrefs = req.body.params.preferences;
  let username = req.body.params.username;
  //save to database
  console.log(`username is ${username} and prefs are ${JSON.stringify(userPrefs)}`)
  res.send();
});

//create test users
app.get(`/tstuser`, (req, res) => {
  checkUser({username: `brian`, password: `pw`}, (err, data) => {
    if (err) {return console.error(`error when creating user ${err}`);}
    res.send(`ROMA VICTA, data:${JSON.stringify(data)}`);
  });
})


//test the db and helper functions
app.get(`/testdb`, (req, res) => {
  console.log(`incoming get request recieved at "/testdb"`);

  //should be a post and user = req.body.username

  const testPlaces = [
    {
    "type": "bank",
    "google_id": "ChhhIJY9UK5gNZwokR60pPEpS1WKE",
    "place_name": "Chase Bank",
    "place_address": "355 Lexington Ave, New York",
    "rating": 3,
    "price_level": '',
    "thumbnail": "<a href=\"https:\/\/maps.google.com\/maps\/contrib\/100338243655446815049\/photos\">Chase Bank<\/a>",
    "category_icon": "https:\/\/maps.gstatic.com\/mapfiles\/place_api\/icons\/bank_dollar-71.png",
    "place_lat": 40.7501328,
    "place_long": -73.976499,
    "distance": "0.7mi",
    "travel_time": "4 mins"
  },
  {
    "type": "tank",
    "google_id": "HELLOChhhIJY9UK5gNZwokR60pPEpS1WKE",
    "place_name": "CHAISE! tank",
    "place_address": "359 Lexington Ave, New York",
    "rating": 3,
    "price_level": '',
    "thumbnail": "<a href=\"https:\/\/maps.google.com\/maps\/contrib\/100338243655446815049\/photos\">Chase Bank<\/a>",
    "category_icon": "https:\/\/maps.gstatic.com\/mapfiles\/place_api\/icons\/bank_dollar-71.png",
    "place_lat": 40.7501328,
    "place_long": -73.976499,
    "distance": "0.7mi",
    "travel_time": "4 mins",
  }
];

  const testDestination = {
    "username": "brian",
    "address": "369 Lexington Ave",
    "create_time": new Date()
  };

  saveDestination(testDestination, testPlaces, (err, results) => {
    console.log('in the saveDestination callback');
    if (err) {
      console.log('err is', err);
      res.end('boo');
    } 
      console.log('results are', results);
      res.end('ROMA FUCKING VICTA!');
  });
})



app.listen(port, () => console.log(`listening on port ${port}`));