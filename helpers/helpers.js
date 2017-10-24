const faker = require('Faker');
const randomLatitude = require('random-latitude');
const randomLongitude = require('random-longitude');
const db = require('../database/index.js');

// TODO: get current number of restaurants in DB
// TODO for every user created:
// generate random number of clicks
// generate random number of check-ins
// generate random number of reviews
// add all to db using userID (need to get userId! or use index for now--
// won't work when switching to hashed ID)

const makeRandomUsers = function(n) {
  db.Restaurant.count()
    .then((num) => {
      console.log('count ', num);
    });

  let users = [];

  // TODO: move this into then chain after generating restaurants
  for (var i = 0; i < n; i++) {
    users.push({
      name: faker.name.firstName() + ' ' + faker.name.lastName(),
      gets_recommendations: Math.round(Math.random()),
      home_city: faker.address.city() // TODO: Switch to US cities with state
    });
  }

  return users;
};

makeRandomUsers(1);


// To add to DB:
// db.User.bulkCreate(users);

// Randomize restaurant ID (need query DB for current number of rests)
// Randomizing over all restaurants doesn't make sense (listId should
// correlate with only 10 restaurants)
// But with actual connected data clicks would only be created on
// appropriate restaurants

// get random rest Id
// make completely random list id
const makeRandomClicks = function(n, maxRestaurantId) {

};

const randomizeRangeInclusive = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// lat, long, price range, rating
const makeRandomRestaurants = function(n) {
  let restaurants = [];

  for (var i = 0; i < n; i++) {
    restaurants.push({
      latitude: randomLatitude(),
      longitude: randomLongitude(),
      priceRange: randomizeRangeInclusive(1, 4),
      rating: randomizeRangeInclusive(1, 5),
      tags: ['hot dogs', 'popcorn'] // not correct, get format from Yelp API
    });
  }

  return restaurants;
};

console.log(makeRandomRestaurants(1));

// TODO: get date from within range
// will prob. need to get date and time separately
const makeRandomDate = function() {

};

module.exports = {
  makeRandomUsers: makeRandomUsers
};