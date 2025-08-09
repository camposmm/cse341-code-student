// routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('Welcome to the page'));

// ✅ add this line
router.get('/healthz', (req, res) => res.status(200).send('ok'));

router.use('/student', require('./student'));
router.use('/instructor', require('./instructor'));
router.use('/course', require('./course'));
router.use('/enrollments', require('./enrollment'));

router.use('/api-docs', require('./swagger'));
module.exports = router;