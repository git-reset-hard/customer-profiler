const config = require('../config/config.js');
const expect = require('chai').expect;
const db = require('../database/index.js');

describe('Server', function () {

});

describe('Database', function () {


  it ('should insert a user into users table', function(done) {
  });


  it ('should insert a click with the correct restaurant id', function(done) {
    const click = {
      list_id: 5,
      distance: 12.5,
      time: db.sequelize.NOW,
      userId: 1,
      restaurantId: 1,
      queryId: 1
    };
  });
});