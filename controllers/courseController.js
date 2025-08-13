const { ObjectId } = require('mongodb');
const { getDb } = require('../data/database');

async function listCourses(req, res) {
  try {
    const db = getDb();
    const docs = await db.collection('courses').find({}).toArray();
    res.status(200).json(docs);
  } catch (e) {
    console.error('listCourses error:', e);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

async function getCourseById(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid course id' });
  try {
    const db = getDb();
    const doc = await db.collection('courses').findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).json({ error: 'Course not found' });
    res.status(200).json(doc);
  } catch (e) {
    console.error('getCourseById error:', e);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
}

async function createCourse(req, res) {
  const { title, description, level, durationWeeks, instructorId } = req.body || {};
  if (!ObjectId.isValid(instructorId)) return res.status(400).json({ error: 'instructorId must be a valid ObjectId' });

  try {
    const db = getDb();
    const instructor = await db.collection('instructors').findOne({ _id: new ObjectId(instructorId) });
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });

    const { insertedId } = await db.collection('courses').insertOne({
      title,
      description,
      level,
      durationWeeks,
      instructorId: new ObjectId(instructorId)
    });
    const created = await db.collection('courses').findOne({ _id: insertedId });
    res.status(201).json(created);
  } catch (e) {
    console.error('createCourse error:', e);
    res.status(500).json({ error: 'Failed to create course' });
  }
}

async function updateCourse(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid course id' });

  const { title, description, level, durationWeeks, instructorId } = req.body || {};
  if (!ObjectId.isValid(instructorId)) return res.status(400).json({ error: 'instructorId must be a valid ObjectId' });

  try {
    const db = getDb();
    const instructor = await db.collection('instructors').findOne({ _id: new ObjectId(instructorId) });
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });

    const result = await db.collection('courses').updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, description, level, durationWeeks, instructorId: new ObjectId(instructorId) } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Course not found' });
    const updated = await db.collection('courses').findOne({ _id: new ObjectId(id) });
    res.status(200).json(updated);
  } catch (e) {
    console.error('updateCourse error:', e);
    res.status(500).json({ error: 'Failed to update course' });
  }
}

async function deleteCourse(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid course id' });
  try {
    const db = getDb();
    const result = await db.collection('courses').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Course not found' });
    res.status(200).json({ message: 'Course deleted' });
  } catch (e) {
    console.error('deleteCourse error:', e);
    res.status(500).json({ error: 'Failed to delete course' });
  }
}

module.exports = {
  listCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};