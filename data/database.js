// data/database.js
const { MongoClient } = require('mongodb');

let _client = null;
let _db = null;

const initDb = async (cb) => {
  try {
    if (_db) return cb ? cb(null, _db) : _db;

    const url = process.env.MONGODB_URL || process.env.MONGODB_URI;
    if (!url) throw new Error('Missing MONGODB_URL or MONGODB_URI');

    _client = await MongoClient.connect(url, { ignoreUndefined: true });
    _db = _client.db(); // uses default DB in your connection string
    return cb ? cb(null, _db) : _db;
  } catch (err) {
    if (cb) return cb(err);
    throw err;
  }
};

const getDb = () => {
  if (!_db) throw new Error('Database not initialized');
  return _db;
};

const closeDb = async () => {
  if (_client) {
    await _client.close();
    _client = null;
    _db = null;
  }
};

module.exports = { initDb, getDb, closeDb };