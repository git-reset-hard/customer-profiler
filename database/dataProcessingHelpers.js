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
  return {
    lat: lat,
    lng: lon
  };
};

const calcDistance = function(userCoords, restaurantCoords) {
  return geolib.getDistanceSimple(userCoords, restaurantCoords);
};

// async!
const convertCityToCoords = function(city) {
  return cityToCoords(city);
};

module.exports = {
  calcDistance,
  formatCoordsToObj,
  
};
