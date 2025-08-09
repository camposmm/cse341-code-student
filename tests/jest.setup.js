// tests/jest.setup.js
require('dotenv').config(); // load .env for MONGODB_URL

const db = require('../data/database');

beforeAll((done) => {
  db.initDb((err) => done(err));
});

afterAll(async () => {
  await db.closeDb();
});