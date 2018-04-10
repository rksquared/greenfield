const apiKey = require('../config.js').GOOGLE_API_KEY;
const axios = require('axios');

const convertAddressToLatLon = (address, cb) => {
  const params = {address: address, key: apiKey};
  return axios.get('https://maps.googleapis.com/maps/api/geocode/json?', {params: params})
    .then(resp => {
      console.log('lat and lon inside halpers are', resp.data.results[0].geometry.location.lat, resp.data.results[0].geometry.location.lng);
      return resp.data.results[0].geometry.location; //returns a chainable promise
    })
    .catch(err => console.log('err trying to get lat/lon from google:', err)) //not sure if this needs to be here or should just be chained
};

exports.convertAddressToLatLon = convertAddressToLatLon;







        