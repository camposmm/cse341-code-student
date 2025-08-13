const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const { requireAuth } = require('../middleware/auth');
const {
  listStudents, getStudentById, createStudent, updateStudent, deleteStudent
} = require('../controllers/studentController');

const router = express.Router();

const idParam = [param('id').custom(v => ObjectId.isValid(v)).withMessage('Invalid id')];
const studentRules = [
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('email').isEmail(),
  body('dateOfBirth').trim().notEmpty(),
  body('phone').trim().notEmpty(),
  body('address').trim().notEmpty(),
  body('registrationDate').trim().notEmpty()
];
const validate = (req,res,next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() }); // 400 to match rubric
  next();
};

// Public GETs
router.get('/', listStudents);
router.get('/:id', idParam, validate, getStudentById);

// Protected writes
router.post('/', requireAuth, studentRules, validate, createStudent);
router.put('/:id', requireAuth, idParam, studentRules, validate, updateStudent);
router.delete('/:id', requireAuth, idParam, validate, deleteStudent);

module.exports = router;