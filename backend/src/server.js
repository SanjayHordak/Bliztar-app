import express from 'express';
import path from 'path';
import cors from 'cors';
import {ENV} from './config/env.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { functions, inngest } from './config/inngest.js';

const app = express();
const __dirname = path.resolve();
const port = ENV.PORT || 5000;

// CORS configuration - allow requests from Vercel frontend
const corsOptions = {
    origin: ENV.FRONTEND_URL || '*', // Set your Vercel URL in env
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(clerkMiddleware()); // Adds Clerk authentication middleware => req.auth
app.use("/api/inngest",serve({client:inngest, functions}));

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