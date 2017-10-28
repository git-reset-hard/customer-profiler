const faker = require('Faker');
const randomLatitude = require('random-latitude');
const randomLongitude = require('random-longitude');
const randomDate = require('random-date-generator');
const randomZipCode = require('random-zipcode');
const randomText = require('txtgen');
faker.locale = 'en_US';

const randomizeRangeInclusive = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createUser = function (id) {
  return {
    _id: id,
    name: faker.name.firstName() + ' ' + faker.name.lastName()[0] + '.',
    gets_recommendations: Math.round(Math.random()),
    distances_traveled: [randomizeRangeInclusive(0, 20), randomizeRangeInclusive(0, 20)],
    star_pref: Math.random(),
    distance_pref: Math.random(),
    price_pref: Math.random(),
    openness: Math.random(),
    latitude: randomLatitude(),
    longitude: randomLongitude(),
    hometown_city: faker.address.city(),
    personality: Array.from({length: 5}, () => Math.random()),
    traits: Array.from({length: 12}, () => Math.round(Math.random())),
    needs: Array.from({length: 12}, () => Math.random()),
    values: Array.from({length: 12}, () => Math.random())
  };
};

const createRestaurant = function (id) {
  return {
    
  };
};

module.exports = {
  createUser
};