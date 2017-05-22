const mongoose = require('mongoose');

// set the Promise library
mongoose.Promise = global.Promise;

// connect to the database
mongoose.connect('mongodb://localhost:27017/MyApp');

module.exports = {
  mongoose
};
