const faker = require('Faker');
const db = require('../database/index.js');

const makeRandomUsers = function(n) {
  let users = [];

  for (var i = 0; i < n; i++) {
    users.push({
      name: faker.name.firstName() + ' ' + faker.name.lastName(),
      gets_recommendations: Math.round(Math.random()),
      home_city: faker.address.city()
    });
  }

  return users;
};

// db.User.bulkCreate(users);

module.exports = {
  makeRandomUsers: makeRandomUsers
};