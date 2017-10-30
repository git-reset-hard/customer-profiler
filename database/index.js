// Connect to DB and create schema

const mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');

mongoose.connect('mongodb://localhost/profiler');
const db = mongoose.connection;
autoIncrement.initialize(db);

db.once('open', () => console.log('opened connection with db'));

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
  search_term: String,
  location: Number,
  list_id: Number
});

const checkInSchema = mongoose.Schema({
  restaurant_id: Number,
  user_id: Number,
  time: { type: Date, default: Date.now }
});

const reviewSchema = mongoose.Schema({
  restaurant_id: Number,
  user_id: Number,
  star_rating: Number,
  time: { type: Date, default: Date.now },
  body: String
});

const clickSchema = mongoose.Schema({
  restaurant_id: Number,
  user_id: Number,
  query_id: Number,
  time: { type: Date, default: Date.now }
});

// SAVE AND AUTOINCREMENT MODELS

userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'numId' });
const User = mongoose.model('User', userSchema);

const Query = mongoose.model('Query', querySchema);

const CheckIn = mongoose.model('CheckIn', checkInSchema);

const Review = mongoose.model('Review', reviewSchema);

restaurantSchema.plugin(autoIncrement.plugin, { model: 'Restaurant', field: 'numId' });
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

const Click = mongoose.model('Click', clickSchema);

module.exports = {
  db,
  User,
  Restaurant,
  Query,
  CheckIn,
  Review,
  Click
};