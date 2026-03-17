const jwt = require('jsonwebtoken');
const SECRET  = process.env.JWT_SECRET  || 'smartmeal-secret';
const EXPIRES = process.env.JWT_EXPIRES || '7d';
const signToken   = (payload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
const verifyToken = (token)   => jwt.verify(token, SECRET);
module.exports = { signToken, verifyToken };
