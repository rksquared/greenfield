const apiKey = require('../config.js').GOOGLE_API_KEY;
const axios = require('axios');

const convertAddressToLatLon = (address) => {
  const params = {address: address, key: apiKey};
  return axios.get('https://maps.googleapis.com/maps/api/geocode/json?', {params: params})
    .then(resp => {
      // console.log('lat and lon inside halpers are', resp.data.results[0].geometry.location.lat, resp.data.results[0].geometry.location.lng);
      return resp.data.results[0].geometry.location; //returns a chainable promise
    })
    .catch(err => console.log('err trying to get lat/lon from google:', err)) //not sure if this needs to be here or should just be chained
};

const getPlaces = (coords, searchArr) => {
  //map searchArr to promises
  const searchPromises = searchArr.map((searchTerms) => {
    //set up params for each search in the searchArr
    const params = {
      key: apiKey,
      location: `${coords.lat},${coords.lng}`,
      radius: searchTerms.radius,
      type: searchTerms.type,
      keyword: searchTerms.query
    };
    //return a promise
    return axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?', {params: params})
      .then(resp => {
        console.log('resp from google places is', JSON.stringify(resp.data.results));
        return resp.data.results;
      })
      .catch(err => console.log('error from google places API is', err))
  })
  //return the mapped set of promises
  return Promise.all(searchPromises);
}

const getTravelDistance = (coords, placeID, userTravelPrefs) => {
  // TODO: Currently only gives travel times if driving...add support for walking, transit
  const params = {
    key: apiKey,
    origins: `${coords.lat},${coords.lng}`,
    destinations: `place_id:${placeID}`,
    units: 'imperial',
    mode: userTravelPrefs.mode
  }

  return axios.get('https://maps.googleapis.com/maps/api/distancematrix/json?', {params: params})
    .then(resp => {
      return {
        mode: userTravelPrefs.mode,
        distanceText: resp.data.rows[0].elements[0].distance.text,
        distanceValue: resp.data.rows[0].elements[0].distance.value,
        durationText: resp.data.rows[0].elements[0].duration.text,
        durationValue: resp.data.rows[0].elements[0].duration.value
      }
    })
    .catch(err => console.log('error from google distance API is', err))
}

exports.convertAddressToLatLon = convertAddressToLatLon;
exports.getPlaces = getPlaces;
exports.getTravelDistance = getTravelDistance;






        