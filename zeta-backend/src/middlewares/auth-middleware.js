const User = require('../models/User');
const { verify_token } = require('../services/auth_service');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Access denied. No token provided.');
        }

        const token = authHeader.split(' ')[1];
        const decoded = verify_token(token);

        const user = await User.findOne({ _id: decoded.id });
        if (!user || !user.isActive) {
            throw new UnauthorizedError('User no longer exists or is inactive');
        }

        req.user = user;
        next();
    } catch (error) {
        next(error); // هيروح للـ errorHandler مباشرة، ولو التوكن منتهي أو مضروب هيترجمه لـ 401
    }
};

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(new ForbiddenError('You do not have permission to perform this action'));
        }
        next();
    };
};

module.exports = { authenticate, authorize };