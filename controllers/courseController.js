// controllers/courseController.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../data/database');

const COLLECTION = 'courses';

exports.getAllCourses = async (req, res) => {
  try {
    const db = getDb();
    const docs = await db.collection(COLLECTION).find({}).toArray();
    res.status(200).json(docs);
  } catch (err) {
    console.error('getAllCourses error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const db = getDb();
    const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(doc);
  } catch (err) {
    console.error('getCourseById error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addCourse = async (req, res) => {
  try {
    const { title, description, level, durationWeeks, instructorId } = req.body;

    const db = getDb();

    // (Optional) ensure the instructor exists
    const instructor = await db
      .collection('instructors')
      .findOne({ _id: new ObjectId(instructorId) });
    if (!instructor) {
      return res.status(400).json({ error: 'instructorId not found' });
    }

    const toInsert = {
      title,
      description,
      level,
      durationWeeks: Number(durationWeeks),
      instructorId: new ObjectId(instructorId),
      createdAt: new Date(),
    };

    const result = await db.collection(COLLECTION).insertOne(toInsert);
    res.status(201).json({ _id: result.insertedId, ...toInsert });
  } catch (err) {
    console.error('addCourse error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const payload = { ...req.body };
    if (payload.durationWeeks != null) payload.durationWeeks = Number(payload.durationWeeks);
    if (payload.instructorId) payload.instructorId = new ObjectId(payload.instructorId);

    const db = getDb();
    const result = await db
      .collection(COLLECTION)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: payload, $currentDate: { updatedAt: true } },
        { returnDocument: 'after' }
      );

    if (!result.value) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(result.value);
  } catch (err) {
    console.error('updateCourse error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const db = getDb();
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    console.error('deleteCourse error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};