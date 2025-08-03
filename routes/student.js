const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const validation = require("../utilities/student-validation");

// Define routes for student operations
router.get("/",
    studentController.getAllStudents
); 

router.get(
    "/:id",
    studentController.getStudentById
);

router.post("/",
    validation.addStudentRules(),
    validation.addStudentValidation,
    studentController.createStudent
);

router.put(
    "/:id",
    validation.addStudentRules(),
    validation.addStudentValidation,
    studentController.updateStudent
);

router.delete(
    "/:id",
    studentController.deleteStudent
);

module.exports = router;