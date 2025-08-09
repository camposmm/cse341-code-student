// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initDb } = require('./data/database');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// mount your routes
app.use('/', require('./routes/index')); // adjust if your entry router differs

const port = process.env.PORT || 3000;

// Only connect & listen when NOT running tests
if (process.env.NODE_ENV !== 'test') {
  initDb((err) => {
    if (err) {
      console.error('Failed to connect to DB:', err);
      process.exit(1);
    } else {
      app.listen(port, () => {
        console.log(`Connected to DB. Server is listening on port ${port}`);
      });
    }
  });
}

// IMPORTANT: export ONLY the Express app for Supertest
module.exports = app;