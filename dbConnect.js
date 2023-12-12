
const mongoose = require('mongoose');

//connecting to mongodb
function connectToMongoDB() {
  mongoose.connect(process.env.MONGODB_URL_LOCAL);
  const db = mongoose.connection;

  db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
}

module.exports = { connectToMongoDB };
