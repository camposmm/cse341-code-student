const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const { requireAuth } = require('../middleware/auth');
const {
  listCourses, getCourseById, createCourse, updateCourse, deleteCourse
} = require('../controllers/courseController');

const router = express.Router();

const idParam = [param('id').custom(v => ObjectId.isValid(v)).withMessage('Invalid id')];
const allowedLevels = ['Beginner', 'Intermediate', 'Advanced'];
const courseRules = [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('level').isIn(allowedLevels).withMessage('level must be one of: Beginner, Intermediate, Advanced'),
  body('durationWeeks').isInt({ min: 1 }).toInt(),
  body('instructorId').custom(v => ObjectId.isValid(v)).withMessage('instructorId must be a valid ObjectId')
];
const validate = (req,res,next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
  next();
};

// Public GETs
router.get('/', listCourses);
router.get('/:id', idParam, validate, getCourseById);

// Protected writes
router.post('/', requireAuth, courseRules, validate, createCourse);
router.put('/:id', requireAuth, idParam, courseRules, validate, updateCourse);
router.delete('/:id', requireAuth, idParam, validate, deleteCourse);

module.exports = router;