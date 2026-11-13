require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/collabsphere';

console.log('Attempting to connect to:', MONGODB_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection failed!');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    // console.error('Full error:', JSON.stringify(err, null, 2));
    process.exit(1);
  });
