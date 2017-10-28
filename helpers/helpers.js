const faker = require('Faker');
const randomLatitude = require('random-latitude');
const randomLongitude = require('random-longitude');
const randomDate = require('random-date-generator');
const randomZipCode = require('random-zipcode');
const randomText = require('txtgen');
faker.locale = 'en_US';

const restaurantCount = 50000;
const userCount = 40000;

const makeRandomClicks = function(userId, n, maxRestaurantId, maxQueries) {
  let clicks = [];

  for (var i = 1; i <= n; i++) {
    clicks.push({
      // id: shortId.generate(),
      userId: userId,
      restaurantId: randomizeRangeInclusive(1, maxRestaurantId),
      queryId: randomizeRangeInclusive(1, maxQueries),
      time: makeRandomDateTime()
    });
  }

  return clicks;
};

const makeRandomCheckIns = function(userId, n, maxRestaurantId) {
  let checkIns = [];

  for (var i = 1; i <= n; i++) {
    checkIns.push({
      userId: userId,
      restaurantId: randomizeRangeInclusive(1, maxRestaurantId),
      time: makeRandomDateTime()
    });
  }

  return checkIns;
};

const makeRandomReviews = function(userId, n, maxRestaurantId) {
  let reviews = [];

  for (var i = 1; i <= n; i++) {
    reviews.push({
      userId: userId,
      restaurantId: randomizeRangeInclusive(1, maxRestaurantId),
      star_rating: randomizeRangeInclusive(1, 5),
      time: makeRandomDateTime(),
      body: randomText.paragraph()
    });
  }

  return reviews;
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
    categoryIndex = randomizeRangeInclusive(0, allCategories.length - 1);

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
      // id: shortId.generate(),
      search_term: faker.random.word(),
      location: randomZipCode(),
      list_id: randomizeRangeInclusive(1, 10000), // lists not stored in this service's DB
    });
  }

  return queries;
};

// *** DATA SEEDING HELPERS (RETURN STRINGS) *** //

const escapeQuotes = function(str) {
  return str.replace(/"/g, '""');
};

const makeRandomQuery = function() {
  return `${JSON.stringify(faker.random.word()).replace(/"/g, '""')}|${randomZipCode()}|${randomizeRangeInclusive(1, 10000)}`;
};

const makeRandomRestaurant = function(n) {
  let categories = JSON.stringify(randomizeCategories());
  categories = categories.replace(/"/g, '""');
  let restaurant = `${randomLatitude()}|${randomLongitude()}|${randomizeRangeInclusive(1, 4)}|${randomizeRangeInclusive(1, 5)}|"${categories}"`;
  return restaurant;
};

const makeRandomUser = function() {
  let user = {
    name: faker.name.firstName() + ' ' + faker.name.lastName()[0] + '.',
    gets_recommendations: Math.round(Math.random()),
    home_city: faker.address.city(),
    home_coordinates: {
      latitude: randomLatitude(),
      longitude: randomLongitude()
    },
    star_importance: Math.random(),
    distance_importance: Math.random(),
    price_importance: Math.random(),
    restaurant_variance: Math.random(),
    personality: {
      personality: Array.from({length: 5}, () => Math.random()),
      traits: Array.from({length: 12}, () => Math.round(Math.random())),
      needs: Array.from({length: 12}, () => Math.random()),
      values: Array.from({length: 12}, () => Math.random()), 
    }
  };
  // not saving liked rests.; will query restaurants list to send to RE
};
module.exports = {
  makeRandomClicks,
  randomizeRangeInclusive,
  makeRandomRestaurant,
  makeRandomQuery,
  makeRandomCheckIns,
  makeRandomReviews
};