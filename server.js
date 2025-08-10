const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes/index');
// Alias initDb -> connectToDb so existing call works
const { initDb: connectToDb } = require('./data/database');
// If your DB file actually exports connectToDb already, use this instead:
// const { connectToDb } = require('./data/database');

const app = express();
const port = process.env.PORT || 3000;

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

// Connect to DB and start server
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