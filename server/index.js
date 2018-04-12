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

app.post('/save', (req, res) => {
  console.log('trying to save', req.body.params.place);
  console.log('user is', req.body.params.username);
  console.log('dest is', req.body.params.address)
  //SAVE PLACE INTO DB
  res.send('server is trying to save');
})

app.post('/places', (req, res) => {
  const userQuery = req.body.params;
  // console.log('userquery is', userQuery);
  let formattedQuery;
  if (userQuery.newPrefs) {
    formattedQuery = utils.mapReactObj(userQuery.newPrefs);
  } else {
    formattedQuery = userQuery.savedPrefs;
  }
  // const formattedQuery = utils.mapReactObj(userQuery.prefs);

  google.convertAddressToLatLon(userQuery.address)
    .then((coords) => { // use lat/lng to chain the next API call
      return google.getPlaces(coords, formattedQuery); //have to map object into array
    }) 
    .then((places) => {
      console.log('places inside index.js is', places)
      if (places.length) res.send(places);
      else res.send('No results, please try again'); //no results so need to try again
    })
    .catch((err) => { //send error code and message asking user to try again
      console.log('err searching:', err);
      res.status(500).send(err);
    }) 
});

const mapReactObj = (reactObj) => {
	let googleArr = [];
	for (var type in reactObj) {
		if (reactObj[type] === true || reactObj[type] === 'any') {
			console.log('el is', type, reactObj[type]);
			googleArr.push({
				type: type
			})
		} else if (reactObj[type].length) {
			googleArr.push({
				type: type,
				query: reactObj[type]
			})
		}
	}
	return googleArr;
}

app.get('/distance', (req, res) => {
  //hard coded test data
  const testAddress = '369 Lexington Ave, New York NY';
  const testPlaceID = "ChIJVZZL0gFZwokR97jnexo4Z44"; //we should have this for all places as a result of the places API
  const userTravelPrefs = {
    mode: 'walking' // driving is default mode, also supports walking and bicycling
  }
  //end of test data
  
  google.convertAddressToLatLon(testAddress)
    .then((coords) => {
      return google.getTravelDistance(coords, testPlaceID, userTravelPrefs);
    })
    .then((data) => {
      console.log('travel distance data is', data);
      res.send(data);
    })
    .catch((err) => { //send error code and message asking user to try again
      console.log('err searching:', err);
      res.status(500).send(err);
    }) 
});

app.get('/distances', (req, res) => {
  //hard coded test data
  const testAddress = '369 Lexington Ave, New York NY';
  const testPlaceIDs = [
    "ChIJVZZL0gFZwokR97jnexo4Z44", "ChIJt5cK5gNZwokR4S9PcCtCTcQ", "ChIJt5cK5gNZwokRhY1eWF9Wwdg"
  ]; //we should have this for all places as a result of the places API
  const userTravelPrefs = {
    mode: 'walking' // driving is default mode, also supports walking and bicycling
  }
  //end of test data
  
  google.convertAddressToLatLon(testAddress)
    .then((coords) => {
      return google.getTravelDistances(coords, testPlaceIDs, userTravelPrefs);
    })
    .then((data) => {
      console.log('travel distance data is', data);
      res.send(data);
    })
    .catch((err) => { //send error code and message asking user to try again
      console.log('err searching:', err);
      res.status(500).send(err);
    }) 
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
    "radius": null,
    "travel_dist": null
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
    "radius": null,
    "travel_dist": null,
  }
];

  const testDestination = {
    "username": "brian",
    "address": "369 Lexington Avenue",
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

//testing routes

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
  res.send(blank);
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

app.post('/googleApi', function (req, res) {
  console.log(req)
  // include controller for database query 
  res.send('address received')
});

app.listen(port, () => console.log(`listening on port ${port}`));