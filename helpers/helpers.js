const faker = require('Faker');
const randomLatitude = require('random-latitude');
const randomLongitude = require('random-longitude');
const db = require('../database/index.js');
const randomDate = require('random-date-generator');
faker.locale = 'en_US';



// To add to DB:
// generate array for desired table using helper

// db.User.bulkCreate(users);

// make random restaurants
// make random users
  // give user random number of checkins, clicks, reviews



// TODO: get current number of restaurants in DB
// TODO for every user created:
// generate random number of clicks
// generate random number of check-ins
// generate random number of reviews
// add all to db using userID (need to get userId! or use index for now--
// won't work when switching to hashed ID)

const makeRandomUsers = function(n) {
  // db.Restaurant.count()
  //   .then((num) => {
  //     console.log('count ', num);
  //   });

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




// Randomize restaurant ID (need query DB for current number of rests)
// Randomizing over all restaurants doesn't make sense (listId should
// correlate with only 10 restaurants)
// But with actual connected data clicks would only be created on
// appropriate restaurants

// get random rest Id
// make completely random list id
const pickRandomRestaurant = function() {
  db.Restaurant.count()
    .then((num) => {
      return randomizeRangeInclusive(0, num);
    });
};

const makeRandomClicks = function(userId, n, maxRestaurantId) {
  let clicks = [];

  for (var i = 0; i < n; i++) {
    clicks.push({
      userId: userId,
      restaurantId: pickRandomRestaurant,
      listId: randomizeRangeInclusive(0, 10000),
      queryId: randomizeRangeInclusive(0, 10000),
      time: makeRandomDateTime()
    });
  }

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

  for (var i = 0; i < numToGenerate; i++) {
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
// lat, long, price range, rating
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

// TODO: get date from within range
// will prob. need to get date and time separately
const makeRandomDateTime = function() {
  let startDate = new Date(2017, 2, 1);
  let endDate = new Date(2017, 5, 1);

  return randomDate.getRandomDateInRange(startDate, endDate);
};

const restaurants = makeRandomRestaurants(20);
db.Restaurant.bulkCreate(restaurants);
const users = makeRandomUsers(500);
db.Users.bulkCreate(users);


module.exports = {
  makeRandomUsers: makeRandomUsers
};