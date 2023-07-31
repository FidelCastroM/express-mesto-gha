const jwt = require('jsonwebtoken');
const ErrorAccess = require('../utils/errors/ErrorAccess');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new ErrorAccess('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new ErrorAccess('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
