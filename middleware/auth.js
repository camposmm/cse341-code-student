// middleware/auth.js
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const requireAuth = jwt({
  secret: jwksRsa.expressJwtSecret({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    cache: true,
    rateLimit: true
  }),
  audience: process.env.AUTH0_AUDIENCE,          // e.g. https://cse341-api.com
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,// e.g. https://camposmm.us.auth0.com/
  algorithms: ['RS256']
});

module.exports = { requireAuth };