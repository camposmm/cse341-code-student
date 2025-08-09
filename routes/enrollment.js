const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const { requireAuth } = require('../middleware/auth'); // ✅ add

// your existing validation (the file in your repo is 'enrolment-validation.js')
const {
  addEnrollmentRules,
  addEnrollmentValidation
} = require("../utilities/enrolment-validation");

// ✅ Protect POST
router.post(
  "/",
  requireAuth,
  addEnrollmentRules(),
  addEnrollmentValidation,
  enrollmentController.enrollStudent
);

// ✅ Protect DELETE
router.delete("/:id", requireAuth, enrollmentController.dropEnrollment);

// GETs stay public
router.get("/student/:id", enrollmentController.getEnrollmentsByStudent);
router.get("/course/:id", enrollmentController.getEnrollmentsByCourse);

// ✅ Protect PATCH
router.patch("/:id/progress", requireAuth, enrollmentController.updateEnrollmentProgress);

module.exports = router;