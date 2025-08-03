const { ObjectId } = require("mongodb");
const { getDb } = require("../data/database");

// POST /api/enrollments
const enrollStudent = async (req, res) => {
  const { studentId, courseId } = req.body;
  if (!studentId || !courseId) {
    return res.status(400).json({ error: "studentId and courseId are required" });
  }

  try {
    const db = getDb();
    const result = await db.collection("enrollments").insertOne({
      studentId: new ObjectId(studentId),
      courseId: new ObjectId(courseId),
      progress: "enrolled",
      enrolledAt: new Date(),
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to enroll student", details: error.message });
  }
};

// DELETE /api/enrollments/:id
const dropEnrollment = async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDb();
    const result = await db.collection("enrollments").deleteOne({ _id: new ObjectId(id) });
    result.deletedCount === 1
      ? res.status(200).json({ message: "Enrollment deleted" })
      : res.status(404).json({ error: "Enrollment not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete enrollment", details: error.message });
  }
};

// GET /api/enrollments/student/:id
const getEnrollmentsByStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDb();
    const enrollments = await db
      .collection("enrollments")
      .find({ studentId: new ObjectId(id) })
      .toArray();
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enrollments", details: error.message });
  }
};

// GET /api/enrollments/course/:id
const getEnrollmentsByCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDb();
    const enrollments = await db
      .collection("enrollments")
      .find({ courseId: new ObjectId(id) })
      .toArray();
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enrollments", details: error.message });
  }
};

// PATCH /api/enrollments/:id/progress
const updateEnrollmentProgress = async (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;

  if (!progress) {
    return res.status(400).json({ error: "Progress is required" });
  }

  try {
    const db = getDb();
    const result = await db.collection("enrollments").updateOne(
      { _id: new ObjectId(id) },
      { $set: { progress } }
    );
    result.modifiedCount === 1
      ? res.status(200).json({ message: "Progress updated" })
      : res.status(404).json({ error: "Enrollment not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update progress", details: error.message });
  }
};

module.exports = {
  enrollStudent,
  dropEnrollment,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
  updateEnrollmentProgress,
};
