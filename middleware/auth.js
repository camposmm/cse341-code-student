const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
require('dotenv').config();

const required = ['AUTH0_DOMAIN', 'AUTH0_AUDIENCE'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.warn(`[auth] Missing env: ${missing.join(', ')}`);
}

const checkJwt = missing.length
  ? (req, res) =>
      res.status(500).json({
        error: 'Auth configuration error',
        message:
          `Missing env vars: ${missing.join(', ')}. ` +
          `Set AUTH0_DOMAIN (e.g., your-tenant.us.auth0.com) and AUTH0_AUDIENCE.`
      })
  : jwt({
      secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
      }),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      algorithms: ['RS256']
    });

const requireAuth = (req, res, next) => {
  checkJwt(req, res, (err) => {
    if (err) {
      return res.status(err.status || 401).json({
        error: 'Unauthorized',
        message: err.message || 'Invalid or missing token'
      });
    }
    next();
  });
};

module.exports = { checkJwt, requireAuth };