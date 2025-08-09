// routes/course.js
const router = require('express').Router();
const controller = require('../controllers/courseController');
const validate = require('../utilities/course-validation');

// PUBLIC GETs – no validation middleware here
router.get('/', controller.getAllCourses);
router.get('/:id', controller.getCourseById);

// CREATE
router.post(
  '/',
  validate.addCourseRules(),
  validate.handleValidation,
  controller.addCourse
);

// UPDATE
router.put(
  '/:id',
  validate.updateCourseRules(),
  validate.handleValidation,
  controller.updateCourse
);

// DELETE
router.delete('/:id', controller.deleteCourse);

module.exports = router;