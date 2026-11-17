const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = new Error('Access denied. No token provided.');
            error.statusCode = 401;
            return next(error);
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is missing in .env');
        }

        const decoded = jwt.verify(token, secret);
        if (typeof decoded === 'string' || !decoded.id) {
            const error = new Error('Invalid token');
            error.statusCode = 401;
            return next(error);
        }

        const user = await User.findOne({ _id: decoded.id });
        if (!user || !user.isActive) {
            const error = new Error('User no longer exists or is inactive');
            error.statusCode = 401;
            return next(error);
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            error.statusCode = 401;
            error.message = 'Invalid or expired token';
        }
        next(error);
    }
};

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            const error = new Error('You do not have permission to perform this action');
            error.statusCode = 403;
            return next(error);
        }
        next();
    };
};

module.exports = { authenticate, authorize };