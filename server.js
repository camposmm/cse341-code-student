require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const mongodb = require('./data/database');

const app = express();

// Body parsing
app.use(bodyParser.json());

// Basic CORS headers (kept from your original style)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // adjust if needed
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Routes
app.use('/', require('./routes'));

// Export app for tests (Supertest)
module.exports = app;

// Start server after DB connection
const port = process.env.PORT || 3000;
mongodb.initDb((err) => {
  if (err) {
    console.log('Failed to connect to the database:', err);
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB. Server is listening on port ${port}`);
    });
  }
});