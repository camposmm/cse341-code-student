const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/enrollmentController');
const {
  addEnrollmentRules,
  idParamRule,
  validate
} = require('../utilities/enrolment-validation');

// ✅ Import your Auth middleware directly
const { requireAuth } = require('../middleware/auth');

// -------- Public GETs --------
router.get('/student/:id', idParamRule(), validate, ctrl.getEnrollmentsByStudent);
router.get('/course/:id', idParamRule(), validate, ctrl.getEnrollmentsByCourse);

// -------- Protected writes --------
router.post('/', requireAuth, addEnrollmentRules(), validate, ctrl.enrollStudent);
router.delete('/:id', requireAuth, idParamRule(), validate, ctrl.dropEnrollment);
router.patch('/:id/progress', requireAuth, idParamRule(), validate, ctrl.updateEnrollmentProgress);

module.exports = router;