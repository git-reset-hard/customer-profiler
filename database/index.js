const mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');

mongoose.connect('mongodb://localhost/profiler');
const db = mongoose.connection;
autoIncrement.initialize(db);

db.once('open', () => {
  console.log('opened connection with db');

  const userSchema = mongoose.Schema({
    _id: Number,
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
    _id: Number,
    latitude: Number,
    longitude: Number,
    priceRange: Number,
    rating: Number,
    categories: Array
  });

  const querySchema = mongoose.Schema({
    _id: Number,
    search_term: String,
    location: Number,
    list_id: Number
  });

  const checkInSchema = mongoose.Schema({
    _id: Number,
    restaurant_id: Number,
    user_id: Number,
    distance: Number,
    time: Number
  });

  const reviewSchema = mongoose.Schema({
    _id: Number,
    restaurant_id: Number,
    user_id: Number,
    star_rating: Number,
    distance: Number,
    time: Date,
    body: String
  });

  const clickSchema = mongoose.Schema({
    _id: Number,
    restaurant_id: Number,
    user_id: Number,
    query_id: Number,
    time: Date
  });


  userSchema.plugin(autoIncrement.plugin, 'User');
  const User = mongoose.model('User', userSchema);

  querySchema.plugin(autoIncrement.plugin, 'Query');
  const Query = mongoose.model('Query', querySchema);

  checkInSchema.plugin(autoIncrement.plugin, 'CheckIn');
  const CheckIn = mongoose.model('CheckIn', checkInSchema);

  reviewSchema.plugin(autoIncrement.plugin, 'Review');
  const Review = mongoose.model('Review', reviewSchema);

  clickSchema.plugin(autoIncrement.plugin, 'Click');
  const Click = mongoose.model('Click', clickSchema);

  let parameters = {
    name: 'hi'
  };

  let entry = new User(parameters);
  entry.save((err, result) => {
    console.log('saved entry, ', result);
  });
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