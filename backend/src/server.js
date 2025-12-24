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
    origin: function (origin, callback) {
        const allowedOrigins = [
            ENV.FRONTEND_URL,
            'https://bliztar-app-frontend.vercel.app',
            'http://localhost:5173', // For local development
            'http://localhost:3000'
        ].filter(Boolean).map(url => url.replace(/\/$/, '')); // Remove trailing slashes
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const originWithoutSlash = origin.replace(/\/$/, '');
        if (allowedOrigins.includes(originWithoutSlash)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
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

const startServer = async() =>{
    await connectDB();
    app.listen(port,() =>{
        console.log(`Server is running on port ${port}`);
    });
};
startServer();