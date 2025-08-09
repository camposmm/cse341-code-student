const express = require('express');
const router = express.Router();
const courses = require('../controllers/courseController');
const validate = require('../utilities/course-validation');
const { requireAuth } = require('../middleware/auth');

// Public GETs
router.get('/', courses.getAllCourses);
router.get('/:id', courses.getCourseById);

// Protected POST/PUT (per your assignment)
router.post('/', requireAuth, validate.addCourseRules(), validate.addCourseValidation, courses.createCourse);
router.put('/:id', requireAuth, validate.addCourseRules(), validate.addCourseValidation, courses.updateCourse);

// Delete (your choice to protect or not)
router.delete('/:id', courses.deleteCourse);

module.exports = router;