const zipcodes = require('zipcodes');

const formatProfileForAnalytics = function() {

};

const formatProfileForRecEngine = function() {

};

const addUserFromRestProfiler = function() {

};

// returns distance in miles
const calcDistance = function(userZipCode, restaurantZipCode) {
  return zipcodes.distance(userZipCode, restaurantZipCode);
};

// input is 'city, state(abbreviation)'
const cityToZipCode = function(city) {
  let parsed = city.split(',');
  parsed[1] = parsed[1].slice(1);
  return zipcodes.lookupByName(parsed[0], parsed[1]);
};

module.exports = {
  calcDistance
};

console.log(cityToZipCode('San Jose, CA'));