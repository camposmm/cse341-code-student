const express = require('express');
const router = express.Router();
const validate = require('../utilities/course-validation');

const courses = require('../controllers/courseController');

router.post('/',
    validate.addCourseRules(),
    validate.addCourseValidation,
    courses.createCourse
);

router.get('/',
    courses.getAll
);

router.get('/:id',
    courses.getById
);

router.put('/:id',
    validate.addCourseRules(),
    validate.addCourseValidation,
    courses.updateCourse
)

router.delete('/:id',
    courses.deleteCourse
);

module.exports = router;