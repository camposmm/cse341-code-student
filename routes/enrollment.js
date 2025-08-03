const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");

router.post("/", enrollmentController.enrollStudent);
router.delete("/:id", enrollmentController.dropEnrollment);
router.get("/student/:id", enrollmentController.getEnrollmentsByStudent);
router.get("/course/:id", enrollmentController.getEnrollmentsByCourse);
router.patch("/:id/progress", enrollmentController.updateEnrollmentProgress);

module.exports = router;