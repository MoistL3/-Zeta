import mongoose from 'mongoose';
export const connectDB = async ()=>{
    try{
        const connect = await mongoose.connect('mongodb://admin:password123@localhost:27017/mydb?authSource=admin') ;
        console.log(`database connected : ${connect.connection.host}`) ;
    }catch (error){
        console.log(`error in db connection : ${error.message} `)
        process.exit(1);
    }
}