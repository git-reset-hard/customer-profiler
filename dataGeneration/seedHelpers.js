const faker = require('Faker');
const randomLatitude = require('random-latitude');
const randomLongitude = require('random-longitude');
const randomDate = require('random-date-generator');
const randomZipCode = require('random-zipcode');
const randomText = require('txtgen');
const zipcodes = require('zipcodes');
faker.locale = 'en_US';

const maxRestNum = 50000;
const maxUserNum = 40000;
const maxQueryNum = 2000000;

// ****** RANDOM PROPERTY HELPERS ***** 

const randomizeRangeInclusive = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const makeRandomDateTime = function() {
  let startDate = new Date(2017, 2, 1);
  let endDate = new Date(2017, 5, 1);

  return randomDate.getRandomDateInRange(startDate, endDate);
};

const randomizeCategories = function() {
  let allCategories = ['burgers', 'pizza', 'chinese', 'thai', 'vegetarian', 'mexican', 'seafood', 
    'fast food', 'deli', 'sushi'];

  let randomCategories = [];
  let categoryIndex;

  const numToGenerate = randomizeRangeInclusive(1, 3);

  for (let i = 0; i <= numToGenerate; i++) {
    categoryIndex = randomizeRangeInclusive(0, allCategories.length - 1);

    if (!randomCategories.includes(allCategories[categoryIndex])) {
      randomCategories.push(allCategories[categoryIndex]);
    }    
  }

  return randomCategories;
};

// ****** RANDOM ROW GENERATION ***** 

const createUser = function (id) {
  let zipcode = randomZipCode();
  let coordinates = zipcodes.lookup(zipcode);

  while (!coordinates) {
    zipcode = randomZipCode();
    coordinates = zipcodes.lookup(zipcode);
  }

  return {
    numId: id,
    name: faker.name.firstName() + ' ' + faker.name.lastName()[0] + '.',
    gets_recommendations: Math.round(Math.random()),
    distances_traveled: [],
    star_pref: null,
    distance_pref: null,
    price_pref: null,
    stars: [],
    reviews: '',
    prices: [],
    liked_restaurants: [],
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    hometown_city: coordinates.city,
    zipCode: zipcode,
    openness: null,
    conscientiousness: null,
    achievement: null,
    extraversion: null,
    agreeableness: null
  };
};

// console.log(createUser(1));

const createRestaurant = function (id) {
  return {
    numId: id,
    priceRange: randomizeRangeInclusive(1, 4),
    rating: randomizeRangeInclusive(1, 5),
    categories: randomizeCategories(),
    zip: randomZipCode()
  };
};

const createQuery = function (id) {
  return {
    numId: id,
    search_term: faker.random.word(),
    location: randomZipCode(),
    list_id: randomizeRangeInclusive(1, 10000)
  };
};

const createCheckIn = function (id) {
  return {
    numId: id,
    restaurant_id: randomizeRangeInclusive(0, maxRestNum),
    user_id: randomizeRangeInclusive(0, maxUserNum),
    time: makeRandomDateTime()
  };
};

const createReview = function (id) {
  return {
    numId: id,
    restaurant_id: randomizeRangeInclusive(0, maxRestNum),
    user_id: randomizeRangeInclusive(0, maxUserNum),
    star_rating: randomizeRangeInclusive(1, 5),
    time: makeRandomDateTime(),
    body: randomText.paragraph() // parse before sending to analytics
  };
};

const createClick = function (id) {
  return {
    numId: id,
    restaurant_id: randomizeRangeInclusive(0, maxRestNum),
    user_id: randomizeRangeInclusive(0, maxUserNum),
    query_id: randomizeRangeInclusive(0, maxQueryNum),
    time: makeRandomDateTime()
  };
};


module.exports = {
  randomizeRangeInclusive,
  createUser,
  createRestaurant,
  createQuery,
  createCheckIn,
  createReview,
  createClick
};