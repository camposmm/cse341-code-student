// routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('Welcome to the page'));

router.use('/student', require('./student'));
router.use('/instructor', require('./instructor'));
router.use('/course', require('./course'));
router.use('/enrollments', require('./enrollment'));

// ✅ Swagger UI
router.use('/api-docs', require('./swagger'));

module.exports = router;