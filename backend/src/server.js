import express from 'express';
import path from 'path';
import {ENV} from './config/env.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware } from '@clerk/express'

const app = express();
const __dirname = path.resolve();
const port = ENV.PORT || 5000;

app.use(clerkMiddleware()); // Adds Clerk authentication middleware => req.auth

app.get("/api/health",(req,res)=>{
    res.status(200).json({message:'Success'});
});

//make the app for deployment
if(ENV.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname,'../../admin/dist')));

    app.get("/{*any}",(req,res)=>{
        res.sendFile(path.join(__dirname,"../../admin","dist","index.html"));
    })
};
const startServer = async() =>{
    await connectDB();
    app.listen(port,() =>{
        console.log(`Server is running on port ${port}`);
    });
};
startServer();