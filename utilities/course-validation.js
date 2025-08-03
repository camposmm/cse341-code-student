const {body, validationResult} = require('express-validator');

const validate = {};

validate.addCourseRules = () => {
    return [
        body('title')
          .trim()
          .escape()
          .notEmpty().withMessage('Title cannot be empty'),
        body('description')
          .trim()
          .escape()
          .notEmpty().withMessage('Description cannot be empty'),
        body('level')
          .trim()
          .escape()
          .notEmpty().withMessage('Level cannot be empty'),
        body('durationWeeks')
          .trim()
          .escape()
          .isNumeric().withMessage('Duration in weeks must be a number')
          .notEmpty().withMessage('Add the duration of the course in weeks.'),
        body('instructorId')
          .trim()
          .escape()
          .notEmpty().withMessage('Instructor id cannot be empty'),
        
    ]
};


validate.addCourseValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({[err.param]: err.msg}));
    return res.status(422).json({
        errors : extractedErrors,
    })
};

module.exports = validate;