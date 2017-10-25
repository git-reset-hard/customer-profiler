const faker = require('Faker');
const randomLatitude = require('random-latitude');
const randomLongitude = require('random-longitude');
// const db = require('../database/index.js');
const randomDate = require('random-date-generator');
const randomZipcode = require('random-zipcode');
faker.locale = 'en_US';

// Note: async, does not work as-is
const pickRandomRestaurant = function() {
  db.Restaurant.count()
    .then((num) => {
      return randomizeRangeInclusive(0, num);
    });
};

const makeRandomClicks = function(userId, n, maxRestaurantId, maxQueries) {
  let clicks = [];

  console.log('making ' + n + ' clicks for user ' + userId);
  for (var i = 1; i <= n; i++) {
    clicks.push({
      userId: userId,
      restaurantId: randomizeRangeInclusive(1, maxRestaurantId),
      list_id: randomizeRangeInclusive(1, 10000),
      queryId: randomizeRangeInclusive(1, maxQueries),
      time: makeRandomDateTime()
    });
  }

  console.log('click len for this user: ', clicks.length);

  return clicks;
};

const makeRandomCheckIns = function(userId, n, maxRestaurantId) {
  makeRandomDateTime();
};

const makeRandomReviews = function(userId, n, maxRestaurantId) {
  makeRandomDateTime();

};

const randomizeRangeInclusive = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomizeCategories = function() {
  let allCategories = ['burgers', 'pizza', 'chinese', 'thai', 'vegetarian', 'mexican', 'seafood', 
    'fast food', 'deli', 'sushi'];

  let randomCategories = [];
  let categoryIndex;
  let formattedCategories = [];

  const numToGenerate = randomizeRangeInclusive(1, 3);

  for (var i = 0; i <= numToGenerate; i++) {
    categoryIndex = randomizeRangeInclusive(0, allCategories.length);

    if (!randomCategories.includes(allCategories[categoryIndex])) {
      randomCategories.push(allCategories[categoryIndex]);
    }    
  }

  randomCategories.forEach((category, index) => {
    formattedCategories[index] = {
      alias: category,
      title: category
    };
  });

  return formattedCategories;
};

const makeRandomRestaurants = function(n) {
  let restaurants = [];

  for (var i = 0; i < n; i++) {
    restaurants.push({
      latitude: randomLatitude(),
      longitude: randomLongitude(),
      priceRange: randomizeRangeInclusive(1, 4),
      rating: randomizeRangeInclusive(1, 5),
      categories: randomizeCategories()
    });
  }

  return restaurants;
};

const makeRandomDateTime = function() {
  let startDate = new Date(2017, 2, 1);
  let endDate = new Date(2017, 5, 1);

  return randomDate.getRandomDateInRange(startDate, endDate);
};

const makeRandomQueries = function(n) {
  let queries = [];
  for (var i = 0; i < n; i++) {
    queries.push({
      search_term: faker.random.word(),
      location: randomZipcode()
    });
  }

  return queries;
};

module.exports = {
  makeRandomClicks: makeRandomClicks,
  randomizeRangeInclusive: randomizeRangeInclusive,
  makeRandomRestaurants: makeRandomRestaurants,
  makeRandomQueries: makeRandomQueries  
};