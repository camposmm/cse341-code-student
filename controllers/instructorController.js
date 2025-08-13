const { ObjectId } = require('mongodb');
const { getDb } = require('../data/database');

async function listInstructors(req, res) {
  try {
    const db = getDb();
    const docs = await db.collection('instructors').find({}).toArray();
    res.status(200).json(docs);
  } catch (e) {
    console.error('listInstructors error:', e);
    res.status(500).json({ error: 'Failed to fetch instructors' });
  }
}

async function getInstructorById(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid instructor id' });
  try {
    const db = getDb();
    const doc = await db.collection('instructors').findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).json({ error: 'Instructor not found' });
    res.status(200).json(doc);
  } catch (e) {
    console.error('getInstructorById error:', e);
    res.status(500).json({ error: 'Failed to fetch instructor' });
  }
}

async function createInstructor(req, res) {
  const { firstName, lastName, email, specialty } = req.body || {};
  try {
    const db = getDb();
    const { insertedId } = await db.collection('instructors').insertOne({
      firstName, lastName, email, specialty
    });
    const created = await db.collection('instructors').findOne({ _id: insertedId });
    res.status(201).json(created);
  } catch (e) {
    console.error('createInstructor error:', e);
    res.status(500).json({ error: 'Failed to create instructor' });
  }
}

async function updateInstructor(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid instructor id' });

  const { firstName, lastName, email, specialty } = req.body || {};
  try {
    const db = getDb();
    const result = await db.collection('instructors').updateOne(
      { _id: new ObjectId(id) },
      { $set: { firstName, lastName, email, specialty } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Instructor not found' });
    const updated = await db.collection('instructors').findOne({ _id: new ObjectId(id) });
    res.status(200).json(updated);
  } catch (e) {
    console.error('updateInstructor error:', e);
    res.status(500).json({ error: 'Failed to update instructor' });
  }
}

async function deleteInstructor(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid instructor id' });
  try {
    const db = getDb();
    const result = await db.collection('instructors').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Instructor not found' });
    res.status(200).json({ message: 'Instructor deleted' });
  } catch (e) {
    console.error('deleteInstructor error:', e);
    res.status(500).json({ error: 'Failed to delete instructor' });
  }
}

module.exports = {
  listInstructors,
  getInstructorById,
  createInstructor,
  updateInstructor,
  deleteInstructor
};