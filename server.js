// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes/index');
// Use whatever your DB file exports; alias to connectToDb
const { initDb: connectToDb } = require('./data/database'); // or: const { connectToDb } = require('./data/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);

// JSON error handler (consistent output instead of HTML)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.name || 'Error',
    message: err.message || 'Internal Server Error'
  });
});

// ✅ Export the app for supertest
module.exports = app;

// Only start the server when run directly (NOT during tests)
if (require.main === module && process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  connectToDb((err) => {
    if (!err) {
      app.listen(port, () => {
        console.log(`🚀 Server running at http://localhost:${port}`);
      });
    } else {
      console.error('❌ Failed to connect to the database:', err);
      process.exit(1);
    }
  });
}