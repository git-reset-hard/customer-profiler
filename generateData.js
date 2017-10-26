const config = require('./config/config.js');
const Sequelize = require('sequelize');
const helpers = require('./helpers/helpers.js');
const faker = require('Faker');
// const shortId = require('shortid');

const iterations = 2;
let currentIteration = 1;

const minClicks = 5;
const maxClicks = 500; // 500
const minCheckIns = 1;
const maxCheckIns = 500; // 100
const minReviews = 1;
const maxReviews = 150; // 150
const numOfRestaurants = 500; //500
const numOfQueries = 1000; // 1000


const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'postgres',
  port: config.databasePort,
  logging: false});

const User = sequelize.define('user', {
  // need name to populate reviews if passing unique users to RP
  // id: {
  //   type: Sequelize.STRING,
  //   primaryKey: true
  // },
  // numId: {
  //   type: Sequelize.INTEGER,
  //   autoIncrement: true
  // },
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
  // id: {
  //   type: Sequelize.STRING,
  //   primaryKey: true
  // },
  // numId: {
  //   type: Sequelize.INTEGER,
  //   autoIncrement: true
  // },
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT,
  priceRange: Sequelize.INTEGER,
  rating: Sequelize.INTEGER,
  categories: Sequelize.JSONB
});

const Query = sequelize.define('query', {
  // id: {
  //   type: Sequelize.STRING,
  //   primaryKey: true
  // },
  // numId: {
  //   type: Sequelize.INTEGER,
  //   autoIncrement: true
  // },
  search_term: {
    type: Sequelize.TEXT
  },
  location: {
    type: Sequelize.TEXT
  }
});

const Check_In = sequelize.define('check_in', {
  // id: {
  //   type: Sequelize.STRING,
  //   primaryKey: true
  // },  
  // numId: {
  //   type: Sequelize.INTEGER,
  //   autoIncrement: true
  // },
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
  // id: {
  //   type: Sequelize.STRING,
  //   primaryKey: true
  // },
  // numId: {
  //   type: Sequelize.INTEGER,
  //   autoIncrement: true
  // },
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
  // id: {
  //   type: Sequelize.STRING,
  //   primaryKey: true
  // },  
  // numId: {
  //   type: Sequelize.INTEGER,
  //   autoIncrement: true
  // },
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
    return User.sync({force: false});
  })
  .then(() => {
    return Restaurant.sync({force: false});
  })
  .then(() => {
    return Query.sync({force: false});
  })
  .then(() => {
    return Check_In.sync({force: false});
  })
  .then(() => {
    return Review.sync({force: false});
  })
  .then(() => {
    return Click.sync({force: false});
  })
  .then(() => {
    makeRandomUsers();
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const makeUserBatch = function(n) {
  let users = [];
  let clicks = [];
  let checkIns = [];
  let reviews = [];
  let userId;
  
  for (var i = 1; i <= n; i++) {
    userId = i * currentIteration;

    console.log('user in batch = ', i);

    users.push({
      // id: userId,
      name: faker.name.firstName() + ' ' + faker.name.lastName(),
      gets_recommendations: Math.round(Math.random()),
      home_city: faker.address.city() // TODO: Switch to US cities with state
    });

    clicks = clicks.concat(helpers.makeRandomClicks(userId, helpers.randomizeRangeInclusive(minClicks, maxClicks), numOfRestaurants, numOfQueries));
    checkIns = checkIns.concat(helpers.makeRandomCheckIns(userId, helpers.randomizeRangeInclusive(minCheckIns, maxCheckIns), numOfRestaurants));
    reviews = reviews.concat(helpers.makeRandomReviews(userId, helpers.randomizeRangeInclusive(minReviews, maxReviews), numOfRestaurants));
  }

  return User.bulkCreate(users)
    .then(() => {
      console.log('Adding checkins');
      return Check_In.bulkCreate(checkIns);
    })
    .then(() => {
      return Review.bulkCreate(reviews);
      console.log('Adding reviews');
    })
    .then(() => {
      console.log('adding clicks, last step of user batch');
      return Click.bulkCreate(clicks);
    });
};

const makeRandomUsers = function() {
  userPromises = [];

  // make a user and associate clicks, check-ins, reviews to user
  Query.bulkCreate(helpers.makeRandomQueries(numOfQueries))
    .then(() => {
      console.log('Adding rests');
      return Restaurant.bulkCreate(helpers.makeRandomRestaurants(numOfRestaurants));
    })
    .then(() => {
      for (var i = 0; i <= iterations; i++) {
        userPromises.push(makeUserBatch(500));
        currentIteration++;
      }
      console.log('Calling user promises with len ', userPromises.length);
      return Promise.all(userPromises); 
    })
    .then(() => {
      console.log('Done loading data'); // why isn't this printed last?
    })
    .catch((err) => {
      console.log('Error loading data: ', err);
    });


};
