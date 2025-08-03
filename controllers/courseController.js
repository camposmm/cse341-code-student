const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req,res) => {
    //#swagger.tags = ['Courses']
    try {
        const result = await mongodb.getDb().db().collection('courses').find();
        const courses = await result.toArray();
    
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(courses);
      } catch (error) {
        console.error("Error getting all students:", error);
        res.status(500).json({ message: 'Error retrieving students', error: error.message });
      }
};


const getById = async (req, res) => {
    //#swagger.tags = ['Courses']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid course id to find a user.');
        return;
    }
    try {
        const courseId = new ObjectId(req.params.id);
        const course = await mongodb.getDb().db().collection('courses').findOne({ _id: courseId });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCourse = async (req, res) => {
    //#swagger.tags = ['Courses']

    const course = {
        title: req.body.title,
        description: req.body.description,
        level: req.body.level,
        durationWeeks: req.body.durationWeeks,
        instructorId: req.body.instructorId,
    };

    try {
        const response = await mongodb.getDb().db().collection('courses').insertOne(course);
        if (response.acknowledged) {
            res.status(201).json(response);
        } else {
            res.status(500).json(response.error || 'Some error occurred while creating the course.');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCourse = async (req, res) => {
    //#swagger.tags = ['Courses']
  const courseId = new ObjectId(req.params.id);
  // be aware of updateOne if you only want to update specific fields
  const course = {
        title: req.body.title,
        description: req.body.description,
        level: req.body.level,
        durationWeeks: req.body.durationWeeks,
        instructorId: req.body.instructorId,
    };
    try {
      const response = await mongodb
      .getDb()
      .db()
      .collection('courses')
      .replaceOne({ _id: courseId }, course);
      console.log(response);
      if (response.modifiedCount > 0) {
        res.status(204).send();
      } else {
        res.status(500).json(response.error || 'Some error occurred while updating the course.');
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }

};

const deleteCourse = async (req, res) => {
    //#swagger.tags = ['Courses']
  const courseId = new ObjectId(req.params.id);
  try {
    const response = await mongodb.getDb().db().collection('courses').deleteOne({ _id: courseId }, true);
    console.log(response);
    if (response.deletedCount === 1) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the course.');
    }
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    getAll,
    getById,
    createCourse,
    updateCourse,
    deleteCourse
};