const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const google = require('../helpers/google.js');
const port = 3000;
let app = express();

app.use(bodyParser.json());

app.post('/search', (req, res) => {
  //address and other params (i.e. things like bank)would come in as part of req
  const address = '369 Lexington Ave, New York NY';
  google.convertAddressToLatLon(address)
  .then((location) => console.log('lat and long are', location.lat, location.lng)) // use lat/lng to chain the next API call
  .catch(() => console.log('Sorry, please enter a valid address')) //send error code and message asking user to try again
});

app.get('/places', (req, res) => {
  google.getPlaces('dummy', 'data')
    .then(results => console.log('results from googleAPI are', results))
    .catch(err => console.log('err in get/places is', err))
})

app.listen(port, () => console.log(`listening on port ${port}`));