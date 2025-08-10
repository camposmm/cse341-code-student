const express = require('express');
const { param, body, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const router = express.Router();

// --- Auth (must export { requireAuth } from middleware/auth.js)
const { requireAuth } = require('../middleware/auth');

// --- Controllers: import each handler by name
const {
  enrollStudent,
  dropEnrollment,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
  updateEnrollmentProgress,
} = require('../controllers/enrollmentController');

// --- Inline validators (no external util import = fewer path issues)
const idParamRule = [
  param('id')
    .custom((v) => ObjectId.isValid(v))
    .withMessage('id must be a valid Mongo ObjectId'),
];

const addEnrollmentRules = [
  body('studentId')
    .custom((v) => ObjectId.isValid(v))
    .withMessage('studentId must be a valid Mongo ObjectId'),
  body('courseId')
    .custom((v) => ObjectId.isValid(v))
    .withMessage('courseId must be a valid Mongo ObjectId'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  next();
};

// --- Sanity checks so Express never sees undefined “handlers”
function assertFn(name, fn) {
  if (typeof fn !== 'function') {
    throw new Error(
      `Route wiring error: "${name}" is not a function. ` +
      `Check ../controllers/enrollmentController.js exports.`
    );
  }
}
assertFn('requireAuth', requireAuth);
assertFn('enrollStudent', enrollStudent);
assertFn('dropEnrollment', dropEnrollment);
assertFn('getEnrollmentsByStudent', getEnrollmentsByStudent);
assertFn('getEnrollmentsByCourse', getEnrollmentsByCourse);
assertFn('updateEnrollmentProgress', updateEnrollmentProgress);

// -------- Public GETs --------
router.get('/student/:id', idParamRule, validate, getEnrollmentsByStudent);
router.get('/course/:id', idParamRule, validate, getEnrollmentsByCourse);

// (Optional) fetch one enrollment by its _id (handy for debugging)
router.get('/:id', idParamRule, validate, async (req, res) => {
  try {
    const db = require('../data/database').getDb();
    const doc = await db
      .collection('enrollments')
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!doc) return res.status(404).json({ error: 'Enrollment not found' });
    res.status(200).json(doc);
  } catch (e) {
    console.error('Failed to get enrollment by id:', e);
    res.status(500).json({ error: 'Failed to fetch enrollment' });
  }
});

// -------- Protected writes --------
router.post('/', requireAuth, addEnrollmentRules, validate, enrollStudent);
router.delete('/:id', requireAuth, idParamRule, validate, dropEnrollment);
router.patch('/:id/progress', requireAuth, idParamRule, validate, updateEnrollmentProgress);

module.exports = router;