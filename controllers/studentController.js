const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const toObjectId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);

// GET /student/
const getAllStudents = async (req, res) => {
  //#swagger.tags = ['Students']
  try {
    const db = mongodb.getDb();
    const students = await db.collection('students').find({}).toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(students);
  } catch (error) {
    console.error('Error getting all students:', error);
    res.status(500).json({ message: 'Error retrieving students', error: error.message });
  }
};

// GET /student/:id
const getStudentById = async (req, res) => {
  //#swagger.tags = ['Students']
  try {
    const _id = toObjectId(req.params.id);
    if (!_id) return res.status(400).json({ message: 'Bad Request: invalid id' });

    const db = mongodb.getDb();
    const student = await db.collection('students').findOne({ _id });

    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(student);
  } catch (error) {
    console.error('Error getting student by ID:', error);
    res.status(500).json({ message: 'Error retrieving student', error: error.message });
  }
};

// POST /student/
const createStudent = async (req, res) => {
  //#swagger.tags = ['Students']
  try {
    const db = mongodb.getDb();
    const doc = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
      phone: req.body.phone,
      address: req.body.address,
      registrationDate: req.body.registrationDate,
      createdAt: new Date()
    };

    const result = await db.collection('students').insertOne(doc);
    res.status(201).json({ message: 'Created', _id: result.insertedId });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
};

// PUT /student/:id
const updateStudent = async (req, res) => {
  //#swagger.tags = ['Students']
  try {
    const _id = toObjectId(req.params.id);
    if (!_id) return res.status(400).json({ message: 'Bad Request: invalid id' });

    const db = mongodb.getDb();
    const update = {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        dateOfBirth: req.body.dateOfBirth,
        phone: req.body.phone,
        address: req.body.address,
        registrationDate: req.body.registrationDate,
        updatedAt: new Date()
      }
    };

    const result = await db.collection('students').updateOne({ _id }, update);
    if (!result.matchedCount) return res.status(404).json({ message: 'Student not found' });

    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
};

// DELETE /student/:id
const deleteStudent = async (req, res) => {
  //#swagger.tags = ['Students']
  try {
    const _id = toObjectId(req.params.id);
    if (!_id) return res.status(400).json({ message: 'Bad Request: invalid id' });

    const db = mongodb.getDb();
    const result = await db.collection('students').deleteOne({ _id });

    if (!result.deletedCount) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};