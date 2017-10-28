const config = require('../config/config.js');
const Sequelize = require('sequelize');
const helpers = require('../helpers/helpers.js');
const faker = require('Faker');
// const shortId = require('shortid');

// SWITCHED TO BATCHES OF 500 -- DOUBLE THESE #s
const iterations = 4; //40 * 1000
let currentIteration = 1;
const restIterations = 5; 
let currentRestIteration = 1;
const queryIterations = 5; 
let currentQueryIteration = 1;
// add var for curr UID to pull from instead of chaining within users
let currentUserId;

const minClicks = 5;
const maxClicks = 500; // 500
const minCheckIns = 1;
const maxCheckIns = 100; // 100
const minReviews = 1;
const maxReviews = 150; // 150

const numOfRestaurants = 50000; //50000
const numOfQueries = 2000000; // 2000000


const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'postgres',
  port: config.databasePort,
  logging: false});

const User = sequelize.define('user', {
  name: {
    type: Sequelize.TEXT
  },
  gets_recommendations: {
    type: Sequelize.BOOLEAN
  },
  star_importance: {
    type: Sequelize.FLOAT
  },
  proximity_importance: {
    type: Sequelize.FLOAT
  },
  price_importance: {
    type: Sequelize.FLOAT
  },
  restaurant_variance: {
    type: Sequelize.FLOAT
  },
  home_city: {
    type: Sequelize.STRING
  },
  home_coordinates: {
    type: Sequelize.JSONB // lat, long
  },
  personality: {
    type: Sequelize.JSONB // watson object
  }
});

const Restaurant = sequelize.define('restaurant', {
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT,
  priceRange: Sequelize.INTEGER,
  rating: Sequelize.INTEGER,
  categories: Sequelize.JSONB
});

const Query = sequelize.define('query', {
  search_term: {
    type: Sequelize.TEXT
  },
  location: {
    type: Sequelize.TEXT
  }
});

const Check_In = sequelize.define('check_in', {
  distance: {
    type: Sequelize.FLOAT
  },
  time: {
    type: Sequelize.DATE
  }
});

Check_In.belongsTo(User);
Check_In.belongsTo(Restaurant);


const Review = sequelize.define('review', {
  star_rating: {
    type: Sequelize.INTEGER
  },
  time: {
    type: Sequelize.DATE
  },
  body: {
    type: Sequelize.TEXT
  }
});

Review.belongsTo(User);
Review.belongsTo(Restaurant);

const Click = sequelize.define('click', {
  list_id: {
    type: Sequelize.INTEGER
  },
  distance: {
    type: Sequelize.FLOAT
  },
  time: {
    type: Sequelize.DATE
  }
});

Click.belongsTo(User);
Click.belongsTo(Restaurant);
Click.belongsTo(Query);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .then(() => {
    return User.sync({force: true});
  })
  .then(() => {
    return Restaurant.sync({force: true});
  })
  .then(() => {
    return Query.sync({force: true});
  })
  .then(() => {
    return Check_In.sync({force: true});
  })
  .then(() => {
    return Review.sync({force: true});
  })
  .then(() => {
    return Click.sync({force: true});
  })
  // .then(() => {
  //   return makeRestaurants();
  // })
  // .then(() => {
  //   return makeQueries();
  // })
  // .then(() => {
  //   return makeRandomUsers();
  // })
  .then(() => {
    console.log('Done loading data');
  })
  .catch((err) => {
    console.log('Error loading data: ', err);
  });

const makeRestaurants = function() {
  console.log('making rest batches');

  let restPromises = [];

  for (var i = 0; i < restIterations; i++) {
    restPromises.push(Restaurant.bulkCreate(helpers.makeRandomRestaurants(10000)));
    currentRestIteration++;
  }

  return Promise.all(restPromises);
};

const makeQueries = function() {
  console.log('making query batches');

  let queryPromises = [];

  for (var i = 0; i < queryIterations; i++) {
    queryPromises.push(Query.bulkCreate(helpers.makeRandomQueries(10000)));
    currentQueryIteration++;
  }

  return Promise.all(queryPromises);
};

// create and insert batch of users into DB
const makeUserBatch = function(n) {
  let users = [];
  let clicks = [];
  let checkIns = [];
  let reviews = [];
  let userId;
  
  for (var i = 1; i <= n; i++) {
    // maintain correct uID throughout batches
    userId = n * (currentIteration - 1) + i;
    // console.log('creating user: ', userId);

    users.push({
      name: faker.name.firstName() + ' ' + faker.name.lastName(),
      gets_recommendations: Math.round(Math.random()),
      home_city: faker.address.city() // TODO: Switch to US cities with state
    });

    // all user activity assigned on user creation
    // clicks = clicks.concat(helpers.makeRandomClicks(userId, helpers.randomizeRangeInclusive(minClicks, maxClicks), numOfRestaurants, numOfQueries));
    // checkIns = checkIns.concat(helpers.makeRandomCheckIns(userId, helpers.randomizeRangeInclusive(minCheckIns, maxCheckIns), numOfRestaurants));
    // reviews = reviews.concat(helpers.makeRandomReviews(userId, helpers.randomizeRangeInclusive(minReviews, maxReviews), numOfRestaurants));
  }

  return User.bulkCreate(users);
    // .then(() => {
    //   console.log('Adding checkins');
    //   return Check_In.bulkCreate(checkIns);
    // })
    // .then(() => {
    //   return Review.bulkCreate(reviews);
    //   console.log('Adding reviews');
    // })
    // .then(() => {
    //   console.log('adding clicks, last step of user batch');
    //   return Click.bulkCreate(clicks);
    // });
};

const makeRandomUsers = function() {
  userPromises = [];

  for (var i = 0; i < iterations; i++) {
    console.log('User batch #: ', currentIteration);
    userPromises.push(makeUserBatch(10000));
    currentIteration++;
  }

  return Promise.all(userPromises);
};

module.exports = {
  makeUserBatch
};
