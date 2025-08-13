const express = require('express');
const router = express.Router();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// Health check
router.get('/healthz', (req, res) => res.status(200).json({ ok: true }));

// Feature routes
router.use('/student', require('./student'));
router.use('/instructor', require('./instructor'));
router.use('/course', require('./course'));
router.use('/enrollments', require('./enrollment'));

// Swagger
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

module.exports = router;