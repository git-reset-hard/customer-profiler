const config = require('./config/config.js');
const Sequelize = require('sequelize');
const helpers = require('./helpers/helpers.js');
const faker = require('Faker');

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'postgres',
  port: config.databasePort
});

const User = sequelize.define('user', {
  // need name to populate reviews if passing unique users to RP
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
  .then(() => {
    makeRandomUsers(5);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const makeRandomUsers = function(n) {
  const minClicks = 5;
  const maxClicks = 500;
  const minCheckIns = 0;
  const maxCheckIns = 100;
  const minReviews = 0;
  const maxReviews = 150;
  const numOfRestaurants = 50;
  const numOfQueries = 1000;

  let users = [];
  let clicks = [];
  let checkIns = [];
  let reviews = [];

  for (var i = 1; i <= n; i++) {
    users.push({
      name: faker.name.firstName() + ' ' + faker.name.lastName(),
      gets_recommendations: Math.round(Math.random()),
      home_city: faker.address.city() // TODO: Switch to US cities with state
    });

    clicks = clicks.concat(helpers.makeRandomClicks(i, helpers.randomizeRangeInclusive(minClicks, maxClicks), numOfRestaurants, numOfQueries));
    checkIns = checkIns.concat(helpers.makeRandomCheckIns(i, helpers.randomizeRangeInclusive(minCheckIns, maxCheckIns), numOfRestaurants));
    reviews = reviews.concat(helpers.makeRandomReviews(i, helpers.randomizeRangeInclusive(minReviews, maxReviews), numOfRestaurants));

    // TODO: add checkins and reviews for user
  }

  User.bulkCreate(users)
    .then(() => {
      return Query.bulkCreate(helpers.makeRandomQueries(numOfQueries));
    })
    .then(() => {
      return Restaurant.bulkCreate(helpers.makeRandomRestaurants(numOfRestaurants));
    })
    .then(() => {
      return Click.bulkCreate(clicks);
    })
    .then(() => {
      return Check_In.bulkCreate(checkIns);
    })
    .then(() => {
      return Review.bulkCreate(reviews);
    })
    // TODO: add checkins and reviews to DB
    .catch((err) => {
      console.log('error: ', err);
    });
};
