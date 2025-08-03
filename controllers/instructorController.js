const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// GET all instructors
const getAllInstructors = async (req, res) => {
  //#swagger.tags = ['Instructors']
  try {
    const result = await mongodb.getDb().db().collection('instructors').find();
    const instructors = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(instructors);
  } catch (error) {
    console.error("Error getting all instructors:", error);
    res.status(500).json({ message: 'Error retrieving instructors', error: error.message });
  }
};

// GET instructor by ID
const getInstructorById = async (req, res) => {
  //#swagger.tags = ['Instructors']
  try {
    const instructorId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('instructors').find({ _id: instructorId });
    const instructor = await result.toArray();

    if (instructor.length === 0) {
      return res.status(404).json({ message: 'Instructor not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(instructor[0]);
  } catch (error) {
    console.error("Error getting instructor by ID:", error);
    res.status(500).json({ message: 'Error retrieving instructor', error: error.message });
  }
};

// POST new instructor
const createInstructor = async (req, res) => {
  //#swagger.tags = ['Instructors']
  try {
    const newInstructor = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      specialty: req.body.specialty,
    };

    const result = await mongodb.getDb().db().collection('instructors').insertOne(newInstructor);
    
    if (result.acknowledged) {
      res.status(201).json({ message: 'Instructor created successfully', instructorId: result.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to create instructor' });
    }
  } catch (error) {
    console.error("Error creating instructor:", error);
    res.status(500).json({ message: 'Error creating instructor', error: error.message });
  }
};

// PUT update instructor by ID
const updateInstructor = async (req, res) => {
  //#swagger.tags = ['Instructors']
  try {
    const instructorId = new ObjectId(req.params.id);
    const instructor = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      specialty: req.body.specialty,
    };

    const result = await mongodb.getDb().db().collection('instructors').replaceOne({ _id: instructorId }, instructor);

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Instructor updated successfully' });
    } else {
      res.status(404).json({ message: 'Instructor not found or no changes made' });
    }
  } catch (error) {
    console.error("Error updating instructor:", error);
    res.status(500).json({ message: 'Error updating instructor', error: error.message });
  }
};

// DELETE instructor by ID
const deleteInstructor = async (req, res) => {
  //#swagger.tags = ['Instructors']
  try {
    const instructorId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('instructors').deleteOne({ _id: instructorId });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Instructor deleted successfully' });
    } else {
      res.status(404).json({ message: 'Instructor not found' });
    }
  } catch (error) {
    console.error("Error deleting instructor:", error);
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
