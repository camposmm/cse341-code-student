const {body, validationResult} = require('express-validator');

const validate = {};

validate.addInstructorRules = () => {
    return [
        body('firstName')
          .trim()
          .escape()
          .notEmpty().withMessage('First name cannot be empty'),
        body('lastName')
          .trim()
          .escape()
          .notEmpty().withMessage('Last name cannot be empty'),
        body("email")
          .trim()
          .escape()
          .isEmail()
          .withMessage("Email is not valid, try again"),
        body('specialty')
          .trim()
          .escape()
          .notEmpty().withMessage('Specialty cannot be empty'),
        
    ]
};


validate.addInstructorValidation = (req, res, next) => {
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