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

const getPlace = (coords, searchTerms) => {
  /*
  searchTerms are something like {type: 'bank', query: 'chase', radius: '50'}
  */
//  const testCoords = {lat: 40.750576, lng: -73.97643719999999}; //organize this data better
//  const searchTerms = {type: 'bank', query: 'chase', radius: '50'};
 const params = {
   key: apiKey,
   location: `${coords.lat},${coords.lng}`,
   radius: searchTerms.radius,
   type: searchTerms.type,
   keyword: searchTerms.query
 };
 return axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?', {params: params})
  .then(resp => {
    console.log('resp from google places is', JSON.stringify(resp.data.results));
    return resp.data.results;
  })
  .catch(err => console.log('error from google places API is', err))
}

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

exports.convertAddressToLatLon = convertAddressToLatLon;
exports.getPlace = getPlace;
exports.getPlaces = getPlaces;






        