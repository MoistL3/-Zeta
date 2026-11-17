const bcrypt = require('bcryptjs') ;
const jwt = require('jsonwebtoken')
const { User } = require('../models/User');


const generate_token = (user_id)=>{
    const secret = process.env.JWT_SECRET ;
    if(!secret){
        throw new Error('JWT_SECRET is missing in .env');
    }
    return jwt.sign({ id : user_id },secret,{
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    })
}
// بنخلي يوزر جديد يخش بالايميل بتاعه
const register_user = async ({ name, email, password, role }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('Email is already registered');
        error.statusCode = 409;
        throw error;
    }
    const hashed_password = await bcrypt.hash(password , 12) ;
    const user = await User.create({
        name,
        email,
        password:hashed_password ,
        role
    })
    const token = generate_token(user._id)
    return {
        user :{
            id: user._id ,
            name: user.name ,
            email: user.email ,
            role:user.role
        } ,
        token
    } ;
};


const login_user = async({email,password})=>{
    if(!email||!password){
        const error = new Error('Please provide email and password') ;
        error.statusCode=400
        throw error ;
    }
    const user = await User.findOne({email}).select('+password') ;
    const valid_password = user && await bcrypt.compare(password , user.password) ;
    if(!valid_password){
        const error = new Error('Invalid email or password') ;
        error.statusCode=401 ;
        throw error ;
    }
    const token = generate_token(user._id) ;
    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
}
module.exports = {
    register_user,
    login_user,
};