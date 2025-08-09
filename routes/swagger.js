// routes/swagger.js
const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const rawDocument = require('../swagger.json');

// Serve the Swagger UI assets
router.use('/', swaggerUi.serve);

// Build a fresh doc for each request (so host/schemes match the environment)
function buildDocument(req) {
  // Deep clone in case other middlewares mutate it
  const doc = JSON.parse(JSON.stringify(rawDocument));

  // Host: use the current request host (includes :port on localhost)
  doc.host = req.get('host');

  // Scheme: detect https when behind Render/Proxies
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  doc.schemes = [proto === 'https' ? 'https' : 'http'];

  return doc;
}

// Handler to init Swagger UI with the dynamic document
const uiHandler = (req, res, next) => {
  const dynamicDoc = buildDocument(req);
  return swaggerUi.setup(dynamicDoc, {
    swaggerOptions: {
      persistAuthorization: true,       // keep token when you refresh
      displayRequestDuration: true
    }
  })(req, res, next);
};

// Support /api-docs and /api-docs/index.html
router.get('/', uiHandler);
router.get('/index.html', uiHandler);

module.exports = router;