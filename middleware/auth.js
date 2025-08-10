const { expressjwt: jwt } = require('express-jwt'); // ✅ correct import for v7+
const jwksRsa = require('jwks-rsa');
require('dotenv').config();

/**
 * Middleware to validate JWTs from Auth0.
 * Uses RS256 asymmetric signing and pulls keys from the Auth0 JWKS endpoint.
 */
const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

/**
 * Optional convenience wrapper to catch JWT errors and respond with JSON
 */
const requireAuth = (req, res, next) => {
  checkJwt(req, res, (err) => {
    if (err) {
      console.error('Auth error:', err);
      return res.status(err.status || 401).json({
        error: 'Unauthorized',
        message: err.message || 'Invalid or missing token'
      });
    }
    next();
  });
};

module.exports = { checkJwt, requireAuth };