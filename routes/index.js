// routes/index.js
const express = require('express');
const router = express.Router();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// Root: simple text message (no redirect, no JSON)
router.get('/', (req, res) => {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send('Learning Academy API');
});

// Health check (optional)
router.get('/healthz', (req, res) => res.status(200).json({ ok: true }));

// Feature routes
router.use('/student', require('./student'));
router.use('/instructor', require('./instructor'));
router.use('/course', require('./course'));
router.use('/enrollments', require('./enrollment'));

// Swagger UI
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

module.exports = router;