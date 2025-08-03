const {body, validationResult} = require('express-validator');

const validate = {};

validate.addStudentRules = () => {
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
        body('dateOfBirth')
          .trim()
          .escape()
          .notEmpty().withMessage('Date of birth cannot be empty'),
        body('phone')
          .trim()
          .escape()
          .notEmpty().withMessage('Phone cannot be empty'),
        body('address')
          .trim()
          .escape()
          .notEmpty().withMessage('Address cannot be empty'),
        body('registrationDate')
          .trim()
          .escape()
          .notEmpty().withMessage('Date of registration cannot be empty')           
    ]
};


validate.addStudentValidation = (req, res, next) => {
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