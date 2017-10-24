// Set up database connection and define schema

const config = require('../config/config.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'postgres',
  port: config.databasePort
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
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

// INITIAL TABLE CREATION

// TODO: Switch to force: false when DB is populated
// force: true will drop the table if it already exists
// User.sync({force: true})
//   .then(() => {
//     return Restaurant.sync({force: true});
//   })
//   .then(() => {
//     return Query.sync({force: true});
//   })
//   .then(() => {
//     return Check_In.sync({force: true});
//   })
//   .then(() => {
//     return Review.sync({force: true});
//   })
//   .then(() => {
//     return Click.sync({force: true});
//   });

module.exports = {
  sequelize: sequelize,
  User: User,
  Restaurant: Restaurant,
  Query: Query,
  Check_In: Check_In,
  Review: Review,
  Click: Click
};