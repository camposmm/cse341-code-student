// data/database.js
const { MongoClient } = require('mongodb');

let _db;
let _client;

function initDb(callback) {
  if (_db) return callback(null, _db);

  const uri = process.env.MONGODB_URI;

  // In test env, allow running without a DB so GET tests can accept 500s
  if (!uri) {
    if (process.env.NODE_ENV === 'test') {
      console.warn('[db] MONGODB_URI not set; continuing without DB for tests');
      return callback(null, null);
    }
    return callback(new Error('MONGODB_URI is not set'));
  }

  MongoClient.connect(uri)
    .then((client) => {
      _client = client;
      _db = client.db();
      console.log('✅ MongoDB connected');
      callback(null, _db);
    })
    .catch((err) => callback(err));
}

function getDb() {
  if (!_db) {
    throw new Error('Db not initialized. Call initDb first or set MONGODB_URI.');
  }
  return _db;
}

async function closeDb() {
  try {
    if (_client) {
      await _client.close();
    }
  } catch (_) {
    // swallow close errors in tests
  } finally {
    _client = undefined;
    _db = undefined;
  }
}

module.exports = { initDb, getDb, closeDb };