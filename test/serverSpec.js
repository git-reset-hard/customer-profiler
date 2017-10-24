const { Client } = require('pg');
const config = require('../config/config.js');
const expect = require('chai').expect;
const db = require('../database/index.js');

describe('Database', function () {
  after(() => {
    db.sequelize.close();
  });

  it('should insert a user into users table', function(done) {
    const user = {
      name: 'Fred X.',
      gets_recommendations: 1,
      star_importance: 1.0,
      proximity_importance: 0.4,
      price_importance: 0.1,
      restaurant_variance: 0.9,
      home_city: 'San Francisco, CA',
      home_coordinates: {
        latitude: 123456,
        longitude: 7891011
      },
      personality: {
        test: 1
      }
    };

    db.User.sync()
      .then(() => {
        return db.User.create(user);
      })
      .then((user) => {
        expect(user.name).to.equal('Fred X.');
        done();
      });

    // catching error bypasses test
    // .catch((data) => {
    //   console.log('Error inserting user into DB (test): ', data);
    //   done();
    // });
  });


  it('should insert a click with the correct restaurant id', function(done) {
    const click = {
      list_id: 5,
      distance: 12.5,
      time: db.sequelize.NOW,
      userId: 1,
      restaurantId: 1,
      queryId: 1
    };

    db.Click.sync()
      .then(() => {
        return db.Restaurant.sync();
      })
      .then(() => {
        return db.Query.sync();
      })
      .then(() => {
        return db.Restaurant.create();
      })
      .then(() => {
        return db.Query.create({
          search_term: 'tacos',
          location: '94541'
        });
      })
      .then(() => {
        return db.Click.create(click);
      })
      .then((click) => {
        return db.Click.find({
          where: {
            id: click.id
          }
        });
      })
      .then((click) => {
        expect(click.restaurantId).to.equal(1);
        done();
      });
  });
});