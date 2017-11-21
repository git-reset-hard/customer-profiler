const zipcodes = require('zipcodes');
const geolib = require('geolib');
const cityToCoords = require('city-to-coords');

const formatProfileForAnalytics = function() {

};

const formatProfileForRecEngine = function() {

};

const addUserFromRestProfiler = function() {

};

// convert city to coords with city-to-coords
// get distance between coords with geolib

// returns distance in miles
const formatCoordsToObj = function(lat, lon) {
  var formatted = {
    lat: lat,
    lng: lon
  };

  return formatted;
};

const calcDistance = function(userCoords, restaurantCoords) {
  return geolib.getDistanceSimple(userCoords, restaurantCoords);
};

// async!
const convertCityToCoords = function(city) {
  return cityToCoords(city);
};

// input: array
calcNormalizedAvg = function(data, type) {
  let max = 4;
  let avg = data.reduce((sum, value) => sum + value) / data.length;
  if (type === 'distance') {
    max = 20;
    avg = avg > max ? max : avg; 
  }
  return type === 'price' || type === 'distance' ? 1 - avg / max : ( avg - 1 ) / max;
};

calcDistancePref = function(data) {
  const max = 50;
  let avg = data.reduce((sum, value) => sum + value) / data.length;

  return ( avg ) / max;
};

module.exports = {
  calcDistance,
  formatCoordsToObj,
  calcNormalizedAvg
};
