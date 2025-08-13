const { ObjectId } = require('mongodb');
const { getDb } = require('../data/database');

// GET /student/
async function listStudents(req, res) {
  try {
    const db = getDb();
    const docs = await db.collection('students').find({}).toArray();
    res.status(200).json(docs);
  } catch (e) {
    console.error('listStudents error:', e);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
}

// GET /student/:id
async function getStudentById(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid student id' });
  try {
    const db = getDb();
    const doc = await db.collection('students').findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json(doc);
  } catch (e) {
    console.error('getStudentById error:', e);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
}

// POST /student  (duplicate email → 409)
async function createStudent(req, res) {
  try {
    const db = getDb();
    const {
      firstName, lastName, email, dateOfBirth, phone, address, registrationDate
    } = req.body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();

    const exists = await db.collection('students').findOne({ email: normalizedEmail });
    if (exists) return res.status(409).json({ error: 'Email already exists' });

    const doc = {
      firstName, lastName, email: normalizedEmail, dateOfBirth, phone, address, registrationDate
    };

    const { insertedId } = await db.collection('students').insertOne(doc);
    const created = await db.collection('students').findOne({ _id: insertedId });
    res.status(201).json(created);
  } catch (e) {
    if (e && e.code === 11000) return res.status(409).json({ error: 'Email already exists' });
    console.error('createStudent error:', e);
    res.status(500).json({ error: 'Failed to create student' });
  }
}

// PUT /student/:id
async function updateStudent(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid student id' });

  try {
    const db = getDb();
    let { firstName, lastName, email, dateOfBirth, phone, address, registrationDate } = req.body || {};
    const normalizedEmail = email != null ? String(email).trim().toLowerCase() : undefined;

    if (normalizedEmail) {
      const taken = await db.collection('students').findOne({
        email: normalizedEmail,
        _id: { $ne: new ObjectId(id) }
      });
      if (taken) return res.status(409).json({ error: 'Email already exists' });
    }

    const update = {
      ...(firstName !== undefined && { firstName }),
      ...(lastName !== undefined && { lastName }),
      ...(normalizedEmail !== undefined && { email: normalizedEmail }),
      ...(dateOfBirth !== undefined && { dateOfBirth }),
      ...(phone !== undefined && { phone }),
      ...(address !== undefined && { address }),
      ...(registrationDate !== undefined && { registrationDate })
    };

    const result = await db.collection('students').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Student not found' });

    const updated = await db.collection('students').findOne({ _id: new ObjectId(id) });
    res.status(200).json(updated);
  } catch (e) {
    if (e && e.code === 11000) return res.status(409).json({ error: 'Email already exists' });
    console.error('updateStudent error:', e);
    res.status(500).json({ error: 'Failed to update student' });
  }
}

// DELETE /student/:id
async function deleteStudent(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid student id' });
  try {
    const db = getDb();
    const result = await db.collection('students').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json({ message: 'Student deleted' });
  } catch (e) {
    console.error('deleteStudent error:', e);
    res.status(500).json({ error: 'Failed to delete student' });
  }
}

module.exports = {
  listStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};