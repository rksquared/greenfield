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
  const searchPromises = searchArr.map((searchTerms) => {
    //set up params for each search in the searchArr
    const params = {
      key: apiKey,
      location: `${coords.lat},${coords.lng}`,
      // radius: searchTerms.radius,
      rankby: 'distance',
      type: searchTerms.type,
      keyword: searchTerms.query
    };
    //return a promise
    return axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?', {params: params})
      .then(resp => {
        // console.log('resp from google places for single place is', JSON.stringify(resp.data.results));
        // return resp.data.results;
        return simplifyGoogleResults(resp.data.results, searchTerms.type);
      })
      .then(data => {
        const placeIds = data.map(place => {
          return place.google_id;
        });
        const destinationStr = placeIds.reduce((queryStr, dest) => {
          return queryStr + `place_id:${dest}|`
        }, '');
        const params = {
          key: apiKey,
          origins: `${coords.lat},${coords.lng}`,
          destinations: destinationStr.slice(0, -1), //get rid of last pipe
          units: 'imperial',
          mode: 'driving'
        };
        return {oldData: data, params: params}
      })
      .then(data => {
        return axios.get('https://maps.googleapis.com/maps/api/distancematrix/json?', {params: data.params})
          .then(resp => {
            console.log('old data is', data.oldData);
            console.log('new data is', resp.data);
            return addDistanceInfo(data.oldData, resp.data);
          })
      })
      // .then(data => console.log('last then was reached, data is ', JSON.stringify(data)))
      .catch(err => console.log('error from google places API is', err))
  })
  //return the mapped set of promises
  return Promise.all(searchPromises);
}

const simplifyGoogleResults = (data, type) => {
  console.log('data is ', data);
  return data.map((results) => {
    return {
      type: type,
      place_lat: results.geometry.location.lat,
      place_long: results.geometry.location.lng,
      category_icon: results.icon,
      google_id: results.place_id,
      place_name: results.name,
      rating: results.rating || 0,
      place_address: results.vicinity,
      thumbnail: results.photos ? results.photos[0].html_attributions[0] : '',
      price_level: results.price_level ? results.price_level : ''
    }
  })
}

const addDistanceInfo = (oldData, newData) => {
  return oldData.map((placeInfo, i) => {
    const distInfo = newData.rows[0].elements[i];
    return Object.assign({
      distance: distInfo.distance.text,
      travel_time: distInfo.duration.text
    }, placeInfo);
  })
};

const getTravelDistances = (coords, dests, userTravelPrefs) => {
  const destinationStr = dests.reduce((queryStr, dest) => {
    return queryStr + `place_id:${dest}|`
  }, '');

  console.log('destinationStr is', destinationStr);
  const params = {
    key: apiKey,
    origins: `${coords.lat},${coords.lng}`,
    destinations: destinationStr.slice(0, -1), //get rid of last pipe
    units: 'imperial',
    mode: userTravelPrefs.mode || 'driving'
  }

  return axios.get('https://maps.googleapis.com/maps/api/distancematrix/json?', {params: params})
    .then(resp => {
      return resp.data;
      // return {
      //   mode: userTravelPrefs.mode,
      //   distanceText: resp.data.rows[0].elements[0].distance.text,
      //   distanceValue: resp.data.rows[0].elements[0].distance.value,
      //   durationText: resp.data.rows[0].elements[0].duration.text,
      //   durationValue: resp.data.rows[0].elements[0].duration.value
      // }
  })
    .catch(err => console.log('error from google distance API is', err))
}

exports.convertAddressToLatLon = convertAddressToLatLon;
exports.getPlaces = getPlaces;
exports.getTravelDistances = getTravelDistances;






        