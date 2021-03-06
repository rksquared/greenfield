const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const google = require('../helpers/google.js');
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

  google.convertAddressToLatLon(testAddress)
    .then((coords) => { // use lat/lng to chain the next API call
      return google.getPlaces(coords, complicatedQuery);
    }) 
    .then((places) => {
      console.log('results from getPlaces are', places);
      // if there are no results, either the query needs to be broadened
      // or the address was wrong, so send a message asking the user to try again
      if (places.length) res.send(places);
      else res.send('No results, please try again');
    })
    .catch((err) => { //send error code and message asking user to try again
      console.log('err searching:', err);
      res.status(500).send(err);
    }) 
});

app.listen(port, () => console.log(`listening on port ${port}`));