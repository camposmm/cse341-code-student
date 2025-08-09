// utilities/course-validation.js
const { body, validationResult, param } = require('express-validator');

const allowedLevels = ['Beginner', 'Intermediate', 'Advanced'];

const addCourseRules = () => [
  body('title').trim().notEmpty().withMessage('title is required'),
  body('description').trim().notEmpty().withMessage('description is required'),
  body('level')
    .trim()
    .isIn(allowedLevels)
    .withMessage(`level must be one of: ${allowedLevels.join(', ')}`),
  body('durationWeeks')
    .toInt()
    .isInt({ min: 1, max: 52 })
    .withMessage('durationWeeks must be an integer between 1 and 52'),
  body('instructorId')
    .isMongoId()
    .withMessage('instructorId must be a valid Mongo ObjectId'),
];

const updateCourseRules = () => [
  param('id').isMongoId().withMessage('invalid course id'),
  body('title').optional().trim().notEmpty().withMessage('title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('description cannot be empty'),
  body('level')
    .optional()
    .trim()
    .isIn(allowedLevels)
    .withMessage(`level must be one of: ${allowedLevels.join(', ')}`),
  body('durationWeeks')
    .optional()
    .toInt()
    .isInt({ min: 1, max: 52 })
    .withMessage('durationWeeks must be an integer between 1 and 52'),
  body('instructorId')
    .optional()
    .isMongoId()
    .withMessage('instructorId must be a valid Mongo ObjectId'),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

module.exports = { addCourseRules, updateCourseRules, handleValidation };