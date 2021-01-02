const mongoose = require('mongoose');
const config = require('config');

// config lets us grab values from anywhere.
// we established mongoURI in the default.json, and with config
// we can grab it like this:
const db = config.get('mongoURI');

// mongoose.connect(db); returns promise
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    // exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
