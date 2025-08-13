const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');
const { requireAuth } = require('../middleware/auth');
const {
  listInstructors, getInstructorById, createInstructor, updateInstructor, deleteInstructor
} = require('../controllers/instructorController');

const router = express.Router();

const idParam = [param('id').custom(v => ObjectId.isValid(v)).withMessage('Invalid id')];
const instructorRules = [
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('email').isEmail(),
  body('specialty').trim().notEmpty()
];
const validate = (req,res,next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
  next();
};

// Public GETs
router.get('/', listInstructors);
router.get('/:id', idParam, validate, getInstructorById);

// Protected writes
router.post('/', requireAuth, instructorRules, validate, createInstructor);
router.put('/:id', requireAuth, idParam, instructorRules, validate, updateInstructor);
router.delete('/:id', requireAuth, idParam, validate, deleteInstructor);

module.exports = router;