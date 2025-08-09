const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// Helpers
const toObjectId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);

// GET /instructor/
const getAllInstructors = async (req, res) => {
  //#swagger.tags = ['Instructors']
  try {
    const db = mongodb.getDb();
    const instructors = await db.collection('instructors').find({}).toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(instructors);
  } catch (error) {
    console.error('Error getting all instructors:', error);
    res.status(500).json({ message: 'Error retrieving instructors', error: error.message });
  }
};

// GET /instructor/:id
const getInstructorById = async (req, res) => {
  //#swagger.tags = ['Instructors']
  try {
    const _id = toObjectId(req.params.id);
    if (!_id) return res.status(400).json({ message: 'Bad Request: invalid id' });

    const db = mongodb.getDb();
    const instructor = await db.collection('instructors').findOne({ _id });

    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(instructor);
  } catch (error) {
    console.error('Error getting instructor by ID:', error);
    res.status(500).json({ message: 'Error retrieving instructor', error: error.message });
  }
};

// POST /instructor/
const createInstructor = async (req, res) => {
  //#swagger.tags = ['Instructors']
  try {
    const db = mongodb.getDb();
    const doc = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      specialty: req.body.specialty,
      createdAt: new Date()
    };

    const result = await db.collection('instructors').insertOne(doc);
    res.status(201).json({ message: 'Created', _id: result.insertedId });
  } catch (error) {
    console.error('Error creating instructor:', error);
    res.status(500).json({ message: 'Error creating instructor', error: error.message });
  }
};

// PUT /instructor/:id
const updateInstructor = async (req, res) => {
  //#swagger.tags = ['Instructors']
  try {
    const _id = toObjectId(req.params.id);
    if (!_id) return res.status(400).json({ message: 'Bad Request: invalid id' });

    const db = mongodb.getDb();
    const update = {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        specialty: req.body.specialty,
        updatedAt: new Date()
      }
    };

    const result = await db.collection('instructors').updateOne({ _id }, update);
    if (!result.matchedCount) return res.status(404).json({ message: 'Instructor not found' });

    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error('Error updating instructor:', error);
    res.status(500).json({ message: 'Error updating instructor', error: error.message });
  }
};

// DELETE /instructor/:id
const deleteInstructor = async (req, res) => {
  //#swagger.tags = ['Instructors']
  try {
    const _id = toObjectId(req.params.id);
    if (!_id) return res.status(400).json({ message: 'Bad Request: invalid id' });

    const db = mongodb.getDb();
    const result = await db.collection('instructors').deleteOne({ _id });

    if (!result.deletedCount) return res.status(404).json({ message: 'Instructor not found' });
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error('Error deleting instructor:', error);
    res.status(500).json({ message: 'Error deleting instructor', error: error.message });
  }
};

module.exports = {
  getAllInstructors,
  getInstructorById,
  createInstructor,
  updateInstructor,
  deleteInstructor
};