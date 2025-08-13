const express = require('express');
const { param, body, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const { requireAuth } = require('../middleware/auth');
const {
  enrollStudent,
  dropEnrollment,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
  updateEnrollmentProgress,
  updateEnrollment
} = require('../controllers/enrollmentController');

const router = express.Router();

// Validators
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

const updateEnrollmentRules = [
  body('studentId').optional().custom(v => ObjectId.isValid(v)).withMessage('studentId must be a valid ObjectId'),
  body('courseId').optional().custom(v => ObjectId.isValid(v)).withMessage('courseId must be a valid ObjectId'),
  body('progress').optional().isString().withMessage('progress must be a string')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Public GETs
router.get('/student/:id', idParamRule, validate, getEnrollmentsByStudent);
router.get('/course/:id', idParamRule, validate, getEnrollmentsByCourse);

// Protected writes
router.post('/', requireAuth, addEnrollmentRules, validate, enrollStudent);
router.put('/:id', requireAuth, idParamRule, updateEnrollmentRules, validate, updateEnrollment);
router.patch('/:id/progress', requireAuth, idParamRule, validate, updateEnrollmentProgress);
router.delete('/:id', requireAuth, idParamRule, validate, dropEnrollment);

module.exports = router;