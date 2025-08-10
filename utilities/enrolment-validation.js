const { body, validationResult, param } = require('express-validator');
const { ObjectId } = require('mongodb');

// Validate POST body
const addEnrollmentRules = () => [
  body('studentId')
    .custom((v) => ObjectId.isValid(v))
    .withMessage('studentId must be a valid Mongo ObjectId'),
  body('courseId')
    .custom((v) => ObjectId.isValid(v))
    .withMessage('courseId must be a valid Mongo ObjectId')
];

// Validate :id param when needed
const idParamRule = () => [
  param('id')
    .custom((v) => ObjectId.isValid(v))
    .withMessage('id must be a valid Mongo ObjectId')
];

// Common validator runner
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  next();
};

module.exports = {
  addEnrollmentRules,
  idParamRule,
  validate
};