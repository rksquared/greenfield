const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const google = require('../helpers/google.js');
const {createUser} = require(`../helpers/dbHelpers.js`);
const port = 3000;
let app = express();

app.use(bodyParser.json());

app.get('/places', (req, res) => {
  //below is just test data but this should ultimately come from user data/front-end
  const testAddress = '369 Lexington Ave, New York NY';
  const badAddress = '5';
  const simpleQuery = [{type: 'bank', query: 'chase', radius: '50'}]; //query should be in an array

  const complicatedQuery = [
    {type: 'bank', query: 'chase', radius: '50'},
    {type: 'supermarket', radius: '500'},
    {type: 'liquor_store', radius: '500'},
    {type: 'gym', query: 'equinox', radius: '500'}
  ];
  //end of test data

  google.convertAddressToLatLon(testAddress)
    .then((coords) => { // use lat/lng to chain the next API call
      return google.getPlaces(coords, complicatedQuery);
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

  createUser({username: `rahul`, password: `pw`}, (err, data) => {
    if (err) {return console.error(`error when creating user ${err}`);}
    res.send(`ROMA VICTA`);
  });
})

//testing routes

app.post('/login', function (req, res) {
  console.log(req)
  // include controller for database query 
  res.send('recieved username')
});

app.post('/preferences', function (req, res) {
  console.log(req)
  // include controller for database query 
  res.send('recieved preferences')
});

app.post('/googleApi', function (req, res) {
  console.log(req)
  // include controller for database query 
  res.send('address received')
});

app.listen(port, () => console.log(`listening on port ${port}`));