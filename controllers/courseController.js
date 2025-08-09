// controllers/courseController.js
const { ObjectId } = require('mongodb');
const db = require('../data/database');

// Collection name (keep consistent across your project)
const COLLECTION = 'courses';

// Helper: validate ObjectId
const toObjectId = (id) => {
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
};

/**
 * GET /course/
 * Return all courses
 */
const getAllCourses = async (req, res) => {
  try {
    const dbo = db.getDb();
    const docs = await dbo.collection(COLLECTION).find({}).toArray();
    res.status(200).json(docs);
  } catch (err) {
    console.error('getAllCourses error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * GET /course/:id
 * Return a single course by id
 */
const getCourseById = async (req, res) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Bad Request: invalid id' });

    const dbo = db.getDb();
    const doc = await dbo.collection(COLLECTION).findOne({ _id: id });

    if (!doc) return res.status(404).json({ error: 'Not Found' });
    res.status(200).json(doc);
  } catch (err) {
    console.error('getCourseById error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * POST /course/
 * Create a new course
 * Body: { title, description, level, durationWeeks, instructorId }
 * NOTE: Validation should be handled by express-validator in the route.
 */
const createCourse = async (req, res) => {
  try {
    const { title, description, level, durationWeeks, instructorId } = req.body;

    const dbo = db.getDb();
    const result = await dbo.collection(COLLECTION).insertOne({
      title,
      description,
      level,
      durationWeeks,
      instructorId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      message: 'Created',
      _id: result.insertedId,
    });
  } catch (err) {
    console.error('createCourse error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * PUT /course/:id
 * Update an existing course (full update)
 * Body: { title, description, level, durationWeeks, instructorId }
 * Returns 204 on success (per your Swagger)
 */
const updateCourse = async (req, res) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Bad Request: invalid id' });

    const { title, description, level, durationWeeks, instructorId } = req.body;

    const dbo = db.getDb();
    const result = await dbo.collection(COLLECTION).updateOne(
      { _id: id },
      {
        $set: {
          title,
          description,
          level,
          durationWeeks,
          instructorId,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Not Found' });
    }

    // Swagger expects 204 No Content
    return res.status(204).send();
  } catch (err) {
    console.error('updateCourse error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * DELETE /course/:id
 * Delete a course by id
 * Returns 204 on success (per your Swagger)
 */
const deleteCourse = async (req, res) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ error: 'Bad Request: invalid id' });

    const dbo = db.getDb();
    const result = await dbo.collection(COLLECTION).deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      // For your Swagger you return 500 or 204; 404 is fine semantically
      return res.status(404).json({ error: 'Not Found' });
    }

    // Swagger expects 204 No Content
    return res.status(204).send();
  } catch (err) {
    console.error('deleteCourse error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};