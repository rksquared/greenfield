const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const google = require('../helpers/google.js');
const port = 3000;
let app = express();

app.use(bodyParser.json());

app.post('/search', (req, res) => {
  //address and other params (i.e. things like bank) would come in as part of req
  const testAddress = '369 Lexington Ave, New York NY';
  const badAddress = '5';
  const query = {type: 'bank', query: 'chase', radius: '50'};
  google.convertAddressToLatLon(testAddress)
  .then((coords) => {
    return google.getPlaces(coords, query)
  }) // use lat/lng to chain the next API call
  .then((places) => {
    console.log('places are', places);
    // if there are no results, either the query needs to be broadened
    // or the address was wrong, so send a message asking the user to try again
    if (places.length) res.send(places);
    else res.send('No results, please try again');
  })
  .catch((err) => {
    console.log('err searching:', err);
    res.status(500).send(err);
  }) //send error code and message asking user to try again
});

app.get('/places', (req, res) => {
  google.getPlaces('dummy', 'data')
    .then(results => console.log('results from googleAPI are', results))
    .catch(err => console.log('err in get/places is', err))
})

app.listen(port, () => console.log(`listening on port ${port}`));