
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

const authUser = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new AppError('No token provided. Please log in', 401));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('You are not logged in', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`Role '${req.user.role}' is not allowed to access this route`, 403)
      );
    }
    next();
  };
};

export { authUser, authorizeRoles };