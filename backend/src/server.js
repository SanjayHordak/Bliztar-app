import express from 'express';
import path from 'path';
import cors from 'cors';
import {ENV} from './config/env.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { functions, inngest } from './config/inngest.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js'
import orderRoute from './routes/orderRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'

const app = express();
const __dirname = path.resolve();
const port = ENV.PORT || 5000;

// CORS configuration - allow requests from Vercel frontend
const allowedOrigins = [
    ENV.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000'
].filter(Boolean).map(url => url?.replace(/\/$/, ''));

console.log('✅ CORS Allowed Origins:', allowedOrigins);

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin?.replace(/\/$/, ''))) {
            callback(null, true);
        } else {
            console.log('⚠️ CORS blocked origin:', origin);
            callback(null, true); // Allow all for now, can restrict later
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(clerkMiddleware()); // Adds Clerk authentication middleware => req.auth
app.use("/api/inngest",serve({client:inngest, functions}));



app.use('/api/admin',adminRoutes);
app.use('/api/users',userRoutes);
app.use('/api/orders',orderRoute);
app.use('/api/reviews',reviewRoutes);
app.use('/api/products',productRoutes);
app.use('/api/cart',cartRoutes)

app.get("/",(req,res)=>{
    res.status(200).json({
        message:'Bliztar Backend API', 
        status: 'Running',
        endpoints: {
            health: '/api/health',
            inngest: '/api/inngest'
        }
    });
});

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