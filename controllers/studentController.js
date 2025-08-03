const mongodb = require('../data/database');

const ObjectId = require('mongodb').ObjectId;

// Function to get all students
const getAllStudents = async (req, res) => {
    //#swagger.tags = ['Students']
  try {
    const result = await mongodb.getDb().db().collection('students').find();
    const students = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(students);
  } catch (error) {
    console.error("Error getting all students:", error);
    res.status(500).json({ message: 'Error retrieving students', error: error.message });
  }
}

// Function to get a student by id
const getStudentById = async (req, res) => {
    //#swagger.tags = ['Students']
  try {
    const stundentId = new ObjectId(req.params.id);
    const result = await mongodb
        .getDb()
        .db()
        .collection('students')
        .find({ _id: stundentId });
    
    const student = await result.toArray();

    if (student.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(student[0]);
  } catch (error) {
    console.error("Error getting user by ID:", error);
    res.status(500).json({ message: 'Error retrieving student', error: error.message });
  }
}

// Function to create a new student
const createStudent = async (req, res) => {
  //#swagger.tags = ['Students']
  try {
    const newStudent = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
      phone: req.body.phone,
      address: req.body.address,
      registrationDate: req.body.registrationDate,      
    };
    const result = await mongodb
      .getDb()
      .db()
      .collection('students')
      .insertOne(newStudent);
    
    if (result.acknowledged) {
      res.status(201).json({ message: 'Student created successfully', studentId: result.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to create student' });
    }
} catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
};

// Function to update a student by id
const updateStudent = async (req, res) => {
  //#swagger.tags = ['Students']
  try {
    const studentId = new ObjectId(req.params.id);
    const student = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
      phone: req.body.phone,
      address: req.body.address,
      registrationDate: req.body.registrationDate,      
    }
    const result = await mongodb
      .getDb()
      .db()
      .collection('students')
      .replaceOne({ _id: studentId }, student);

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Student updated successfully' });
    } else {
      res.status(404).json({ message: 'Student not found or no changes made' });
    }
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
};

// Delete a student by id
const deleteStudent = async (req, res) => {
  //#swagger.tags = ['Students']
    try {
        const studentId = new ObjectId(req.params.id);
        const result = await mongodb
        .getDb()
        .db()
        .collection('students')
        .deleteOne({ _id: studentId });
    
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Student deleted successfully' });  
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error("Error deleting student:", error);
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