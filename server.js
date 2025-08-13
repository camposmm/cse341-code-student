// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// Optional request logging (won't crash if morgan isn't installed)
try {
  const morgan = require('morgan');
  app.use(morgan('dev'));
} catch (_) { /* no-op */ }

// Core middleware
app.use(cors());
app.use(express.json());

// Routes
const routes = require('./routes/index');
app.use('/', routes);

// 404 for unknown routes (JSON instead of "Cannot GET /")
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global JSON error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.name || 'Error',
    message: err.message || 'Internal Server Error'
  });
});

// Export the app for tests
module.exports = app;

// Start server only when not running tests
if (require.main === module && process.env.NODE_ENV !== 'test') {
  const { initDb } = require('./data/database');
  const port = process.env.PORT || 3000;

  initDb((err) => {
    if (err) {
      console.error('❌ Failed to connect to the database:', err);
      process.exit(1);
    }
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  });
}