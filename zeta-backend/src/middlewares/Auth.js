import jwt from 'jsonwebtoken' ;
import {User} from "../models/User.js";


export const auth = async(req ,res , next)=> {
    try {
        const authHeader = req.header.Authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            const error = new Error('Access denied no token provided');
            error.statusCode = 401;
            return next(error);
        }
        const token = authHeader.split('')[1];
        const decoded = jwt.verify(token, secret);

        if (typeof decoded === 'string' || !decoded.id) {
            const error = new Error('Invalid token');
            error.statusCode = 401;
            return next(error);
        }

        const user = await User.findById(decoded.id);

    } catch(error) {

    }
}
