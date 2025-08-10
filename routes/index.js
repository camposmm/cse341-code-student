const express = require('express');
const router = express.Router();

// Simple root (already existed in your app)
router.get('/', (req, res) => res.send('Welcome to the page'));

// ✅ Health check for Render (prevents 503 on cold start)
router.get('/healthz', (req, res) => res.status(200).send('ok'));

// Feature routes
router.use('/student', require('./student'));
router.use('/instructor', require('./instructor'));
router.use('/course', require('./course'));
router.use('/enrollments', require('./enrollment'));

// Swagger UI
router.use('/api-docs', require('./swagger'));

module.exports = router;