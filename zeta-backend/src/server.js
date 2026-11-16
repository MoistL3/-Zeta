import 'dotenv/config'
import {connectDB} from "./config/db.js";
import express from "express"

const app = express() ;


connectDB().then(()=>{
    app.listen(3000 , ()=>{
        console.log("server is running")
    })
})