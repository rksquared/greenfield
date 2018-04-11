const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const google = require('../helpers/google.js');
const {createUser, savePlace} = require(`../helpers/dbHelpers.js`);
const port = 3000;
const utils = require('../helpers/utils.js');
let app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../react-client/dist'));

app.post('/places', (req, res) => {
  //below is just test data but this should ultimately come from user data/front-end
  // const testAddress = '369 Lexington Ave, New York NY';
  // // const badAddress = '5';
  // // const simpleQuery = [{type: 'bank', query: 'chase'}]; //query should be in an array

  // // const complicatedQuery = [
  // //   {type: 'bank', query: 'chase', radius: '50'},
  // //   {type: 'supermarket', radius: '500'},
  // //   {type: 'restaurant', radius: '500'},
  // //   {type: 'gym', query: 'equinox', radius: '500'}
  // // ];

  // const complicatedQueryNoRadius = [
  //   {type: 'bank', query: 'chase'},
  //   {type: 'supermarket'},
  //   {type: 'restaurant', query:'coffee'},
  //   {type: 'gym', query: 'equinox'}
  // ];
  //end of test data

  const userQuery = req.body.params;
  // console.log('userquery is', userQuery);
  const formattedQuery = utils.mapReactObj(userQuery.prefs);

  google.convertAddressToLatLon(userQuery.address)
    .then((coords) => { // use lat/lng to chain the next API call
      return google.getPlaces(coords, formattedQuery); //have to map object into array
    }) 
    .then((places) => {
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


//test the db and helper functions
app.get(`/testdb`, (req, res) => {
  console.log(`incoming get request recieved at "/testdb"`);

  // createUser({username: `rahul`, password: `pw`}, (err, data) => {
  //   if (err) {return console.error(`error when creating user ${err}`);}
  //   res.send(`ROMA VICTA`);
  // });
  const testPlace = {
    "type": "bank",
    "place_lat": 40.7501328,
    "place_long": -73.976499,
    "category_icon": "https:\/\/maps.gstatic.com\/mapfiles\/place_api\/icons\/bank_dollar-71.png",
    "google_id": "ChIJY9UK5gNZwokR60pPEpS1WKE",
    "place_name": "Chase Bank",
    "rating": 3,
    "place_address": "355 Lexington Ave, New York",
    "thumbnail": "<a href=\"https:\/\/maps.google.com\/maps\/contrib\/100338243655446815049\/photos\">Chase Bank<\/a>",
    "price_level": ""
  };

  savePlace(testPlace, (err, results) => {
    if (err) {
      console.log('err is', err);
      res.end('boo');
    } else {
      console.log('results are', results);
      res.end('results!');
    }
  })
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