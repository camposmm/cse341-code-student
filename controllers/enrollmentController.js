// controllers/enrollmentController.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../data/database');

/**
 * POST /enrollments
 * body: { studentId: "<ObjectId>", courseId: "<ObjectId>" }
 */
async function enrollStudent(req, res) {
  const { studentId, courseId } = req.body || {};

  if (!studentId || !courseId) {
    return res.status(400).json({ error: 'studentId and courseId are required' });
  }
  if (!ObjectId.isValid(studentId) || !ObjectId.isValid(courseId)) {
    return res.status(400).json({ error: 'studentId/courseId must be valid ObjectIds' });
  }

  try {
    const db = getDb();

    // Ensure referenced student & course exist
    const [student, course] = await Promise.all([
      db.collection('students').findOne({ _id: new ObjectId(studentId) }),
      db.collection('courses').findOne({ _id: new ObjectId(courseId) })
    ]);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Prevent duplicate enrollment
    const existing = await db.collection('enrollments').findOne({
      studentId: new ObjectId(studentId),
      courseId: new ObjectId(courseId)
    });
    if (existing) {
      return res.status(409).json({ error: 'Student already enrolled in this course' });
    }

    const doc = {
      studentId: new ObjectId(studentId),
      courseId: new ObjectId(courseId),
      progress: 'enrolled',
      enrolledAt: new Date()
    };

    const result = await db.collection('enrollments').insertOne(doc);

    // Optional Location header to the new resource
    res
      .status(201)
      .location(`/enrollments/${result.insertedId}`)
      .json({ message: 'Enrollment created', _id: result.insertedId, ...doc });
  } catch (err) {
    console.error('Failed to enroll student:', err);
    res.status(500).json({ error: 'Failed to enroll student' });
  }
}

/**
 * DELETE /enrollments/:id
 */
async function dropEnrollment(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid enrollment id' });
  }

  try {
    const db = getDb();
    const result = await db.collection('enrollments').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }
    res.status(200).json({ message: 'Enrollment deleted' });
  } catch (err) {
    console.error('Failed to delete enrollment:', err);
    res.status(500).json({ error: 'Failed to delete enrollment' });
  }
}

/**
 * GET /enrollments/student/:id
 */
async function getEnrollmentsByStudent(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid student id' });
  }

  try {
    const db = getDb();
    const list = await db
      .collection('enrollments')
      .find({ studentId: new ObjectId(id) })
      .toArray();
    res.status(200).json(list);
  } catch (err) {
    console.error('Failed to fetch enrollments by student:', err);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
}

/**
 * GET /enrollments/course/:id
 */
async function getEnrollmentsByCourse(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid course id' });
  }

  try {
    const db = getDb();
    const list = await db
      .collection('enrollments')
      .find({ courseId: new ObjectId(id) })
      .toArray();
    res.status(200).json(list);
  } catch (err) {
    console.error('Failed to fetch enrollments by course:', err);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
}

/**
 * PATCH /enrollments/:id/progress
 * body: { progress: "enrolled" | "in-progress" | "completed" | ... }
 */
async function updateEnrollmentProgress(req, res) {
  const { id } = req.params;
  const { progress } = req.body || {};

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid enrollment id' });
  }
  if (!progress || typeof progress !== 'string') {
    return res.status(400).json({ error: 'progress is required (string)' });
  }

  try {
    const db = getDb();
    const _id = new ObjectId(id);

    // Update then fetch (most compatible across driver versions)
    const result = await db.collection('enrollments')
      .updateOne({ _id }, { $set: { progress } });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    const updated = await db.collection('enrollments').findOne({ _id });
    res.status(200).json({ message: 'Progress updated', enrollment: updated });
  } catch (err) {
    console.error('Failed to update enrollment:', err);
    res.status(500).json({ error: 'Failed to update enrollment' });
  }
}

module.exports = {
  enrollStudent,
  dropEnrollment,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
  updateEnrollmentProgress
};