const { body, validationResult } = require('express-validator');

const addEnrollmentRules = () => [
  body('studentId').isString().isLength({ min: 10 }).withMessage('studentId required'),
  body('courseId').isString().isLength({ min: 10 }).withMessage('courseId required'),
];

const addEnrollmentValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  next();
};

module.exports = { addEnrollmentRules, addEnrollmentValidation };