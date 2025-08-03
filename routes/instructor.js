const express = require("express");
const router = express.Router();
const instructorController = require("../controllers/instructorController");
const validation = require("../utilities/instructor-validation")

// Define routes for student operations
router.get("/",
    instructorController.getAllInstructors
); 

router.get(
    "/:id",
    instructorController.getInstructorById
);

router.post("/",
    validation.addInstructorRules(),
    validation.addInstructorValidation,
    instructorController.createInstructor
);

router.put(
    "/:id",
    validation.addInstructorRules(),
    validation.addInstructorValidation,
    instructorController.updateInstructor
);

router.delete(
    "/:id",
    instructorController.deleteInstructor
);

module.exports = router;