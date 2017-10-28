const mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');

mongoose.connect('mongodb://localhost/profiler');
const db = mongoose.connection;
autoIncrement.initialize(db);

db.once('open', () => {
  console.log('opened connection with db');

  const userSchema = mongoose.Schema({
    numId: Number,
    name: String,
    gets_recommendations: Boolean,
    distances_traveled: Array,
    star_pref: Number,
    distance_pref: Number,
    price_pref: Number,
    openness: Number,
    hometown_latitude: Number,
    hometown_longitude: Number,
    hometown_city: String,
    personality: Array,
    traits: Array,
    needs: Array,
    values: Array
  });

  const restaurantSchema = mongoose.Schema({
    numId: Number,
    latitude: Number,
    longitude: Number,
    priceRange: Number,
    rating: Number,
    categories: Array
  });

  const querySchema = mongoose.Schema({
    numId: Number,
    search_term: String,
    location: Number,
    list_id: Number
  });

  const checkInSchema = mongoose.Schema({
    numId: Number,
    restaurant_id: Number,
    user_id: Number,
    time: Number
  });

  const reviewSchema = mongoose.Schema({
    numId: Number,
    restaurant_id: Number,
    user_id: Number,
    star_rating: Number,
    time: Date,
    body: String
  });

  const clickSchema = mongoose.Schema({
    numId: Number,
    restaurant_id: Number,
    user_id: Number,
    query_id: Number,
    time: Date
  });


  userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'numId' });
  const User = mongoose.model('User', userSchema);

  querySchema.plugin(autoIncrement.plugin, { model: 'Query', field: 'numId' });
  const Query = mongoose.model('Query', querySchema);

  checkInSchema.plugin(autoIncrement.plugin, { model: 'CheckIn', field: 'numId' });
  const CheckIn = mongoose.model('CheckIn', checkInSchema);

  reviewSchema.plugin(autoIncrement.plugin, { model: 'Review', field: 'numId' });
  const Review = mongoose.model('Review', reviewSchema);

  clickSchema.plugin(autoIncrement.plugin, { model: 'Click', field: 'numId' });
  const Click = mongoose.model('Click', clickSchema);

  // let parameters = {
  //   name: 'hi'
  // };

  // let entry = new User(parameters);
  // entry.save((err, result) => {
  //   console.log('saved entry, ', result);
  // });
});

// module.exports = {
//   db,
//   User,
//   Restaurant,
//   Query,
//   CheckIn,
//   Review,
//   Click
// };