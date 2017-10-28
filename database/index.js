// Set up database connection and define schema

const config = require('../config/config.js');
const Sequelize = require('sequelize');
const helpers = require('../helpers/helpers.js');

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
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const User = sequelize.define('user', {
  // need name to populate reviews if passing unique users to RP
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    autoIncrement: true,

  },
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
}, 
{
  indexes: [
    {
      unique: true,
      fields: ['id']
    }
  ]
});

const Restaurant = sequelize.define('restaurant', {
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT,
  priceRange: Sequelize.INTEGER,
  rating: Sequelize.INTEGER,
  categories: Sequelize.JSONB
}, 
{
  indexes: [
    {
      unique: true,
      fields: ['id']
    }
  ]
});

const Query = sequelize.define('query', {
  search_term: {
    type: Sequelize.TEXT
  },
  location: {
    type: Sequelize.TEXT
  },
  list_id: {
    type: Sequelize.INTEGER
  },
}, 
{
  indexes: [
    {
      unique: true,
      fields: ['id']
    }
  ]
});

const Check_In = sequelize.define('check_in', {
  distance: {
    type: Sequelize.FLOAT
  },
  time: {
    type: Sequelize.DATE
  }
}, 
{
  indexes: [
    {
      unique: true,
      fields: ['id']
    }
  ]
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
}, 
{
  indexes: [
    {
      unique: true,
      fields: ['id']
    }
  ]
});

Review.belongsTo(User);
Review.belongsTo(Restaurant);

const Click = sequelize.define('click', {
  distance: {
    type: Sequelize.FLOAT
  },
  time: {
    type: Sequelize.DATE
  }
}, 
{
  indexes: [
    {
      unique: true,
      fields: ['id']
    }
  ]
});

Click.belongsTo(User);
Click.belongsTo(Restaurant);
Click.belongsTo(Query);

module.exports = {
  sequelize,
  User,
  Restaurant,
  Query,
  Check_In,
  Review,
  Click
};